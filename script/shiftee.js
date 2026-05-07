/* ═══════════════════════════════════════════════════
   WMSU-Ease — Shiftee Portal  |  shiftee.js
═══════════════════════════════════════════════════ */

'use strict';

// ── Subject Data ──────────────────────────────────
let subjects = [
    { code: 'CC 101',   name: 'Computer Programming 1',        type: 'MAJOR',  units: 3, instructor: 'Prof. Reyes',     status: 'approved' },
    { code: 'CC 102',   name: 'Computer Programming 2',        type: 'MAJOR',  units: 3, instructor: 'Prof. Reyes',     status: 'approved' },
    { code: 'CS 201',   name: 'Data Structures',               type: 'MAJOR',  units: 3, instructor: 'Prof. Santos',    status: 'approved' },
    { code: 'CS 211',   name: 'Discrete Mathematics',          type: 'MAJOR',  units: 3, instructor: 'Prof. Mendoza',   status: 'for-eval' },
    { code: 'Math 101', name: 'Mathematics in the Modern World', type: 'MINOR', units: 3, instructor: 'Prof. Cruz',     status: 'approved' },
    { code: 'Eng 1',    name: 'Purposive Communication',       type: 'MINOR',  units: 3, instructor: 'Prof. Dela Rosa', status: 'approved' },
    { code: 'PE 1',     name: 'Physical Education 1',          type: 'GE',     units: 2, instructor: 'Coach Bautista',  status: 'pending'  },
    { code: 'NSTP 1',   name: 'NSTP / CWTS',                  type: 'GE',     units: 3, instructor: 'Instr. Torres',   status: 'pending'  },
];

// ── Tab Navigation ────────────────────────────────
function showTab(tabId, linkEl) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.s-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.m-link').forEach(l => l.classList.remove('active'));

    document.getElementById('tab-' + tabId)?.classList.add('active');
    if (linkEl) linkEl.classList.add('active');
}

function syncMobileNav(clickedMLink) {
    document.querySelectorAll('.m-link').forEach(l => l.classList.remove('active'));
    clickedMLink.classList.add('active');
}

// ── Render Subject Table ──────────────────────────
function renderSubjectTable() {
    const tbody = document.getElementById('subjTableBody');
    if (!tbody) return;

    tbody.innerHTML = subjects.map((s) => {
        const typeChip   = typeChipHtml(s.type);
        const statusChip = statusChipHtml(s.status);
        return `<tr>
            <td><strong style="font-size:13.5px;">${s.code}</strong></td>
            <td>${s.name}</td>
            <td>${typeChip}</td>
            <td>${s.units}</td>
            <td style="color:var(--muted);font-size:13px;">${s.instructor}</td>
            <td>${statusChip}</td>
        </tr>`;
    }).join('');

    updateStats();
}

function typeChipHtml(type) {
    const map = {
        'MAJOR': '<span class="chip-major">MAJOR</span>',
        'MINOR': '<span class="chip-minor">MINOR</span>',
        'GE':    '<span class="chip-ge">GE</span>',
    };
    return map[type] || `<span class="chip-ge">${type}</span>`;
}

function statusChipHtml(status) {
    const map = {
        'approved': '<span class="chip-approved">APPROVED</span>',
        'pending':  '<span class="chip-pending">PENDING</span>',
        'for-eval': '<span class="chip-for-eval">FOR EVAL</span>',
    };
    return map[status] || `<span class="chip-pending">${status.toUpperCase()}</span>`;
}

// ── Update Stats ──────────────────────────────────
function updateStats() {
    const total  = subjects.reduce((s, x) => s + x.units, 0);
    const majors = subjects.filter(x => x.type === 'MAJOR').length;
    const minors = subjects.filter(x => x.type === 'MINOR').length;

    const totalEl = document.querySelector('.stat-num.black');
    const greenEl = document.querySelector('.stat-num.green');
    const amberEl = document.querySelector('.stat-num.amber');

    if (totalEl) totalEl.textContent = total;
    if (greenEl) greenEl.textContent = majors;
    if (amberEl) amberEl.textContent = minors;
}

