/* ═══════════════════════════════════════════════════
   WMSU-Ease — Shiftee Portal  |  shiftee.js
═══════════════════════════════════════════════════ */

'use strict';

// ── Subject Data ──────────────────────────────────
let subjects = [
    { code: 'CC 101',  name: 'Computer Programming 1',     type: 'MAJOR',  units: 3, instructor: 'Prof. Reyes',    status: 'approved' },
    { code: 'CC 102',  name: 'Computer Programming 2',     type: 'MAJOR',  units: 3, instructor: 'Prof. Reyes',    status: 'approved' },
    { code: 'CS 201',  name: 'Data Structures',            type: 'MAJOR',  units: 3, instructor: 'Prof. Santos',   status: 'approved' },
    { code: 'CS 211',  name: 'Discrete Mathematics',       type: 'MAJOR',  units: 3, instructor: 'Prof. Mendoza',  status: 'for-eval' },
    { code: 'Math 101',name: 'Mathematics in the Modern World', type: 'MINOR', units: 3, instructor: 'Prof. Cruz',  status: 'approved' },
    { code: 'Eng 1',   name: 'Purposive Communication',    type: 'MINOR',  units: 3, instructor: 'Prof. Dela Rosa',status: 'approved' },
    { code: 'PE 1',    name: 'Physical Education 1',       type: 'GE',     units: 2, instructor: 'Coach Bautista', status: 'pending'  },
    { code: 'NSTP 1',  name: 'NSTP / CWTS',               type: 'GE',     units: 3, instructor: 'Instr. Torres',  status: 'pending'  },
];

// ── Tab navigation ────────────────────────────────
function showTab(tabId, linkEl) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.s-link').forEach(l => l.classList.remove('active'));
    document.getElementById('tab-' + tabId)?.classList.add('active');
    if (linkEl) linkEl.classList.add('active');
}

// ── Render subject table ──────────────────────────
function renderSubjectTable() {
    const tbody = document.getElementById('subjTableBody');
    if (!tbody) return;

    tbody.innerHTML = subjects.map((s, i) => {
        const typeChip = typeChipHtml(s.type);
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

// ── Update stats ──────────────────────────────────
function updateStats() {
    const total  = subjects.reduce((s, x) => s + x.units, 0);
    const majors = subjects.filter(x => x.type === 'MAJOR').length;
    const minors = subjects.filter(x => x.type === 'MINOR').length;

    const totalEl  = document.querySelector('.stat-num.black');
    const greenEl  = document.querySelector('.stat-num.green');
    const amberEl  = document.querySelector('.stat-num.amber');

    if (totalEl) totalEl.textContent = total;
    if (greenEl) greenEl.textContent = majors;
    if (amberEl) amberEl.textContent = minors;
}

// ── Grade eval accordion ──────────────────────────
function toggleGradeEval(btn) {
    const body = document.getElementById('gradeEvalBody');
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
            <input type="text" id="newSubjCode"  placeholder="Subject code (e.g. CS 301)">
            <input type="text" id="newSubjName"  placeholder="Description">
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

// ── Modal overlay close ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editSubjModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('editSubjModal')) closeEditSubjectsModal();
    });

    // Initial render
    renderSubjectTable();
});

/* ── Digital Shifting Workflow Logic ──────────────── */

let shiftingState = {
    currentStep: 0, // 0: Idle, 1: Requested, 2: Cleared, 3: Exam Done, 4: Approved, 5: Enrolled
    targetCourse: '',
    gwa: 1.75 // Sample grade for validation
};

function processWorkflowTrigger() {
    const target = document.getElementById('target-program').value;
    
    if (shiftingState.currentStep === 0) {
        if (!target) {
            showToast('Please select a target course.', 'error');
            return;
        }
        // Logic: Check GWA eligibility
        if (shiftingState.gwa > 2.5) {
            showToast('GWA requirement not met for this course.', 'error');
            return;
        }
        
        shiftingState.targetCourse = target;
        shiftingState.currentStep = 1;
        showToast('Request sent to Old College Dean.', 'success');
    } 
    else if (shiftingState.currentStep === 2) {
        // Simulating Exam Permit Download
        showToast('Exam Permit Downloaded. Please go to Testing Center.', 'success');
        // Simulate Exam Passing after 3 seconds
        setTimeout(() => {
            shiftingState.currentStep = 3;
            updateWorkflowUI();
            showToast('Exam Result: PASSED. Forwarded to New Dean.', 'success');
        }, 3000);
    }

    updateWorkflowUI();
}

function updateWorkflowUI() {
    const title = document.getElementById('workflow-title');
    const desc = document.getElementById('workflow-desc');
    const btn = document.getElementById('workflow-btn');
    const statusChip = document.getElementById('main-status-chip');
    const actionArea = document.getElementById('workflow-actions');

    // Update Stepper Visuals (Reusable Logic)
    for (let i = 1; i <= 5; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        const connEl = document.getElementById(`conn-${i}`);
        if (!stepEl) continue;

        stepEl.className = 'progress-step';
        if (i < shiftingState.currentStep) stepEl.classList.add('done');
        if (i === shiftingState.currentStep) stepEl.classList.add('active');
        if (connEl && i < shiftingState.currentStep) connEl.classList.add('done');
    }

    // Workflow State Content
    switch(shiftingState.currentStep) {
        case 1:
            statusChip.innerText = "Under Review";
            title.innerText = "Awaiting Old College Approval";
            desc.innerText = "Dean of CCS is currently reviewing your outward clearance.";
            actionArea.innerHTML = `<span class="chip-amber">Status: Digital Clearance Pending</span>`;
            // Mock delay: Automatic approve from Old Dean
            setTimeout(() => { 
                shiftingState.currentStep = 2; 
                updateWorkflowUI(); 
                showToast('Old Dean Approved. Shifting Exam unlocked.', 'success');
            }, 4000);
            break;
        case 2:
            statusChip.innerText = "Exam Phase";
            title.innerText = "Take the Shifting Exam";
            desc.innerText = "You are cleared to shift. Please download your permit and take the exam.";
            btn.innerText = "Download Exam Permit";
            break;
        case 3:
            statusChip.innerText = "Evaluation";
            title.innerText = "New College Evaluation";
            desc.innerText = "The Dean of your target college is reviewing your exam results and credits.";
            actionArea.innerHTML = `<span class="chip-amber">Status: Interview for ${shiftingState.targetCourse} Pending</span>`;
            break;
        case 5:
            statusChip.innerText = "Finalized";
            statusChip.className = "chip-green ml-auto";
            title.innerText = "Shifting Complete!";
            desc.innerText = `You are now officially a student of ${shiftingState.targetCourse}.`;
            actionArea.innerHTML = `<button class="btn-edit-subj" onclick="location.reload()">Refresh Portal</button>`;
            break;
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    updateWorkflowUI();
});