// submitted.js — Submission History logic

// ── DATA ─────────────────────────────────────────────────────────────────────
// Replace with a real API call or localStorage read as needed.
const submittedStudents = [
    { id: "2024-001235", name: "Maria Santos",    section: "CS-3B", year: "Year 3", type: "Regular",   units: "25.00", dateSubmitted: "March 8, 2026",  status: "submitted"  },
    { id: "2025-001234", name: "Cassidy Himodo",  section: "CS-2A", year: "Year 2", type: "Regular",   units: "22.00", dateSubmitted: "March 9, 2026",  status: "submitted"  },
    { id: "2024-001234", name: "Juan Dela Cruz",  section: "CS-3B", year: "Year 3", type: "Irregular", units: "20.00", dateSubmitted: "March 10, 2026", status: "processing" },
    { id: "2023-009812", name: "Renee Alcantara", section: "CS-4A", year: "Year 4", type: "Regular",   units: "18.00", dateSubmitted: "March 7, 2026",  status: "recalled"   },
    { id: "2024-005571", name: "Liam Ferrer",     section: "CS-2A", year: "Year 2", type: "Irregular", units: "15.00", dateSubmitted: "March 11, 2026", status: "submitted"  }
];

let recallTarget = null;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getInitials(name) {
    return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function typeBadge(type) {
    const cls = type.toLowerCase() === "regular" ? "regular" : "irregular";
    return `<span class="type-badge ${cls}">${type}</span>`;
}

function statusBadge(status) {
    const map = {
        submitted:  ["Submitted",  "submitted"],
        processing: ["Processing", "processing"],
        recalled:   ["Recalled",   "recalled"]
    };
    const [label, cls] = map[status] || ["Unknown", "submitted"];
    return `<span class="status-badge ${cls}">${label}</span>`;
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function renderTable(data) {
    const tbody      = document.getElementById("tableBody");
    const emptyState = document.getElementById("emptyState");

    tbody.innerHTML = "";

    if (data.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

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
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Recall button listeners
    tbody.querySelectorAll(".btn-recall:not([disabled])").forEach(btn => {
        btn.addEventListener("click", () => openRecallModal(parseInt(btn.dataset.index)));
    });
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function updateStats(data) {
    document.getElementById("statTotal").textContent     = data.length;
    document.getElementById("statRegular").textContent   = data.filter(s => s.type.toLowerCase() === "regular").length;
    document.getElementById("statIrregular").textContent = data.filter(s => s.type.toLowerCase() !== "regular").length;
    document.getElementById("statRecalled").textContent  = data.filter(s => s.status === "recalled").length;
}

// ── FILTER ────────────────────────────────────────────────────────────────────
function applyFilters() {
    const query   = document.getElementById("searchInput").value.toLowerCase().trim();
    const section = document.getElementById("sectionFilter").value;

    const filtered = submittedStudents.filter(s => {
        const matchSearch  = !query   || s.name.toLowerCase().includes(query) || s.id.includes(query);
        const matchSection = !section || s.section === section;
        return matchSearch && matchSection;
    });

    renderTable(filtered);
    updateStats(filtered);
}

// ── RECALL MODAL ──────────────────────────────────────────────────────────────
function openRecallModal(idx) {
    recallTarget = idx;
    document.getElementById("recallStudentName").textContent = submittedStudents[idx].name;
    document.getElementById("recallModal").classList.add("active");
}

function closeRecallModal() {
    recallTarget = null;
    document.getElementById("recallModal").classList.remove("active");
}

function confirmRecall() {
    if (recallTarget === null) return;
    submittedStudents[recallTarget].status = "recalled";
    closeRecallModal();
    applyFilters();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    applyFilters();

    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("sectionFilter").addEventListener("change", applyFilters);

    document.getElementById("closeRecallModal").addEventListener("click", closeRecallModal);
    document.getElementById("cancelRecall").addEventListener("click", closeRecallModal);
    document.getElementById("confirmRecall").addEventListener("click", confirmRecall);

    // Close on overlay click
    document.getElementById("recallModal").addEventListener("click", e => {
        if (e.target === document.getElementById("recallModal")) closeRecallModal();
    });
});