// ── Grade Eval Accordion ──────────────────────────
function toggleGradeEval(btn) {
    const body   = document.getElementById('gradeEvalBody');
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'flex';
    btn.classList.toggle('open', !isOpen);
}

// ── Edit Subjects Modal ───────────────────────────
function openEditSubjectsModal() {
    renderModalSubjectList();
    document.getElementById('editSubjModal').classList.add('open');
}

function closeEditSubjectsModal() {
    document.getElementById('editSubjModal').classList.remove('open');
}

function renderModalSubjectList() {
    const body = document.getElementById('editSubjBody');
    if (!body) return;

    const listHtml = subjects.map((s, i) => `
        <div class="modal-subj-item" id="modal-subj-${i}">
            <span class="modal-subj-code">${s.code}</span>
            <span class="modal-subj-name">${s.name} · ${s.units} units</span>
            <span>${typeChipHtml(s.type)}</span>
            <button class="modal-subj-remove" onclick="removeSubject(${i})" title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`).join('');

    body.innerHTML = `
        <div class="modal-subj-list">${listHtml || '<p style="color:var(--muted);font-size:13px;">No subjects added yet.</p>'}</div>

        <div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.6px;">Add Subject</div>
        <div class="modal-add-row">
            <input type="text"   id="newSubjCode"  placeholder="Subject code (e.g. CS 301)">
            <input type="text"   id="newSubjName"  placeholder="Description">
        </div>
        <div class="modal-add-row">
            <select id="newSubjType">
                <option value="MAJOR">Major</option>
                <option value="MINOR">Minor</option>
                <option value="GE">GE / Elective</option>
            </select>
            <input type="number" id="newSubjUnits" placeholder="Units" min="1" max="6" value="3">
            <input type="text"   id="newSubjInstr" placeholder="Instructor">
        </div>
        <div style="margin-bottom:16px;">
            <button class="btn-add-subj" onclick="addSubject()">+ Add Subject</button>
        </div>
        <div class="modal-footer">
            <button class="btn-cancel" onclick="closeEditSubjectsModal()">Cancel</button>
            <button class="btn-save"   onclick="saveSubjects()">Save Changes</button>
        </div>`;
}

function removeSubject(idx) {
    subjects.splice(idx, 1);
    renderModalSubjectList();
}

function addSubject() {
    const code  = document.getElementById('newSubjCode')?.value.trim();
    const name  = document.getElementById('newSubjName')?.value.trim();
    const type  = document.getElementById('newSubjType')?.value;
    const units = parseInt(document.getElementById('newSubjUnits')?.value) || 3;
    const instr = document.getElementById('newSubjInstr')?.value.trim() || 'TBA';

    if (!code || !name) {
        showToast('Please fill in subject code and description.', 'error');
        return;
    }

    subjects.push({ code, name, type, units, instructor: instr, status: 'pending' });
    renderModalSubjectList();
    showToast(`${code} added.`, 'success');
}

function saveSubjects() {
    closeEditSubjectsModal();
    renderSubjectTable();
    showToast('Subject list saved.', 'success');
}

