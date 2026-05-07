// =============================================================
// WMSU-Ease — Assessment Modal Script
// File: assessment.js
// Connects to: assessment_dashboard.html
// API: GET /api/assessment/queue  (from accountAgeService.js)
// =============================================================

// ---------------------------------------------------------------
// MOCK DATA
// Replace these fetch calls with your real API endpoints once
// the backend (accountAgeService.js) is wired up.
// ---------------------------------------------------------------
const MOCK_STUDENTS = [
    {
        queue_id:            "q-001",
        student_name:        "Xandrea Kate B. Galimba",
        initials:            "XG",
        cet_id:              "2024-01234",
        program:             "BSCS-1A",
        year_level:          "Year 1",
        adviser:             "Prof. Maria Reyes",
        student_type:        "REGULAR",
        residency_warning:   false,
        total_units:         23.00,
        subjects: [
            { code: "CS 101",  description: "Introduction to Computing",        units: 3, lec: 3, lab: 0 },
            { code: "CS 102",  description: "Computer Programming 1",           units: 4, lec: 2, lab: 2 },
            { code: "MATH 1",  description: "Mathematics in the Modern World",  units: 3, lec: 3, lab: 0 },
            { code: "COMM 1",  description: "Purposive Communication",          units: 3, lec: 3, lab: 0 },
            { code: "PE 1",    description: "Physical Education 1",             units: 2, lec: 2, lab: 0 },
            { code: "NSTP 1",  description: "National Service Training Program",units: 3, lec: 3, lab: 0 },
            { code: "HUM 1",   description: "Art Appreciation",                 units: 3, lec: 3, lab: 0 },
            { code: "STS 1",   description: "Science, Technology and Society",  units: 2, lec: 2, lab: 0 },
        ],
        fees: {
            tuition_per_unit: 150,
            misc:             500,
            lab:              285,
            sfdf:             100,
            athletics:        50,
            library:          75,
            id_fee:           120,
            other:            55,
        }
    },

    {
        queue_id:          "q-002",
        student_name:      "John Smith Doe",
        initials:          "JD",
        cet_id:            "2023-05678",
        program:           "BSCS-2B",
        year_level:        "Year 2",
        student_type:      "IRREGULAR",
        adviser:           "Dr. Jose Rizal",
        residency_warning: true,
        total_units:       18.00,
        subjects: [
            { code: "CS 201", description: "Data Structures", units: 3, lec: 2, lab: 1 },
            { code: "MATH 2", description: "Calculus 2",      units: 3, lec: 3, lab: 0 }
        ],
        shs_info:      { school: "Zamboanga City High School", strand: "ICT" },
        guardian_info: { name: "Jane Doe", relationship: "Aunt", address: "Tetuan, Zamboanga City", contact: "09987654321" },
        fees: {
            tuition_per_unit: 150,
            misc:             500,
            lab:              200,
            sfdf:             100,
            athletics:        50,
            library:          75,
            id_fee:           0,
            other:            30,
        }
    },

    {
        queue_id:          "q-003",
        student_name:      "Cassidy V. Himodo",
        initials:          "CH",
        cet_id:            "2023-09207",
        program:           "BSCS-2A",
        year_level:        "Year 2",
        student_type:      "REGULAR",
        adviser:           "Gojo Satoru",
        residency_warning: false,
        total_units:       18.00,
        subjects: [
            { code: "CS 201", description: "Data Structures", units: 3, lec: 2, lab: 1 },
            { code: "MATH 2", description: "Calculus 2",      units: 3, lec: 3, lab: 0 }
        ],
        shs_info:      { school: "Zamboanga City High School", strand: "ICT" },
        guardian_info: { name: "Jane Doe", relationship: "Aunt", address: "Tetuan, Zamboanga City", contact: "09987654321" },
        fees: {
            tuition_per_unit: 150,
            misc:             500,
            lab:              200,
            sfdf:             100,
            athletics:        50,
            library:          75,
            id_fee:           120,
            other:            55,
        }
    }
];

// ---------------------------------------------------------------
// STATE
// ---------------------------------------------------------------
let currentStudent = null;

