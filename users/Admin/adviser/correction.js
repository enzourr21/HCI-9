let flaggedReturns = [
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
            { code: "CS 401",  description: "Capstone Project 1",       day: "MWF", time: "8:00–9:00 AM",   room: "CS-401", section: "CS-4A", units: 3 },
            { code: "DS 131",  description: "Discrete Structures 3",    day: "TTh", time: "10:00–11:30 AM", room: "CS-202", section: "CS-3B", units: 3 },
            { code: "CS 106",  description: "Cyber Security",           day: "MWF", time: "1:00–2:00 PM",   room: "CS-301", section: "CS-3B", units: 5 },
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
            { code: "CS 411",  description: "Software Engineering",     day: "MWF", time: "9:00–10:00 AM",  room: "CS-402", section: "CS-4A", units: 3 },
            { code: "CS 421",  description: "Database Administration",  day: "TTh", time: "1:00–2:30 PM",   room: "CS-301", section: "CS-4A", units: 3 },
            { code: "CS 431",  description: "Computer Networks",        day: "MWF", time: "2:00–3:00 PM",   room: "CS-201", section: "CS-4A", units: 3 },
        ]
    }
];

// Which student is currently open in the resubmit modal
let activeStudentIdx = null;

// ─────────────────────────────────────────────────────────────
// REASON LABEL MAP
// Keep in sync with FLAG_REASONS in processed.html
// ─────────────────────────────────────────────────────────────
const REASON_LABELS = {
    missing_docs:     "Missing Documents",
    residency:        "Residency Issue",
    unit_mismatch:    "Unit Count Mismatch",
    shiftee_credits:  "Shiftee Credit Review",
    schedule_conflict:"Schedule Conflict",
    other:            "Other"
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function escHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getReasonLabel(id) {
    return REASON_LABELS[id] ?? id;
}

function totalUnits(subjects) {
    return subjects.reduce((sum, s) => sum + Number(s.units), 0);
}

// ─────────────────────────────────────────────────────────────
// RENDER CORRECTION CARDS
// ─────────────────────────────────────────────────────────────
function renderCards(data) {
    const list  = document.getElementById("correction-list");
    const empty = document.getElementById("emptyCorrection");

    if (data.length === 0) {
        list.innerHTML      = "";
        empty.style.display = "block";
        updateStats(data);
        updateSidebarBadge();
        return;
    }

    empty.style.display = "none";

    list.innerHTML = data.map(s => {
        const origIdx  = flaggedReturns.indexOf(s);
        const reasonTags = s.reasons
            .map(r => `<span class="correction-reason-tag">${escHtml(getReasonLabel(r))}</span>`)
            .join("");

        return `
        <div class="student-card correction-card" data-idx="${origIdx}">

            <!-- Card Header -->
            <div class="card-header">
                <div class="profile-row">
                    <div class="avatar">${escHtml(s.initials)}</div>
                    <div class="name-container">
                        <h3 class="student-name">
                            ${escHtml(s.name)}
                            <span class="badge ${s.type}">${s.type.charAt(0).toUpperCase() + s.type.slice(1)}</span>
                        </h3>
                        <p class="student-id">${escHtml(s.id)} &bull; ${escHtml(s.year)} &bull; ${escHtml(s.program)} ${escHtml(s.section)}</p>
                    </div>
                    <div class="status-pill correction">Returned</div>
                </div>
            </div>

            <!-- Reason Tags -->
            <div class="correction-reasons-row">
                ${reasonTags}
                <span class="correction-meta">Returned: ${escHtml(s.returnedAt)}</span>
            </div>

            <!-- Collapsible Note -->
            <div class="correction-note-toggle" onclick="toggleNote(${origIdx})">
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

            <!-- Card Buttons -->
            <div class="card-btns" style="padding: 0 20px 18px;">
                <button class="btn btn-review" onclick="openResubmitModal(${origIdx})">
                    <i class="fas fa-pen"></i> Correct &amp; Resubmit
                </button>
            </div>

        </div>`;
    }).join("");

    updateStats(data);
    updateSidebarBadge();
}

// ─────────────────────────────────────────────────────────────
// TOGGLE NOTE EXPAND / COLLAPSE
// ─────────────────────────────────────────────────────────────
function toggleNote(idx) {
    const body  = document.getElementById(`note-body-${idx}`);
    const icon  = document.getElementById(`toggle-icon-${idx}`);
    const label = document.getElementById(`toggle-label-${idx}`);

    const isOpen = body.classList.toggle("open");
    icon.classList.toggle("fa-chevron-down", !isOpen);
    icon.classList.toggle("fa-chevron-up",    isOpen);
    label.childNodes[1].textContent = isOpen
        ? " Hide note from Assessment Office"
        : " View note from Assessment Office";
}

// ─────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────
function updateStats(data) {
    document.getElementById("stat-flagged").textContent =
        data.length;
    document.getElementById("stat-missing").textContent =
        data.filter(s => s.reasons.includes("missing_docs")).length;
    document.getElementById("stat-mismatch").textContent =
        data.filter(s => s.reasons.includes("unit_mismatch")).length;
    document.getElementById("stat-other").textContent =
        data.filter(s =>
            s.reasons.some(r => !["missing_docs","unit_mismatch","residency"].includes(r))
        ).length;
}

function updateSidebarBadge() {
    const badge = document.getElementById("sidebarBadge");
    if (!badge) return;
    const count = flaggedReturns.length;
    badge.textContent    = count > 0 ? count : "";
    badge.style.display  = count > 0 ? "inline-flex" : "none";
}

// ─────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────
function applySearch() {
    const q = document.getElementById("correctionSearch").value.toLowerCase().trim();
    const filtered = flaggedReturns.filter(s =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
    renderCards(filtered);
}

// ─────────────────────────────────────────────────────────────
// RESUBMIT MODAL — OPEN
// Pre-fills the edit table with the student's current subjects
// ─────────────────────────────────────────────────────────────
function openResubmitModal(idx) {
    activeStudentIdx = idx;
    const s = flaggedReturns[idx];

    document.getElementById("resubmitModalTitle").textContent =
        `Correct & Resubmit — ${s.name}`;
    document.getElementById("modalNoteText").textContent = s.note;

    renderResubmitTable(s.subjects);

    document.getElementById("resubmitModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

// ─────────────────────────────────────────────────────────────
// RESUBMIT TABLE — RENDER
// ─────────────────────────────────────────────────────────────
function renderResubmitTable(subjects) {
    const tbody = document.getElementById("resubmitTableBody");

    tbody.innerHTML = subjects.map((sub, i) => buildSubjectRow(sub, i)).join("");
    recalcUnits();
}

function buildSubjectRow(sub, i) {
    return `
    <tr id="subject-row-${i}">
        <td class="action-cell">
            <button class="icon-btn delete" title="Delete" onclick="deleteSubjectRow(${i})">
                <i class="fas fa-trash"></i>
            </button>
            <button class="icon-btn edit" title="Edit" onclick="toggleEditRow(${i})">
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

// ─────────────────────────────────────────────────────────────
// INLINE ROW EDITING
// ─────────────────────────────────────────────────────────────
function toggleEditRow(rowIdx) {
    const row   = document.getElementById(`subject-row-${rowIdx}`);
    const cells = row.querySelectorAll("td[data-field]");
    const isEditing = row.classList.toggle("editing");

    cells.forEach(cell => {
        const field = cell.dataset.field;
        if (isEditing) {
            const val = cell.textContent.trim();
            cell.innerHTML = `<input class="id-edit" type="text" value="${escHtml(val)}"
                data-field="${field}" style="width:100%;">`;
        } else {
            const input = cell.querySelector("input");
            const newVal = input ? input.value.trim() : cell.textContent.trim();
            cell.textContent = newVal;

            // Sync back to the in-memory subject array
            if (activeStudentIdx !== null) {
                const s = flaggedReturns[activeStudentIdx];
                if (s.subjects[rowIdx]) {
                    s.subjects[rowIdx][field] = field === "units"
                        ? parseFloat(newVal) || 0
                        : newVal;
                }
            }
        }
    });

    // Toggle edit icon to save icon
    const editBtn = row.querySelector(".icon-btn.edit, .icon-btn.save");
    if (isEditing) {
        editBtn.className = "icon-btn save";
        editBtn.title     = "Save";
        editBtn.innerHTML = `<i class="fas fa-check"></i>`;
        editBtn.setAttribute("onclick", `toggleEditRow(${rowIdx})`);
    } else {
        editBtn.className = "icon-btn edit";
        editBtn.title     = "Edit";
        editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
        recalcUnits();
    }
}

function deleteSubjectRow(rowIdx) {
    if (activeStudentIdx === null) return;
    const s = flaggedReturns[activeStudentIdx];
    s.subjects.splice(rowIdx, 1);
    renderResubmitTable(s.subjects);
}

// ─────────────────────────────────────────────────────────────
// ADD NEW SUBJECT ROW
// ─────────────────────────────────────────────────────────────
function addSubjectRow() {
    if (activeStudentIdx === null) return;
    const s = flaggedReturns[activeStudentIdx];
    s.subjects.push({ code: "", description: "", day: "", time: "", room: "", section: "", units: 0 });
    renderResubmitTable(s.subjects);

    // Auto-open the new row for editing
    const newIdx = s.subjects.length - 1;
    toggleEditRow(newIdx);

    // Scroll to the new row
    const newRow = document.getElementById(`subject-row-${newIdx}`);
    newRow?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ─────────────────────────────────────────────────────────────
// UNIT COUNTER
// ─────────────────────────────────────────────────────────────
function recalcUnits() {
    if (activeStudentIdx === null) return;
    const s = flaggedReturns[activeStudentIdx];
    const total = totalUnits(s.subjects);
    document.getElementById("modalTotalUnits").textContent = total;
}

// ─────────────────────────────────────────────────────────────
// CLOSE RESUBMIT MODAL
// ─────────────────────────────────────────────────────────────
function closeResubmitModal() {
    activeStudentIdx = null;
    document.getElementById("resubmitModal").classList.remove("active");
    document.body.style.overflow = "";
}

// ─────────────────────────────────────────────────────────────
// OPEN CONFIRMATION PROMPT
// ─────────────────────────────────────────────────────────────
function openConfirmModal() {
    if (activeStudentIdx === null) return;
    const s = flaggedReturns[activeStudentIdx];

    // Validate — make sure no row is still in edit mode
    const editingRows = document.querySelectorAll("#resubmitTableBody tr.editing");
    if (editingRows.length > 0) {
        alert("Please save all edits before resubmitting.");
        return;
    }

    // Validate — at least one subject
    if (s.subjects.length === 0) {
        alert("Cannot resubmit with no subjects. Please add at least one subject.");
        return;
    }

    document.getElementById("confirmStudentName").textContent = s.name;
    document.getElementById("confirmModal").classList.add("active");
}

function closeConfirmModal() {
    document.getElementById("confirmModal").classList.remove("active");
}

// ─────────────────────────────────────────────────────────────
// FINAL RESUBMIT
// Removes the record from flaggedReturns (simulating it being
// sent back to Assessment queue) and refreshes the page.
// ─────────────────────────────────────────────────────────────
function finalResubmit() {
    if (activeStudentIdx === null) return;

    const studentName = flaggedReturns[activeStudentIdx].name;

    // Remove from flagged list — record is now back in Assessment queue
    flaggedReturns.splice(activeStudentIdx, 1);

    closeConfirmModal();
    closeResubmitModal();
    applySearch();

    showToast(`✓ ${studentName} has been resubmitted to Assessment.`);
}

// ─────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────
function showToast(message) {
    const toast = document.createElement("div");
    toast.className   = "correction-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    renderCards(flaggedReturns);

    document.getElementById("correctionSearch")
        .addEventListener("input", applySearch);

    document.getElementById("addSubjectBtn")
        .addEventListener("click", addSubjectRow);

    document.getElementById("closeResubmitModal")
        .addEventListener("click", closeResubmitModal);
    document.getElementById("cancelResubmitBtn")
        .addEventListener("click", closeResubmitModal);

    document.getElementById("confirmResubmitBtn")
        .addEventListener("click", openConfirmModal);

    document.getElementById("cancelConfirmBtn")
        .addEventListener("click", closeConfirmModal);
    document.getElementById("finalResubmitBtn")
        .addEventListener("click", finalResubmit);

    // Close modals on backdrop click
    document.getElementById("resubmitModal").addEventListener("click", e => {
        if (e.target === document.getElementById("resubmitModal")) closeResubmitModal();
    });
    document.getElementById("confirmModal").addEventListener("click", e => {
        if (e.target === document.getElementById("confirmModal")) closeConfirmModal();
    });
});