// ── Toast ─────────────────────────────────────────
function showToast(msg, type = '') {
    const c = document.getElementById('toastContainer');
    const d = document.createElement('div');
    d.className = 'toast' + (type ? ' ' + type : '');
    d.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>${msg}`;
    c.appendChild(d);
    setTimeout(() => d.remove(), 3500);
}

// ── Modal Overlay Close ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editSubjModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('editSubjModal')) closeEditSubjectsModal();
    });

    renderSubjectTable();
    updateWorkflowUI(); // initialise state machine UI
});


/* ═══════════════════════════════════════════════════
   SHIFTING WORKFLOW — STATE MACHINE
   States:
     0 → Idle            (default, ready to apply)
     1 → Pending Clearance (waiting for Old Dean)
     2 → Exam Phase      (exam permit + testing office)
     3 → Evaluation      (waiting for New Dean)
     4 → Finalized       (registrar updates course)
═══════════════════════════════════════════════════ */

// ── Course Metadata ───────────────────────────────
const COURSE_META = {
    'BSCS':    { code: 'BSCS',   name: 'BS Computer Science',       college: 'College of Computing Studies'  },
    'BSIT':    { code: 'BSIT',   name: 'BS Information Technology', college: 'College of Computing Studies'  },
    'BS-CRIM': { code: 'BSCRIM', name: 'BS Criminology',            college: 'College of Criminal Justice'   },
    'BSN':     { code: 'BSN',    name: 'BS Nursing',                college: 'College of Nursing'            },
};

// ── Shifting Exam Window ──────────────────────────
// The "Download Exam Permit" button is only enabled within these dates.
// Adjust these values to match the real exam schedule each semester.
const EXAM_WINDOW = {
    start: new Date('2026-06-01T00:00:00'),
    end:   new Date('2026-06-15T23:59:59'),
};

function isWithinExamWindow() {
    const now = new Date();
    return now >= EXAM_WINDOW.start && now <= EXAM_WINDOW.end;
}

// ── State Object ──────────────────────────────────
let shiftingState = {
    currentStep:      0,     // 0–4
    targetCourse:     '',    // key into COURSE_META
    gwa:              1.75,  // student's actual GWA (swap for live data)
    enrollmentLocked: false, // true while step 1–3; prevents old-course enrollment
};

// ── Auto-Advance Timer (simulates async dean approvals) ──
let _autoAdvanceTimer = null;

function scheduleAutoAdvance(delayMs, nextStep, toastMsg) {
    clearTimeout(_autoAdvanceTimer);
    _autoAdvanceTimer = setTimeout(() => {
        shiftingState.currentStep = nextStep;
        updateWorkflowUI();
        showToast(toastMsg, 'success');
    }, delayMs);
}

// ── Main Trigger — called by every workflow button ─
function processWorkflowTrigger() {
    const step = shiftingState.currentStep;

    if (step === 0) {
        // ── IDLE → validate then submit ───────────
        const target = document.getElementById('target-program')?.value;
        if (!target) {
            showToast('Please select a target course first.', 'error');
            return;
        }
        if (shiftingState.gwa > 2.5) {
            showToast('GWA requirement not met. Minimum is 2.50.', 'error');
            return;
        }

        shiftingState.targetCourse     = target;
        shiftingState.currentStep      = 1;
        shiftingState.enrollmentLocked = true;

        showToast('Application submitted to Old College Dean.', 'success');
        updateWorkflowUI();

        // Simulate: Old Dean approves after 4 s → Exam Phase
        scheduleAutoAdvance(4000, 2, 'Old Dean approved. Shifting Exam is now unlocked.');

    } else if (step === 2) {
        // ── EXAM PHASE → date-gated permit ────────
        if (!isWithinExamWindow()) {
            showToast('Exam window is June 1–15, 2026. Check back then.', 'error');
            return;
        }
        showToast('Exam Permit downloaded. Proceed to the Testing Center.', 'success');

        // Simulate: exam result received after 5 s → Evaluation
        scheduleAutoAdvance(5000, 3, 'Exam result: PASSED. Forwarded to New Dean for evaluation.');

    } else if (step === 3) {
        // Button is hidden at step 3; guard just in case
        showToast('Evaluation is in progress. Please wait for the New Dean.', '');
    }
}

// ── Master UI Update ──────────────────────────────
// Call this whenever shiftingState changes.
function updateWorkflowUI() {
    const step = shiftingState.currentStep;
    const meta = COURSE_META[shiftingState.targetCourse] || null;

    _updateStepper(step);
    _updateStatusChips(step);
    _updateActionArea(step, meta);
    _updateProfileCard(step, meta);
    _updateEnrollmentLock(step);
}

// ── 1. Stepper Circles & Connectors ──────────────
function _updateStepper(step) {
    // step-1 = Request, step-2 = Clearance, step-3 = Exam,
    // step-4 = Evaluation, step-5 = Finalized
    // shiftingState.currentStep maps directly: state 1 activates step-1, etc.
    // State 4 (Finalized) should mark all 5 steps done.
    const displayStep = step === 4 ? 6 : step; // 6 makes all 5 steps "done"

    for (let i = 1; i <= 5; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const connEl = document.getElementById(`conn-${i}`);
        if (!stepEl) continue;

        stepEl.classList.remove('done', 'active');
        if (connEl) connEl.classList.remove('done');

        if (i < displayStep) {
            stepEl.classList.add('done');
            if (connEl) connEl.classList.add('done');
        } else if (i === displayStep) {
            stepEl.classList.add('active');
        }
    }
}

// ── 2. Status Chips (Subjects tab + Profile tab) ──
function _updateStatusChips(step) {
    const labels      = ['Idle', 'Pending Clearance', 'Exam Phase', 'Evaluation', 'Finalized'];
    const label       = labels[step] ?? 'Idle';
    const chipClass   = step === 4 ? 'chip-green ml-auto' : 'chip-amber ml-auto';

    ['main-status-chip', 'profile-status-chip'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = label;
        el.className   = chipClass;
    });
}

// ── 3. Action Area Content ────────────────────────
function _updateActionArea(step, meta) {
    const titleEl    = document.getElementById('workflow-title');
    const descEl     = document.getElementById('workflow-desc');
    const actionsEl  = document.getElementById('workflow-actions');
    if (!titleEl || !descEl || !actionsEl) return;

    switch (step) {

        // ── IDLE ───────────────────────────────────
        case 0:
            titleEl.textContent = 'Ready to Shift?';
            descEl.textContent  = 'Start your digital shifting process. Make sure your GWA meets the minimum requirement of 2.50.';
            actionsEl.innerHTML = `
                <select id="target-program" style="padding:8px 12px; border-radius:8px; border:1px solid var(--border); font-family:inherit; font-size:13px; width:260px; color:var(--text); background:var(--white); outline:none;">
                    <option value="">Select Target Course…</option>
                    <option value="BSCS">BS Computer Science</option>
                    <option value="BSIT">BS Information Technology</option>
                    <option value="BS-CRIM">BS Criminology</option>
                    <option value="BSN">BS Nursing</option>
                </select>
                <button onclick="processWorkflowTrigger()" id="workflow-btn" class="btn-edit-subj" style="margin:0; width:260px; justify-content:center;">
                    Start Application
                </button>`;
            break;

        // ── PENDING CLEARANCE ──────────────────────
        case 1:
            titleEl.textContent = 'Awaiting Old Dean Approval';
            descEl.textContent  = 'Your outward clearance request is being reviewed by the Dean of your current college. This usually takes 1–3 business days.';
            actionsEl.innerHTML = `
                <span class="chip-amber">Digital Clearance — Pending</span>
                <span style="font-size:12px; color:var(--muted); margin-top:4px;">Checking with the Dean's office… auto-updating.</span>`;
            break;

        // ── EXAM PHASE ─────────────────────────────
        case 2: {
            const inWindow = isWithinExamWindow();
            titleEl.textContent = 'Take the Shifting Examination';
            descEl.textContent  = inWindow
                ? 'You are cleared to shift. Download your permit and report to the Testing Center.'
                : 'You are cleared, but the exam window has not opened yet. It opens June 1 – 15, 2026.';
            actionsEl.innerHTML = inWindow
                ? `<button onclick="processWorkflowTrigger()" class="btn-edit-subj" style="margin:0; width:260px; justify-content:center;">
                       ↓ Download Exam Permit
                   </button>`
                : `<span class="chip-amber">Exam Window: June 1 – 15, 2026</span>
                   <span style="font-size:12px; color:var(--muted); margin-top:4px;">Come back once the window opens to download your permit.</span>`;
            break;
        }

        // ── EVALUATION ─────────────────────────────
        case 3:
            titleEl.textContent = 'New Dean Evaluation';
            descEl.textContent  = `The Dean of ${meta ? meta.college : 'your target college'} is reviewing your exam results and credit equivalencies. You will be notified once evaluation is complete.`;
            actionsEl.innerHTML = `
                <span class="chip-amber">Interview / Credit Evaluation — Pending</span>
                <span style="font-size:12px; color:var(--muted); margin-top:4px;">Waiting for the New Dean's decision… auto-updating.</span>`;

            // Simulate: New Dean approves after 6 s → Finalized
            scheduleAutoAdvance(6000, 4, 'New Dean approved! The Registrar is finalizing your enrollment.');
            break;

        // ── FINALIZED ──────────────────────────────
        case 4:
            titleEl.textContent = '🎉 Shifting Complete!';
            descEl.textContent  = `You are now officially enrolled under ${meta ? meta.name : 'your new program'}. Your record has been updated by the Registrar's Office.`;
            actionsEl.innerHTML = `
                <span class="chip-green">Enrollment Active — ${meta ? meta.code : ''}</span>
                <button class="btn-edit-subj" onclick="location.reload()" style="margin:0; margin-top:6px;">
                    Refresh Portal
                </button>`;
            break;
    }
}