// ---------------------------------------------------------------
// QUEUE LOADER
// ---------------------------------------------------------------
async function loadQueue() {
    const students = MOCK_STUDENTS; // ← swap for real API when ready

    const queueContainer = document.getElementById('queue-body-cards') || document.querySelector('.queue-list');

    // Update Quick Stats
    const statPending  = document.getElementById('stat-pending');
    const statAssessed = document.getElementById('stat-assessed');
    if (statPending)  statPending.textContent  = students.filter(s => s.queue_status !== 'ASSESSED').length;
    if (statAssessed) statAssessed.textContent = students.filter(s => s.queue_status === 'ASSESSED').length;

    if (queueContainer) {
        queueContainer.innerHTML = students.map(s => buildQueueCard(s)).join('');
    }

    const tbody = document.getElementById('queue-body');
    if (tbody) {
        tbody.innerHTML = students.map(s => buildQueueRow(s)).join('');
    }
}

// ---------------------------------------------------------------
// QUEUE CARD BUILDER
// ---------------------------------------------------------------
function buildQueueCard(s) {
    return `
    <div class="student-card" data-queue-id="${s.queue_id}">
        <div class="card-top-row">
            <div class="student-avatar">${escHtml(s.initials)}</div>
            <span class="type-badge ${s.residency_warning ? 'residency' : s.student_type.toLowerCase()}">
                ${s.residency_warning ? '⚠ RESIDENCY' : escHtml(s.student_type)}
            </span>
        </div>
        <div class="card-info">
            <h3>${escHtml(s.student_name)}</h3>
            <p>${escHtml(s.cet_id)} &bull; ${escHtml(s.year_level)} &bull; ${escHtml(s.program)}</p>
            <p><strong>Enrolled Subjects:</strong> ${s.total_units}.00 units</p>
            <p><strong>Adviser:</strong> ${escHtml(s.adviser)}</p>
        </div>
        <button class="btn-assess-full" onclick="openAssessmentModal('${s.queue_id}')">
            Assess Student
        </button>
    </div>`;
}

// ---------------------------------------------------------------
// QUEUE TABLE ROW BUILDER
// ---------------------------------------------------------------
function buildQueueRow(s) {
    return `
    <tr>
        <td><strong>${escHtml(s.student_name)}</strong>
            ${s.residency_warning ? '<span class="residency-badge">⚠ Residency</span>' : ''}
        </td>
        <td>${escHtml(s.cet_id)}</td>
        <td>${escHtml(s.program)}</td>
        <td>${escHtml(s.adviser)}</td>
        <td><span class="status-badge ${s.residency_warning ? 'flagged' : 'pending'}">
            ${s.residency_warning ? 'Residency Flag' : 'Ready for Audit'}
        </span></td>
        <td><button class="btn-assess" onclick="openAssessmentModal('${s.queue_id}')">
            Assess Student
        </button></td>
    </tr>`;
}

