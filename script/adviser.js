// =============================================================
// adviser.js — Unified Adviser Portal Script
// Covers:
//   · adviser_dashboard.html  (My Students — review, edit, proceed)
//   · submitted.html          (Submission History — recall)
//   · correction.html         (For Correction — resubmit flagged records)
//
// Page detection: each section's init checks for a unique
// DOM element before running, so all three pages can safely
// load this single file without errors.
// =============================================================


// ─────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────

function escHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;");
}

function getInitials(name) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

/** Show a toast notification. type: "success" | "warning" | "error" */
function showToast(message, type = "success") {
    // correction.html uses .correction-toast; other pages get a generic one
    const toast = document.createElement("div");
    toast.className   = "correction-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}


// =============================================================
// SECTION 1 — ADVISER DASHBOARD (adviser_dashboard.html)
// Handles: student card filter pills, modal edit table,
//          add/delete/edit subject rows, proceed action.
// Trigger element: #student-list
// =============================================================

function initAdviserDashboard() {
    if (!document.getElementById("student-list")) return;

    // ── DATA ──────────────────────────────────────────────────
    // Each student mirrors one card + one modal in the HTML.
    // subjects array is the source of truth for the edit table.
    const students = [
        {
            id:       "2024-001234",
            name:     "Juan Dela Cruz",
            initials: "JDC",
            year:     "Year 3",
            section:  "CS-3B",
            type:     "regular",
            status:   "pending",
            modalId:  "modal-juan",
            subjects: [
                { code: "CS 401", description: "Capstone Project 1",    day: "MWF", time: "8:00–9:00 AM",   room: "CS-401", section: "CS-4A", units: "3.00" },
                { code: "DS 131", description: "Discrete Structures 3",  day: "TTh", time: "10:00–11:30 AM", room: "CS-202", section: "CS-3B", units: "3.00" },
                { code: "CS 106", description: "Cyber Security",         day: "MWF", time: "1:00–2:00 PM",   room: "CS-301", section: "CS-3B", units: "5.00" },
            ]
        },
        {
            id:       "2025-001234",
            name:     "Cassidy Himodo",
            initials: "CH",
            year:     "Year 2",
            section:  "CS-2A",
            type:     "regular",
            status:   "action",
            modalId:  "modal-cassidy",
            subjects: [
                { code: "CC 104", description: "Data Structures & Algorithms", day: "TTh", time: "8:00–9:30 AM", room: "CS-101", section: "CS-2A", units: "3.00" },
            ]
        },
    ];

    // Track which student's modal is open
    let activeDashboardStudent = null;

    // ── MODAL: populate table from data on open ───────────────
    function buildModalTable(student) {
        const modal = document.getElementById(student.modalId);
        if (!modal) return;
        const tbody = modal.querySelector("tbody");
        if (!tbody) return;

        tbody.innerHTML = student.subjects.map((sub, i) =>
            buildDashboardRow(sub, i, student)
        ).join("");

        attachDashboardRowListeners(student);
        updateDashboardUnitCount(student);
    }

    function buildDashboardRow(sub, i, student) {
        return `
        <tr id="dash-row-${student.id}-${i}">
            <td class="action-cell">
                <button class="icon-btn delete" title="Delete"
                    onclick="dashDeleteRow('${student.id}', ${i})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="icon-btn edit" title="Edit"
                    onclick="dashToggleEdit('${student.id}', ${i})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
            <td class="cell-code"    data-field="code">${escHtml(sub.code)}</td>
            <td class="cell-desc"    data-field="description">${escHtml(sub.description)}</td>
            <td class="cell-day"     data-field="day">${escHtml(sub.day)}</td>
            <td class="cell-time"    data-field="time">${escHtml(sub.time)}</td>
            <td class="cell-room"    data-field="room">${escHtml(sub.room)}</td>
            <td class="cell-section" data-field="section">${escHtml(sub.section)}</td>
            <td class="cell-units"   data-field="units">${escHtml(sub.units)}</td>
        </tr>`;
    }

    // Make row edit/save functions globally accessible (called from onclick attrs)
    window.dashToggleEdit = function(studentId, rowIdx) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        const row   = document.getElementById(`dash-row-${studentId}-${rowIdx}`);
        if (!row) return;
        const cells = row.querySelectorAll("td[data-field]");
        const isEditing = row.classList.toggle("editing");

        cells.forEach(cell => {
            const field = cell.dataset.field;
            if (isEditing) {
                const val = cell.textContent.trim();
                cell.innerHTML = `<input class="id-edit" type="text"
                    value="${escHtml(val)}" data-field="${field}" style="width:100%;">`;
            } else {
                const input  = cell.querySelector("input");
                const newVal = input ? input.value.trim() : cell.textContent.trim();
                cell.textContent = newVal;
                if (student.subjects[rowIdx]) {
                    student.subjects[rowIdx][field] = newVal;
                }
            }
        });

        const editBtn = row.querySelector(".icon-btn.edit, .icon-btn.save");
        if (editBtn) {
            if (isEditing) {
                editBtn.className = "icon-btn save";
                editBtn.title     = "Save";
                editBtn.innerHTML = `<i class="fas fa-check"></i>`;
                editBtn.setAttribute("onclick", `dashToggleEdit('${studentId}', ${rowIdx})`);
            } else {
                editBtn.className = "icon-btn edit";
                editBtn.title     = "Edit";
                editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
                updateDashboardUnitCount(student);
            }
        }
    };

    window.dashDeleteRow = function(studentId, rowIdx) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        student.subjects.splice(rowIdx, 1);
        buildModalTable(student);
    };

    function attachDashboardRowListeners(student) {
        const modal  = document.getElementById(student.modalId);
        const addBtn = modal?.querySelector(".btn-add");
        if (addBtn) {
            // Replace to avoid duplicate listeners
            const clone = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(clone, addBtn);
            clone.addEventListener("click", () => {
                student.subjects.push({ code: "", description: "", day: "", time: "", room: "", section: "", units: "0" });
                buildModalTable(student);
                const newIdx = student.subjects.length - 1;
                window.dashToggleEdit(student.id, newIdx);
                document.getElementById(`dash-row-${student.id}-${newIdx}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    }

    function updateDashboardUnitCount(student) {
        const total = student.subjects.reduce((sum, s) => sum + parseFloat(s.units || 0), 0);
        // Update the card's unit display
        const card = document.querySelector(`.student-card[data-id="${student.id}"] .enrolled-title`);
        if (card) card.textContent = `Enrolled Subjects (${total.toFixed(2)} units)`;
    }

    // ── PROCEED BUTTON ────────────────────────────────────────
    document.querySelectorAll(".btn-proceed").forEach((btn, i) => {
        btn.addEventListener("click", () => {
            const student = students[i];
            if (!student) return;

            // Move student to submittedStudents data array
            // (in real system this would be an API call)
            submittedStudents.push({
                id:            student.id,
                name:          student.name,
                section:       student.section,
                year:          student.year,
                type:          student.type.charAt(0).toUpperCase() + student.type.slice(1),
                units:         student.subjects.reduce((s, sub) => s + parseFloat(sub.units || 0), 0).toFixed(2),
                dateSubmitted: new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }),
                status:        "submitted"
            });

            showToast(`✓ ${student.name} submitted to Assessment Office.`);

            // Visually remove the card
            const card = document.querySelector(`.student-card[data-id="${student.id}"]`);
            if (card) {
                card.style.opacity    = "0";
                card.style.transition = "opacity 0.3s";
                setTimeout(() => card.remove(), 300);
            }
        });
    });

    // ── OPEN MODALS on hash change (anchor links) ─────────────
    // adviser_dashboard uses <a href="#modal-juan"> pattern
    function handleHashModal() {
        const hash = window.location.hash;
        if (!hash) return;
        const modal = document.querySelector(hash + ".modal-overlay");
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
            // Find which student this modal belongs to
            activeDashboardStudent = students.find(s => "#" + s.modalId === hash) || null;
            if (activeDashboardStudent) buildModalTable(activeDashboardStudent);
        }
    }

    window.addEventListener("hashchange", handleHashModal);
    handleHashModal(); // run on load in case page opened with hash

    // Close modals on close-btn click
    document.querySelectorAll(".modal-overlay .close-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const overlay = btn.closest(".modal-overlay");
            if (overlay) {
                overlay.classList.remove("active");
                document.body.style.overflow = "";
                history.pushState(null, "", window.location.pathname);
            }
        });
    });

    // Close on backdrop click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", e => {
            if (e.target === overlay) {
                overlay.classList.remove("active");
                document.body.style.overflow = "";
                history.pushState(null, "", window.location.pathname);
            }
        });
    });

    // Tag each card with its student id for targeting
    document.querySelectorAll(".student-card").forEach((card, i) => {
        if (students[i]) card.dataset.id = students[i].id;
    });
}


// =============================================================
// SECTION 2 — SUBMITTED HISTORY (submitted.html)
// Handles: table render, search, section filter, recall modal.
// Trigger element: #tableBody
// =============================================================

// Shared array — also writable by adviser_dashboard proceed action
const submittedStudents = [
    { id: "2024-001235", name: "Maria Santos",    section: "CS-3B", year: "Year 3", type: "Regular",   units: "25.00", dateSubmitted: "March 8, 2026",  status: "submitted"  },
    { id: "2025-001234", name: "Cassidy Himodo",  section: "CS-2A", year: "Year 2", type: "Regular",   units: "22.00", dateSubmitted: "March 9, 2026",  status: "submitted"  },
    { id: "2024-001234", name: "Juan Dela Cruz",  section: "CS-3B", year: "Year 3", type: "Irregular", units: "20.00", dateSubmitted: "March 10, 2026", status: "processing" },
    { id: "2023-009812", name: "Renee Alcantara", section: "CS-4A", year: "Year 4", type: "Regular",   units: "18.00", dateSubmitted: "March 7, 2026",  status: "recalled"   },
    { id: "2024-005571", name: "Liam Ferrer",     section: "CS-2A", year: "Year 2", type: "Irregular", units: "15.00", dateSubmitted: "March 11, 2026", status: "submitted"  }
];

function initSubmittedPage() {
    if (!document.getElementById("tableBody")) return;

    let recallTarget = null;

    // ── BADGES ────────────────────────────────────────────────
    function typeBadge(type) {
        const cls = type.toLowerCase() === "regular" ? "regular" : "irregular";
        return `<span class="type-badge ${cls}">${type}</span>`;
    }

    function statusBadge(status) {
        const map = {
            submitted:  ["Submitted",  "submitted"],
            processing: ["Processing", "processing"],
            recalled:   ["Recalled",   "recalled"],
            flagged:    ["Flagged",    "flagged"],
        };
        const [label, cls] = map[status] || ["Unknown", "submitted"];
        return `<span class="status-badge ${cls}">${label}</span>`;
    }

    // ── RENDER TABLE ──────────────────────────────────────────
    function renderTable(data) {
        const tbody      = document.getElementById("tableBody");
        const emptyState = document.getElementById("emptyState");

        tbody.innerHTML = "";

        if (data.length === 0) {
            if (emptyState) emptyState.style.display = "block";
            return;
        }
        if (emptyState) emptyState.style.display = "none";

        data.forEach((s, idx) => {
            const origIdx  = submittedStudents.indexOf(s);
            const recalled = s.status === "recalled";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="row-num">${idx + 1}</span></td>
                <td>
                    <div class="student-cell">
                        <div class="table-avatar">${getInitials(s.name)}</div>
                        <span class="student-full-name">${s.name}</span>
                    </div>
                </td>
                <td>${s.id}</td>
                <td>${s.section}</td>
                <td>${s.year}</td>
                <td>${typeBadge(s.type)}</td>
                <td><strong>${s.units}</strong></td>
                <td>${s.dateSubmitted}</td>
                <td>${statusBadge(s.status)}</td>
                <td>
                    <button class="btn-recall"
                        data-index="${origIdx}"
                        ${recalled ? "disabled" : ""}
                        title="${recalled ? "Already recalled" : "Recall this student"}">
                        <i class="fas fa-undo"></i> Recall
                    </button>
                </td>`;
            tbody.appendChild(tr);
        });

        // Recall button listeners
        tbody.querySelectorAll(".btn-recall:not([disabled])").forEach(btn => {
            btn.addEventListener("click", () =>
                openRecallModal(parseInt(btn.dataset.index)));
        });
    }

    // ── STATS ─────────────────────────────────────────────────
    function updateStats(data) {
        const el = id => document.getElementById(id);
        if (el("statTotal"))     el("statTotal").textContent     = data.length;
        if (el("statRegular"))   el("statRegular").textContent   = data.filter(s => s.type.toLowerCase() === "regular").length;
        if (el("statIrregular")) el("statIrregular").textContent = data.filter(s => s.type.toLowerCase() !== "regular").length;
        if (el("statRecalled"))  el("statRecalled").textContent  = data.filter(s => s.status === "recalled").length;
    }

    // ── FILTER ────────────────────────────────────────────────
    function applyFilters() {
        const query   = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
        const section = document.getElementById("sectionFilter")?.value || "";

        const filtered = submittedStudents.filter(s => {
            const matchSearch  = !query   || s.name.toLowerCase().includes(query) || s.id.includes(query);
            const matchSection = !section || s.section === section;
            return matchSearch && matchSection;
        });

        renderTable(filtered);
        updateStats(filtered);
    }

    // ── RECALL MODAL ──────────────────────────────────────────
    function openRecallModal(idx) {
        recallTarget = idx;
        const nameEl = document.getElementById("recallStudentName");
        if (nameEl) nameEl.textContent = submittedStudents[idx].name;
        document.getElementById("recallModal")?.classList.add("active");
    }

    function closeRecallModal() {
        recallTarget = null;
        document.getElementById("recallModal")?.classList.remove("active");
    }

    function confirmRecall() {
        if (recallTarget === null) return;
        submittedStudents[recallTarget].status = "recalled";
        closeRecallModal();
        applyFilters();
    }

    // ── INIT LISTENERS ────────────────────────────────────────
    applyFilters();

    document.getElementById("searchInput")
        ?.addEventListener("input",  applyFilters);
    document.getElementById("sectionFilter")
        ?.addEventListener("change", applyFilters);

    document.getElementById("closeRecallModal")
        ?.addEventListener("click", closeRecallModal);
    document.getElementById("cancelRecall")
        ?.addEventListener("click", closeRecallModal);
    document.getElementById("confirmRecall")
        ?.addEventListener("click", confirmRecall);

    document.getElementById("recallModal")
        ?.addEventListener("click", e => {
            if (e.target === document.getElementById("recallModal"))
                closeRecallModal();
        });
}


// =============================================================
// SECTION 3 — FOR CORRECTION (correction.html)
// Handles: flagged card render, note toggle, resubmit modal,
//          inline subject editing, confirmation prompt, toast.
// Trigger element: #correction-list
// =============================================================

const flaggedReturns = [
    {
        id:         "2024-001234",
        name:       "Juan Dela Cruz",
        initials:   "JDC",
        program:    "BSCS",
        year:       "Year 3",
        section:    "CS-3B",
        type:       "irregular",
        reasons:    ["missing_docs", "unit_mismatch"],
        note:       "Enrollment form is missing the department head signature. Also, CS 106 shows 5 units in the submitted form but only 3 units in the official prospectus — please verify and resubmit a corrected record.",
        returnedAt: "March 10, 2026 · 10:22 AM",
        subjects: [
            { code: "CS 401", description: "Capstone Project 1",    day: "MWF", time: "8:00–9:00 AM",   room: "CS-401", section: "CS-4A", units: 3 },
            { code: "DS 131", description: "Discrete Structures 3",  day: "TTh", time: "10:00–11:30 AM", room: "CS-202", section: "CS-3B", units: 3 },
            { code: "CS 106", description: "Cyber Security",         day: "MWF", time: "1:00–2:00 PM",   room: "CS-301", section: "CS-3B", units: 5 },
        ]
    },
    {
        id:         "2023-009812",
        name:       "Renee Alcantara",
        initials:   "RA",
        program:    "BSCS",
        year:       "Year 4",
        section:    "CS-4A",
        type:       "regular",
        reasons:    ["residency"],
        note:       "Student has exceeded the 5-year free tuition window. Tuition must be assessed manually. Please confirm with the student and resubmit.",
        returnedAt: "March 10, 2026 · 11:05 AM",
        subjects: [
            { code: "CS 411", description: "Software Engineering",   day: "MWF", time: "9:00–10:00 AM",  room: "CS-402", section: "CS-4A", units: 3 },
            { code: "CS 421", description: "Database Administration", day: "TTh", time: "1:00–2:30 PM",   room: "CS-301", section: "CS-4A", units: 3 },
            { code: "CS 431", description: "Computer Networks",       day: "MWF", time: "2:00–3:00 PM",   room: "CS-201", section: "CS-4A", units: 3 },
        ]
    }
];

const REASON_LABELS = {
    missing_docs:      "Missing Documents",
    residency:         "Residency Issue",
    unit_mismatch:     "Unit Count Mismatch",
    shiftee_credits:   "Shiftee Credit Review",
    schedule_conflict: "Schedule Conflict",
    other:             "Other"
};

function initCorrectionPage() {
    if (!document.getElementById("correction-list")) return;

    let activeStudentIdx = null;

    // ── HELPERS ───────────────────────────────────────────────
    function getReasonLabel(id) { return REASON_LABELS[id] ?? id; }
    function totalUnits(subjects) {
        return subjects.reduce((sum, s) => sum + Number(s.units), 0);
    }

    // ── SIDEBAR BADGE ─────────────────────────────────────────
    function updateSidebarBadge() {
        const badge = document.getElementById("sidebarBadge");
        if (!badge) return;
        const count = flaggedReturns.length;
        badge.textContent   = count > 0 ? count : "";
        badge.style.display = count > 0 ? "inline-flex" : "none";
    }

    // ── STATS ─────────────────────────────────────────────────
    function updateCorrectionStats(data) {
        const el = id => document.getElementById(id);
        if (el("stat-flagged"))  el("stat-flagged").textContent  = data.length;
        if (el("stat-missing"))  el("stat-missing").textContent  = data.filter(s => s.reasons.includes("missing_docs")).length;
        if (el("stat-mismatch")) el("stat-mismatch").textContent = data.filter(s => s.reasons.includes("unit_mismatch")).length;
        if (el("stat-other"))    el("stat-other").textContent    = data.filter(s =>
            s.reasons.some(r => !["missing_docs","unit_mismatch","residency"].includes(r))
        ).length;
    }

    // ── RENDER CARDS ──────────────────────────────────────────
    function renderCards(data) {
        const list  = document.getElementById("correction-list");
        const empty = document.getElementById("emptyCorrection");

        if (data.length === 0) {
            list.innerHTML      = "";
            if (empty) empty.style.display = "block";
            updateCorrectionStats(data);
            updateSidebarBadge();
            return;
        }

        if (empty) empty.style.display = "none";

        list.innerHTML = data.map(s => {
            const origIdx   = flaggedReturns.indexOf(s);
            const reasonTags = s.reasons
                .map(r => `<span class="correction-reason-tag">${escHtml(getReasonLabel(r))}</span>`)
                .join("");

            return `
            <div class="student-card correction-card" data-idx="${origIdx}">

                <div class="card-header">
                    <div class="profile-row">
                        <div class="avatar">${escHtml(s.initials)}</div>
                        <div class="name-container">
                            <h3 class="student-name">
                                ${escHtml(s.name)}
                                <span class="badge ${s.type}">
                                    ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                                </span>
                            </h3>
                            <p class="student-id">
                                ${escHtml(s.id)} &bull; ${escHtml(s.year)} &bull;
                                ${escHtml(s.program)} ${escHtml(s.section)}
                            </p>
                        </div>
                        <div class="status-pill correction">Returned</div>
                    </div>
                </div>

                <div class="correction-reasons-row">
                    ${reasonTags}
                    <span class="correction-meta">Returned: ${escHtml(s.returnedAt)}</span>
                </div>

                <div class="correction-note-toggle" onclick="corrToggleNote(${origIdx})">
                    <span class="toggle-label" id="toggle-label-${origIdx}">
                        <i class="fas fa-chevron-down toggle-icon" id="toggle-icon-${origIdx}"></i>
                        View note from Assessment Office
                    </span>
                </div>

                <div class="correction-note-body" id="note-body-${origIdx}">
                    <div class="correction-note-inner">
                        <div class="correction-note-label">
                            <i class="fas fa-triangle-exclamation"></i> Note from Assessment Office
                        </div>
                        <p class="correction-note-text">${escHtml(s.note)}</p>
                    </div>
                </div>

                <div class="card-btns" style="padding: 0 20px 18px;">
                    <button class="btn btn-review" onclick="corrOpenResubmitModal(${origIdx})">
                        <i class="fas fa-pen"></i> Correct &amp; Resubmit
                    </button>
                </div>

            </div>`;
        }).join("");

        updateCorrectionStats(data);
        updateSidebarBadge();
    }

    // ── NOTE TOGGLE ───────────────────────────────────────────
    window.corrToggleNote = function(idx) {
        const body  = document.getElementById(`note-body-${idx}`);
        const icon  = document.getElementById(`toggle-icon-${idx}`);
        const label = document.getElementById(`toggle-label-${idx}`);
        if (!body) return;

        const isOpen = body.classList.toggle("open");
        icon?.classList.toggle("fa-chevron-down", !isOpen);
        icon?.classList.toggle("fa-chevron-up",    isOpen);
        if (label?.childNodes[1]) {
            label.childNodes[1].textContent = isOpen
                ? " Hide note from Assessment Office"
                : " View note from Assessment Office";
        }
    };

    // ── SEARCH ────────────────────────────────────────────────
    function applySearch() {
        const q = (document.getElementById("correctionSearch")?.value || "").toLowerCase().trim();
        const filtered = flaggedReturns.filter(s =>
            !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        );
        renderCards(filtered);
    }

    // ── RESUBMIT MODAL ────────────────────────────────────────
    window.corrOpenResubmitModal = function(idx) {
        activeStudentIdx = idx;
        const s = flaggedReturns[idx];

        const titleEl = document.getElementById("resubmitModalTitle");
        if (titleEl) titleEl.textContent = `Correct & Resubmit — ${s.name}`;

        const noteEl = document.getElementById("modalNoteText");
        if (noteEl) noteEl.textContent = s.note;

        renderResubmitTable(s.subjects);

        document.getElementById("resubmitModal")?.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    function renderResubmitTable(subjects) {
        const tbody = document.getElementById("resubmitTableBody");
        if (!tbody) return;
        tbody.innerHTML = subjects.map((sub, i) => buildSubjectRow(sub, i)).join("");
        recalcUnits();
    }

    function buildSubjectRow(sub, i) {
        return `
        <tr id="subject-row-${i}">
            <td class="action-cell">
                <button class="icon-btn delete" title="Delete" onclick="corrDeleteRow(${i})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="icon-btn edit" title="Edit" onclick="corrToggleEditRow(${i})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
            <td class="cell-code"    data-field="code">${escHtml(sub.code)}</td>
            <td class="cell-desc"    data-field="description">${escHtml(sub.description)}</td>
            <td class="cell-day"     data-field="day">${escHtml(sub.day)}</td>
            <td class="cell-time"    data-field="time">${escHtml(sub.time)}</td>
            <td class="cell-room"    data-field="room">${escHtml(sub.room)}</td>
            <td class="cell-section" data-field="section">${escHtml(sub.section)}</td>
            <td class="cell-units"   data-field="units">${escHtml(String(sub.units))}</td>
        </tr>`;
    }

    window.corrToggleEditRow = function(rowIdx) {
        const row   = document.getElementById(`subject-row-${rowIdx}`);
        if (!row) return;
        const cells = row.querySelectorAll("td[data-field]");
        const isEditing = row.classList.toggle("editing");

        cells.forEach(cell => {
            const field = cell.dataset.field;
            if (isEditing) {
                const val = cell.textContent.trim();
                cell.innerHTML = `<input class="id-edit" type="text"
                    value="${escHtml(val)}" data-field="${field}" style="width:100%;">`;
            } else {
                const input  = cell.querySelector("input");
                const newVal = input ? input.value.trim() : cell.textContent.trim();
                cell.textContent = newVal;
                if (activeStudentIdx !== null && flaggedReturns[activeStudentIdx]?.subjects[rowIdx]) {
                    flaggedReturns[activeStudentIdx].subjects[rowIdx][field] =
                        field === "units" ? parseFloat(newVal) || 0 : newVal;
                }
            }
        });

        const editBtn = row.querySelector(".icon-btn.edit, .icon-btn.save");
        if (editBtn) {
            if (isEditing) {
                editBtn.className = "icon-btn save";
                editBtn.title     = "Save";
                editBtn.innerHTML = `<i class="fas fa-check"></i>`;
                editBtn.setAttribute("onclick", `corrToggleEditRow(${rowIdx})`);
            } else {
                editBtn.className = "icon-btn edit";
                editBtn.title     = "Edit";
                editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
                recalcUnits();
            }
        }
    };

    window.corrDeleteRow = function(rowIdx) {
        if (activeStudentIdx === null) return;
        flaggedReturns[activeStudentIdx].subjects.splice(rowIdx, 1);
        renderResubmitTable(flaggedReturns[activeStudentIdx].subjects);
    };

    function addSubjectRow() {
        if (activeStudentIdx === null) return;
        const s = flaggedReturns[activeStudentIdx];
        s.subjects.push({ code: "", description: "", day: "", time: "", room: "", section: "", units: 0 });
        renderResubmitTable(s.subjects);
        const newIdx = s.subjects.length - 1;
        window.corrToggleEditRow(newIdx);
        document.getElementById(`subject-row-${newIdx}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function recalcUnits() {
        if (activeStudentIdx === null) return;
        const total = totalUnits(flaggedReturns[activeStudentIdx].subjects);
        const el = document.getElementById("modalTotalUnits");
        if (el) el.textContent = total;
    }

    function closeResubmitModal() {
        activeStudentIdx = null;
        document.getElementById("resubmitModal")?.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ── CONFIRM MODAL ─────────────────────────────────────────
    function openConfirmModal() {
        if (activeStudentIdx === null) return;
        const s = flaggedReturns[activeStudentIdx];

        if (document.querySelectorAll("#resubmitTableBody tr.editing").length > 0) {
            alert("Please save all edits before resubmitting.");
            return;
        }
        if (s.subjects.length === 0) {
            alert("Cannot resubmit with no subjects. Please add at least one subject.");
            return;
        }

        const nameEl = document.getElementById("confirmStudentName");
        if (nameEl) nameEl.textContent = s.name;
        document.getElementById("confirmModal")?.classList.add("active");
    }

    function closeConfirmModal() {
        document.getElementById("confirmModal")?.classList.remove("active");
    }

    function finalResubmit() {
        if (activeStudentIdx === null) return;
        const studentName = flaggedReturns[activeStudentIdx].name;
        flaggedReturns.splice(activeStudentIdx, 1);
        closeConfirmModal();
        closeResubmitModal();
        applySearch();
        showToast(`✓ ${studentName} has been resubmitted to Assessment.`);
    }

    // ── INIT LISTENERS ────────────────────────────────────────
    renderCards(flaggedReturns);

    document.getElementById("correctionSearch")
        ?.addEventListener("input", applySearch);

    document.getElementById("addSubjectBtn")
        ?.addEventListener("click", addSubjectRow);

    document.getElementById("closeResubmitModal")
        ?.addEventListener("click", closeResubmitModal);
    document.getElementById("cancelResubmitBtn")
        ?.addEventListener("click", closeResubmitModal);
    document.getElementById("confirmResubmitBtn")
        ?.addEventListener("click", openConfirmModal);
    document.getElementById("cancelConfirmBtn")
        ?.addEventListener("click", closeConfirmModal);
    document.getElementById("finalResubmitBtn")
        ?.addEventListener("click", finalResubmit);

    document.getElementById("resubmitModal")?.addEventListener("click", e => {
        if (e.target === document.getElementById("resubmitModal")) closeResubmitModal();
    });
    document.getElementById("confirmModal")?.addEventListener("click", e => {
        if (e.target === document.getElementById("confirmModal")) closeConfirmModal();
    });
}


// =============================================================
// BOOT — detect which page we're on and init accordingly
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
    initAdviserDashboard(); // adviser_dashboard.html
    initSubmittedPage();    // submitted.html
    initCorrectionPage();   // correction.html
    // Each init function guards itself with an element check,
    // so only the relevant one actually runs on any given page.
});