// ── 4. Profile Card — Dynamic "To" Program ────────
function _updateProfileCard(step, meta) {
    const codeEl    = document.getElementById('profile-target-code');
    const nameEl    = document.getElementById('profile-target-name');
    const collegeEl = document.getElementById('profile-target-college');
    if (!codeEl) return;

    if (meta && step >= 1) {
        codeEl.textContent    = meta.code;
        nameEl.textContent    = meta.name;
        collegeEl.textContent = meta.college;
    } else {
        codeEl.textContent    = '—';
        nameEl.textContent    = 'No target selected';
        collegeEl.textContent = '—';
    }

    // On finalization: update topbar program badge to new course code
    if (step === 4 && meta) {
        const metaEl = document.getElementById('topbar-program-meta');
        if (metaEl) metaEl.textContent = `2ND YEAR · ${meta.code}`;
    }
}

// ── Profile Edit Logic ─────────────────────────────────────────────
document.getElementById('btnSave')?.addEventListener('click', () => {
    const fields = ['LastName','FirstName','MiddleName','DOB','Gender','Contact','Email'];
    fields.forEach(f => {
        const editEl = document.getElementById('edit' + f);
        const viewEl = document.getElementById('view' + f);
        if (editEl && viewEl && editEl.value.trim()) {
            viewEl.textContent = editEl.value.trim();
        }
    });
    document.getElementById('edit-toggle').checked = false;
    showToast('Profile updated successfully.');
});

// Pre-populate edit fields when Edit is clicked
document.getElementById('edit-toggle')?.addEventListener('change', function() {
    if (this.checked) {
        const fields = ['LastName','FirstName','MiddleName','DOB','Gender','Contact','Email'];
        fields.forEach(f => {
            const editEl = document.getElementById('edit' + f);
            const viewEl = document.getElementById('view' + f);
            if (editEl && viewEl) editEl.value = viewEl.textContent.trim();
        });
    }
});

// ── 5. Enrollment Lock Banner ─────────────────────
// Visible while application is active (steps 1–3).
// Disappears once Finalized (step 4) or Idle (step 0).
function _updateEnrollmentLock(step) {
    const banner = document.getElementById('enrollment-lock-banner');
    if (!banner) return;
    banner.style.display = (step >= 1 && step <= 3) ? 'flex' : 'none';
}