// ---------------------------------------------------------------
// OPEN ASSESSMENT MODAL
// ---------------------------------------------------------------
function openAssessmentModal(queueId) {
    const student = queueId
        ? MOCK_STUDENTS.find(s => s.queue_id === queueId)
        : MOCK_STUDENTS[0];

    if (!student) {
        console.warn('Student not found for queue_id:', queueId);
        return;
    }

    currentStudent = student;

    renderLeftPanel(student);
    renderRightPanel(student);

    document.getElementById('assessmentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ---------------------------------------------------------------
// CLOSE MODAL
// ---------------------------------------------------------------
function closeModal() {
    document.getElementById('assessmentModal').classList.remove('active');
    document.body.style.overflow = '';
    currentStudent = null;
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('assessmentModal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
    loadQueue();
});

// ---------------------------------------------------------------
// STATUS BANNER — varies by student_type / residency_warning
// ---------------------------------------------------------------
function buildStatusBanner(s) {
    if (s.residency_warning) {
        return `
        <div class="status-banner status-banner--irregular">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
                <strong>⚠ Residency Warning</strong>
                <p>This student has exceeded the 5-year (10-semester) free tuition limit under RA 10931. Tuition must be charged <strong>manually</strong>.</p>
            </div>
        </div>`;
    }

    const banners = {
        REGULAR: `
        <div class="status-banner status-banner--regular">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div>
                <strong>Regular Student</strong>
                <p>Enrolled in the standard full load for their year level and curriculum.</p>
            </div>
        </div>`,

        IRREGULAR: `
        <div class="status-banner status-banner--irregular">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
                <strong>Irregular Student</strong>
                <p>Not following the standard curriculum sequence. Subjects may be mixed across year levels. Verify carefully before confirming.</p>
            </div>
        </div>`,

        PROBATIONARY: `
        <div class="status-banner status-banner--probationary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
                <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
                <strong>Probationary Student</strong>
                <p>Subject to academic conditions. Maximum load is limited. Dean's approval may be required before confirming assessment.</p>
            </div>
        </div>`,

        GRADUATING: `
        <div class="status-banner status-banner--graduating">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <div>
                <strong>Graduating Student</strong>
                <p>On track to complete degree requirements this semester. Verify all prerequisites and clearance before confirming.</p>
            </div>
        </div>`,
    };

    return banners[s.student_type] || '';
}

// ---------------------------------------------------------------
// LEFT PANEL — Student Info + Subject Table
// ---------------------------------------------------------------
function renderLeftPanel(s) {
    const container = document.querySelector('#assessmentModal .audit-content');
    if (!container) return;

    container.innerHTML = `
        ${buildStatusBanner(s)}

        <div class="student-info-block">
            <div class="student-avatar large">${escHtml(s.initials)}</div>
            <div class="student-details">
                <h2>${escHtml(s.student_name)}</h2>
                <div class="info-grid">
                    <div class="student-header-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
                        <div><strong>CET-ID:</strong> ${escHtml(s.cet_id)}</div>
                        <div><strong>Program:</strong> ${escHtml(s.program)}</div>
                        <div><strong>Year Level:</strong> ${escHtml(s.year_level)}</div>
                        <div><strong>Adviser:</strong> ${escHtml(s.adviser)}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Total Units</span>
                        <span class="info-value">${s.total_units} units</span>
                    </div>
                </div>
            </div>
        </div>

        <hr class="divider">

        <div class="subjects-section">
            <table class="subjects-table">
                <thead>
                    <tr>
                        <th>Subject Code</th>
                        <th>Description</th>
                        <th>Lec</th>
                        <th>Lab</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>
                    ${s.subjects.map(sub => `
                    <tr>
                        <td><strong>${escHtml(sub.code)}</strong></td>
                        <td>${escHtml(sub.description)}</td>
                        <td>${sub.lec}</td>
                        <td>${sub.lab}</td>
                        <td>${sub.units}</td>
                    </tr>`).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4"><strong>Total</strong></td>
                        <td><strong>${s.subjects.reduce((sum, sub) => sum + sub.units, 0)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}

// ---------------------------------------------------------------
// RIGHT PANEL — Fee Summary
// ---------------------------------------------------------------
function renderRightPanel(s) {
    const feeList = document.querySelector('#assessmentModal .fee-list');
    if (!feeList) return;

    const f = s.fees;
    const tuitionTotal = f.tuition_per_unit * s.total_units;
    const miscTotal    = f.misc + f.lab + f.sfdf + f.athletics + f.library + f.id_fee + f.other;
    const grandTotal   = tuitionTotal + miscTotal;

    const feeRows = [
        { label: `Tuition (${s.total_units} units × ₱${f.tuition_per_unit.toFixed(2)})`, amount: tuitionTotal },
        { label: "Miscellaneous Fee",     amount: f.misc      },
        { label: "Laboratory Fee",        amount: f.lab       },
        { label: "Student Fund Dev. Fee", amount: f.sfdf      },
        { label: "Athletics Fee",         amount: f.athletics },
        { label: "Library Fee",           amount: f.library   },
        { label: "ID Fee",                amount: f.id_fee    },
        { label: "Other Fees",            amount: f.other     },
    ];

    feeList.innerHTML = `
        <div class="fee-section-label">Breakdown</div>

        ${feeRows.map(row => `
        <div class="fee-row">
            <span class="fee-label">${escHtml(row.label)}</span>
            <span class="fee-amount">${formatCurrency(row.amount)}</span>
        </div>`).join('')}

        <div class="fee-subtotal">
            <div class="fee-row subtotal-row">
                <span class="fee-label">Subtotal — Tuition</span>
                <span class="fee-amount">${formatCurrency(tuitionTotal)}</span>
            </div>
            <div class="fee-row subtotal-row">
                <span class="fee-label">Subtotal — Misc &amp; Others</span>
                <span class="fee-amount">${formatCurrency(miscTotal)}</span>
            </div>
        </div>

        <div class="fee-total-block">
            <span>Total Assessment</span>
            <span class="fee-grand-total">${formatCurrency(grandTotal)}</span>
        </div>
    `;

    // Wire the confirm button
    const confirmBtn = document.querySelector('#assessmentModal .btn-approve');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Assessment';
        confirmBtn.onclick = () => confirmAssessment(s, grandTotal);
    }
}

// ---------------------------------------------------------------
// CONFIRM ASSESSMENT
// ---------------------------------------------------------------
async function confirmAssessment(student, grandTotal) {
    const confirmBtn = document.querySelector('#assessmentModal .btn-approve');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    try {
        // --- REAL API (uncomment when backend is ready) ---
        // await fetch('/api/assessment/generate-soa', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         queueId:    student.queue_id,
        //         grandTotal: grandTotal,
        //         assessedBy: 'Assessment Officer'
        //     })
        // });

        await new Promise(r => setTimeout(r, 800));

        closeModal();
        showToast(`✓ SOA generated for ${student.student_name}`);
        loadQueue();

    } catch (err) {
        console.error('Assessment confirmation failed:', err);
        showToast('❌ Failed to confirm assessment. Please try again.', 'error');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Assessment';
    }
}

// ---------------------------------------------------------------
// LEGACY SUPPORT
// ---------------------------------------------------------------
function openAuditModal()  { openAssessmentModal(); }
function closeAuditModal() { closeModal(); }

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function formatCurrency(val) {
    if (val == null) return '—';
    return '₱' + Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------
// FLAG MODAL LOGIC
// ---------------------------------------------------------------
const FLAG_REASONS = [
    { id: "missing_docs", label: "Missing Documents", sub: "Student has incomplete submission requirements." },
    { id: "residency", label: "Residency Issue", sub: "Account age exceeds 10 semesters — manual tuition required (RA 10931)." },
    { id: "unit_mismatch", label: "Unit Count Mismatch", sub: "Subject unit count in the form conflicts with the official prospectus." },
    { id: "shiftee_credits", label: "Shiftee Credit Review", sub: "Transferred subjects need credit evaluation before assessment can proceed." },
    { id: "schedule_conflict", label: "Schedule Conflict", sub: "Overlapping subjects or unresolved room/time assignment." },
    { id: "other", label: "Other", sub: "Requires manual review — see note for details." }
];

function openFlagModal() {
    if (!currentStudent) return;
    
    document.getElementById("modalFlagStudentName").textContent = currentStudent.student_name;
    document.getElementById("modalFlagStudentMeta").textContent = 
        `${currentStudent.cet_id} · ${currentStudent.year_level} · ${currentStudent.program}`;

    document.getElementById("reasonOptions").innerHTML = FLAG_REASONS.map(r => `
        <label class="reason-option" id="opt-${r.id}">
            <input type="checkbox" value="${r.id}" onchange="toggleReasonStyle('${r.id}', this.checked)">
            <div class="reason-option-body">
                <span class="reason-option-label">${escHtml(r.label)}</span>
                <span class="reason-option-sub">${escHtml(r.sub)}</span>
            </div>
        </label>`).join("");

    document.getElementById("flagNoteInput").value = "";
    document.getElementById("flagModal").classList.add("active");
}

function toggleReasonStyle(id, isChecked) {
    document.getElementById(`opt-${id}`)?.classList.toggle("selected", isChecked);
}

function closeFlagModal() {
    document.getElementById("flagModal").classList.remove("active");
}

function submitFlag() {
    const checked = [...document.querySelectorAll("#reasonOptions input[type='checkbox']:checked")].map(cb => cb.value);
    
    if (checked.length === 0) {
        alert("Please select at least one reason before saving.");
        return;
    }
    
    // Simulate removing from queue and returning to Adviser
    const idx = MOCK_STUDENTS.findIndex(s => s.queue_id === currentStudent.queue_id);
    if (idx !== -1) {
        MOCK_STUDENTS.splice(idx, 1);
    }
    
    closeFlagModal();
    closeModal();
    loadQueue();
    showToast('✓ Student returned to Adviser for correction.');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px;
        background: ${type === 'error' ? '#c0392b' : '#27ae60'};
        color: white; padding: 12px 20px; border-radius: 8px;
        font-size: 14px; font-weight: 500; z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}