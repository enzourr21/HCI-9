// ─────────────────────────────────────────────────────────────────
// WMSU-EASE · MISTO.js  (System Administration)
// Depends on: studentData.js, subject.js  (must load first)
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────
const EMPLOYEES = [
    { id:"EMP-20241001", name:"Dr. Ana Dizon",       initials:"AD", position:"Associate Professor II", dept:"College of Computing Studies", roles:["Adviser"],             status:"Active",   email:"ana.dizon@wmsu.edu.ph",       contact:"09171234567", lastActive:"2026-05-01" },
    { id:"EMP-20241002", name:"Prof. Maria Reyes",   initials:"MR", position:"Assistant Professor I",  dept:"College of Computing Studies", roles:["Adviser","Secretary"], status:"Active",   email:"maria.reyes@wmsu.edu.ph",     contact:"09182345678", lastActive:"2026-05-02" },
    { id:"EMP-20241003", name:"Prof. Jose Rizal",    initials:"JR", position:"Instructor I",           dept:"College of Computing Studies", roles:["Adviser"],             status:"Active",   email:"jose.rizal@wmsu.edu.ph",      contact:"09193456789", lastActive:"2026-04-28" },
    { id:"EMP-20241004", name:"Ms. Clara Santos",    initials:"CS", position:"Administrative Staff",   dept:"College of Computing Studies", roles:["Secretary"],           status:"Active",   email:"clara.santos@wmsu.edu.ph",    contact:"09204567890", lastActive:"2026-05-02" },
    { id:"EMP-20241005", name:"Dr. Ramon Dela Cruz", initials:"RD", position:"Professor III",          dept:"College of Computing Studies", roles:["Department Head"],      status:"Active",   email:"ramon.delacruz@wmsu.edu.ph",  contact:"09215678901", lastActive:"2026-04-30" },
    { id:"EMP-20241006", name:"Dr. Luisa Fernandez", initials:"LF", position:"Professor IV",           dept:"College of Computing Studies", roles:["College Dean"],         status:"Active",   email:"luisa.fernandez@wmsu.edu.ph", contact:"09226789012", lastActive:"2026-05-01" },
    { id:"EMP-20241007", name:"Mr. Ben Aquino",      initials:"BA", position:"Assessment Officer",     dept:"Assessment Office — CCS",      roles:["Assessment Officer"],   status:"Active",   email:"ben.aquino@wmsu.edu.ph",      contact:"09237890123", lastActive:"2026-05-02" },
    { id:"EMP-20241008", name:"Ms. Rosa Mendoza",    initials:"RM", position:"Assessment Officer",     dept:"Assessment Office — CCS",      roles:["Assessment Officer"],   status:"Inactive", email:"rosa.mendoza@wmsu.edu.ph",    contact:"09248901234", lastActive:"2025-11-15" },
    { id:"EMP-20241009", name:"Prof. Edgar Tan",     initials:"ET", position:"Associate Professor I",  dept:"College of Engineering",       roles:["Adviser"],             status:"Active",   email:"edgar.tan@wmsu.edu.ph",       contact:"09259012345", lastActive:"2026-04-29" },
    { id:"EMP-20241010", name:"Dr. Patricia Lim",    initials:"PL", position:"Professor II",           dept:"College of Engineering",       roles:["College Dean"],         status:"Active",   email:"patricia.lim@wmsu.edu.ph",    contact:"09260123456", lastActive:"2026-04-27" },
    { id:"EMP-20241011", name:"Mr. Carlos Bautista", initials:"CB", position:"Instructor II",          dept:"College of Nursing",           roles:["Adviser"],             status:"Active",   email:"carlos.bautista@wmsu.edu.ph", contact:"09271234567", lastActive:"2026-05-02" },
    { id:"EMP-20241012", name:"Ms. Diana Suarez",    initials:"DS", position:"Administrative Staff",   dept:"Registrar's Office",           roles:["Secretary"],           status:"Inactive", email:"diana.suarez@wmsu.edu.ph",    contact:"09282345678", lastActive:"2025-09-30" },
];

const HRIS_LOOKUP = {
    "EMP-20240099": { name:"Prof. Mario Santos", initials:"MS", email:"mario.santos@wmsu.edu.ph", position:"Associate Professor III" },
    "EMP-20241001": EMPLOYEES[0],
};

const ROOMS = [
    { code:"CCS-LAB-01", name:"Computer Laboratory 1",     building:"CCS Building",   dept:"College of Computing Studies" },
    { code:"CCS-LAB-02", name:"Computer Laboratory 2",     building:"CCS Building",   dept:"College of Computing Studies" },
    { code:"CCS-LAB-03", name:"Computer Laboratory 3",     building:"CCS Building",   dept:"College of Computing Studies" },
    { code:"CCS-CR-01",  name:"Classroom 101",             building:"CCS Building",   dept:"College of Computing Studies" },
    { code:"CCS-CR-02",  name:"Classroom 102",             building:"CCS Building",   dept:"College of Computing Studies" },
    { code:"ENG-LAB-01", name:"Engineering Laboratory 1",  building:"Eng Building",   dept:"College of Engineering" },
    { code:"ENG-CR-01",  name:"Engineering Classroom 1",   building:"Eng Building",   dept:"College of Engineering" },
    { code:"NUR-SIM-01", name:"Simulation Laboratory",     building:"Nursing Building",dept:"College of Nursing" },
    { code:"GEN-AUD",    name:"Main Auditorium",           building:"Admin Building",  dept:"General Use" },
    { code:"GEN-GYM",    name:"Gymnasium",                 building:"Sports Complex",  dept:"General Use" },
];

const FACULTY = [
    { id:"EMP-20241001", name:"Dr. Ana Dizon",       position:"Associate Professor II", dept:"College of Computing Studies", email:"ana.dizon@wmsu.edu.ph",       hrisStatus:"Active" },
    { id:"EMP-20241002", name:"Prof. Maria Reyes",   position:"Assistant Professor I",  dept:"College of Computing Studies", email:"maria.reyes@wmsu.edu.ph",     hrisStatus:"Active" },
    { id:"EMP-20241003", name:"Prof. Jose Rizal",    position:"Instructor I",           dept:"College of Computing Studies", email:"jose.rizal@wmsu.edu.ph",      hrisStatus:"Active" },
    { id:"EMP-20241005", name:"Dr. Ramon Dela Cruz", position:"Professor III",          dept:"College of Computing Studies", email:"ramon.delacruz@wmsu.edu.ph",  hrisStatus:"Active" },
    { id:"EMP-20241009", name:"Prof. Edgar Tan",     position:"Associate Professor I",  dept:"College of Engineering",       email:"edgar.tan@wmsu.edu.ph",       hrisStatus:"Active" },
    { id:"EMP-20241010", name:"Dr. Patricia Lim",    position:"Professor II",           dept:"College of Engineering",       email:"patricia.lim@wmsu.edu.ph",    hrisStatus:"Active" },
    { id:"EMP-20241011", name:"Mr. Carlos Bautista", position:"Instructor II",          dept:"College of Nursing",           email:"carlos.bautista@wmsu.edu.ph", hrisStatus:"Active" },
];

const AUDIT_LOGS = [
    { type:"sysevent",   action:"School Year Started",         detail:"AY 2025–2026 2nd Semester initiated by SA-001",             time:"2026-01-06 08:00", admin:"SA-001" },
    { type:"activate",   action:"Account Activated",           detail:"Prof. Jose Rizal (EMP-20241003) — role: Adviser / CCS",     time:"2026-01-06 08:15", admin:"SA-001" },
    { type:"role",       action:"Role Assigned",               detail:"Prof. Maria Reyes (EMP-20241002) — added role: Secretary",  time:"2026-01-06 09:02", admin:"SA-001" },
    { type:"sync",       action:"HRIS Sync Completed",         detail:"47 records verified, 0 discrepancies found",               time:"2026-01-07 07:14", admin:"SA-001" },
    { type:"deactivate", action:"Account Deactivated",         detail:"Ms. Diana Suarez (EMP-20241012) — reason: On leave",       time:"2026-02-01 14:30", admin:"SA-001" },
    { type:"activate",   action:"Account Reactivated",         detail:"Mr. Ben Aquino (EMP-20241007) — returned from leave",      time:"2026-02-15 09:00", admin:"SA-001" },
    { type:"role",       action:"Role Revoked",                detail:"EMP-20241008 — Assessment Officer role removed",           time:"2026-02-20 11:45", admin:"SA-001" },
    { type:"sync",       action:"HRIS Sync Triggered",         detail:"3 new employee records detected, pending assignment",      time:"2026-05-01 07:14", admin:"SA-001" },
    { type:"delete",     action:"Employee Record Deleted",     detail:"EMP-20239901 — record permanently removed from system",    time:"2026-03-10 16:22", admin:"SA-001" },
    { type:"sysevent",   action:"SHA-256 Engine Recalibrated", detail:"Grade verification hashes refreshed for AY 2025–2026",    time:"2026-01-05 23:58", admin:"SA-001" },
];

// ─────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────
let modalCurrentStep  = 1;
let pendingAction     = null;
let pendingActionIdx  = null;
let schoolYearActive  = true;
let verifiedEmployee  = null;
let selectedStudentIdx = null;

// ─────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    const el = document.getElementById('systemClock');
    if (el) el.textContent =
        `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} `+
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

// ─────────────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────────────
function switchTab(tab, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('tab-' + tab);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');

    // Lazy-render students tab
    if (tab === 'students') renderStudentsTable(STUDENTS);
    if (tab === 'prospectus') renderProspectusTab();
}

// ─────────────────────────────────────────────────
// SCHOOL YEAR TOGGLE
// ─────────────────────────────────────────────────
function toggleSchoolYear() {
    schoolYearActive = !schoolYearActive;
    const btn = document.getElementById('schoolYearBtn');
    if (schoolYearActive) {
        btn.className = 'btn-school-year end';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>End School Year`;
        showToast('AY 2026–2027 has been started. Session data cleared.', 'success');
        addAuditEntry({ type:'sysevent', action:'School Year Started', detail:'AY 2026–2027 initiated by SA-001', time: nowStamp(), admin:'SA-001' });
    } else {
        btn.className = 'btn-school-year start';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>Start School Year`;
        showToast('School year ended. Records archived.', 'warning');
    }
}

// ─────────────────────────────────────────────────
// HRIS SYNC
// ─────────────────────────────────────────────────
function triggerSync() {
    const btn = document.getElementById('syncBtn');
    btn.classList.add('syncing');
    btn.style.cursor = 'not-allowed';
    setTimeout(() => {
        btn.classList.remove('syncing','has-changes');
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>Sync HRIS Records`;
        showToast('HRIS sync complete. 3 new records imported.', 'success');
        addAuditEntry({ type:'sync', action:'HRIS Sync Completed', detail:'3 new employee records imported from HRIS', time:nowStamp(), admin:'SA-001' });
    }, 2200);
}

// ─────────────────────────────────────────────────
// ROLES TABLE
// ─────────────────────────────────────────────────
function renderRolesTable(data) {
    const tbody = document.getElementById('rolesTableBody');
    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No employees found.</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map((e) => `
        <tr class="clickable" onclick="openPanel(${EMPLOYEES.indexOf(e)})">
            <td class="mono-text">${e.id}</td>
            <td>
                <div class="name-cell">${e.name}</div>
                <div class="sub-cell">${e.position}</div>
            </td>
            <td>${e.roles.map(r=>`<span class="badge info" style="margin-right:4px;">${r}</span>`).join('')}</td>
            <td style="font-size:0.80rem;color:var(--text-secondary);max-width:160px;">${e.dept}</td>
            <td><span class="badge ${e.status==='Active'?'active':'inactive'}">${e.status}</span></td>
            <td class="mono-text" style="font-size:0.76rem;">${e.lastActive}</td>
            <td onclick="event.stopPropagation()" style="white-space:nowrap;">
                <div style="display:flex;gap:6px;">
                    ${e.status==='Active'
                        ? `<button class="btn-icon amber" title="Deactivate" onclick="promptAction('deactivate',${EMPLOYEES.indexOf(e)})">
                               <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                           </button>`
                        : `<button class="btn-icon green" title="Reactivate" onclick="promptAction('reactivate',${EMPLOYEES.indexOf(e)})">
                               <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                           </button>`}
                    <button class="btn-icon red" title="Delete Employee" onclick="promptAction('delete',${EMPLOYEES.indexOf(e)})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    </button>
                </div>
            </td>
        </tr>`).join('');
    document.getElementById('roles-count').textContent = `${data.length} records`;
}

function filterRoles() {
    const q    = document.getElementById('rolesSearch').value.toLowerCase();
    const role = document.getElementById('roleFilter').value;
    const st   = document.getElementById('statusFilter').value;
    const res  = EMPLOYEES.filter(e =>
        (!q  || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q)) &&
        (!role || e.roles.includes(role)) &&
        (!st   || e.status === st)
    );
    renderRolesTable(res);
}

// ─────────────────────────────────────────────────
// ACTION PROMPTS
// ─────────────────────────────────────────────────
function promptAction(action, idx) {
    pendingAction  = action;
    pendingActionIdx = idx;
    const e   = EMPLOYEES[idx];
    const msg = document.getElementById('deactivateMsg');
    const dan = document.getElementById('dangerZoneBlock');
    const danDesc = document.getElementById('dangerZoneDesc');
    const btn = document.getElementById('confirmActionBtn');

    if (action === 'deactivate') {
        msg.textContent = `You are about to suspend access for ${e.name} (${e.id}). Their account will be immediately inaccessible.`;
        dan.style.display = 'none';
        btn.className = 'btn btn-warning';
        btn.textContent = 'Deactivate';
    } else if (action === 'reactivate') {
        msg.textContent = `You are about to restore access for ${e.name} (${e.id}). They will receive a reactivation notification.`;
        dan.style.display = 'none';
        btn.className = 'btn btn-success';
        btn.textContent = 'Reactivate';
    } else if (action === 'delete') {
        msg.textContent = `You are about to permanently remove ${e.name} (${e.id}) from the enrollment system.`;
        dan.style.display = 'block';
        danDesc.textContent = 'This action cannot be undone. All role assignments for this employee will be deleted. This is logged in the audit trail.';
        btn.className = 'btn btn-danger';
        btn.textContent = 'Permanently Delete';
    }
    document.getElementById('deactivateModal').classList.add('open');
}

function confirmAction() {
    if (pendingActionIdx === null) return;
    const e = EMPLOYEES[pendingActionIdx];
    if (pendingAction === 'deactivate') {
        EMPLOYEES[pendingActionIdx].status = 'Inactive';
        showToast(`${e.name} has been deactivated.`, 'warning');
        addAuditEntry({ type:'deactivate', action:'Account Deactivated', detail:`${e.name} (${e.id}) suspended by SA-001`, time:nowStamp(), admin:'SA-001' });
    } else if (pendingAction === 'reactivate') {
        EMPLOYEES[pendingActionIdx].status = 'Active';
        showToast(`${e.name} has been reactivated.`, 'success');
        addAuditEntry({ type:'activate', action:'Account Reactivated', detail:`${e.name} (${e.id}) reactivated by SA-001`, time:nowStamp(), admin:'SA-001' });
    } else if (pendingAction === 'delete') {
        EMPLOYEES.splice(pendingActionIdx, 1);
        showToast(`Employee record permanently deleted.`, 'error');
        addAuditEntry({ type:'delete', action:'Employee Record Deleted', detail:`${e.name} (${e.id}) removed by SA-001`, time:nowStamp(), admin:'SA-001' });
    }
    closeModal('deactivateModal');
    filterRoles();
}

// ─────────────────────────────────────────────────
// EMPLOYEE DETAIL PANEL
// ─────────────────────────────────────────────────
function openPanel(idx) {
    const e = EMPLOYEES[idx];
    document.getElementById('panelBody').innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
            <div class="employee-photo">${e.initials}</div>
            <div>
                <div class="panel-name">${e.name}</div>
                <div class="panel-position">${e.position}</div>
                <div style="margin-top:6px;">${e.roles.map(r=>`<span class="badge info" style="margin-right:4px;">${r}</span>`).join('')}</div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-label">Personal &amp; Position Data</div>
            <div class="detail-item"><span class="detail-item-key">Employee ID</span><span class="detail-item-value mono-text">${e.id}</span></div>
            <div class="detail-item"><span class="detail-item-key">Official Position</span><span class="detail-item-value">${e.position}</span></div>
            <div class="detail-item"><span class="detail-item-key">Department</span><span class="detail-item-value">${e.dept}</span></div>
            <div class="detail-item"><span class="detail-item-key">Status</span><span class="detail-item-value"><span class="badge ${e.status==='Active'?'active':'inactive'}">${e.status}</span></span></div>
        </div>
        <div class="detail-section">
            <div class="detail-label">WMSU-Ease Roles</div>
            ${e.roles.map(r=>`<div class="detail-item"><span class="detail-item-key">Role</span><span class="detail-item-value">${r}</span></div>`).join('')}
        </div>
        <div class="detail-section">
            <div class="detail-label">Contact</div>
            <div class="detail-item"><span class="detail-item-key">WMSU Email</span><span class="detail-item-value mono-text" style="font-size:0.78rem;">${e.email}</span></div>
            <div class="detail-item" style="border-bottom:none;"><span class="detail-item-key">Contact No.</span><span class="detail-item-value mono-text">${e.contact}</span></div>
        </div>
        <div class="detail-section">
            <div class="detail-label">Advisees</div>
            ${getStudentsByAdviser(e.id).length === 0
                ? `<p style="font-size:0.80rem;color:var(--text-muted);padding:8px 0;">No advisees assigned.</p>`
                : getStudentsByAdviser(e.id).map(s => `
                    <div class="detail-item" style="padding:6px 0;">
                        <span class="detail-item-key mono-text">${s.studentId}</span>
                        <span class="detail-item-value">${s.fullName} <span style="color:var(--text-muted);font-size:0.75rem;">(${s.course} ${s.yearLevel}${s.section})</span></span>
                    </div>`).join('')
            }
        </div>
    `;
    document.getElementById('detailPanel').classList.add('open');
}

function closePanel() {
    document.getElementById('detailPanel').classList.remove('open');
}

// ─────────────────────────────────────────────────
// ADD ROLE MODAL (3-step)
// ─────────────────────────────────────────────────
function openAddRoleModal() {
    modalCurrentStep = 1;
    verifiedEmployee = null;
    document.getElementById('empIdInput').value = '';
    document.getElementById('empIdInput').className = 'form-input';
    document.getElementById('empLookupResult').style.display = 'none';
    document.getElementById('deptSelect').value = '';
    document.getElementById('roleSelect').value = '';
    updateModalStep();
    document.getElementById('addRoleModal').classList.add('open');
}

function modalStep(dir) {
    if (dir === 1) {
        if (modalCurrentStep === 1) {
            const id = document.getElementById('empIdInput').value.trim();
            const found = HRIS_LOOKUP[id] || EMPLOYEES.find(e=>e.id===id);
            if (!found) {
                document.getElementById('empIdInput').className = 'form-input error';
                showToast('Employee ID not found in HRIS records.', 'error');
                return;
            }
            verifiedEmployee = found;
            document.getElementById('empIdInput').className = 'form-input verified';
            document.getElementById('empInitials').textContent  = verifiedEmployee.initials || '?';
            document.getElementById('empName').textContent      = verifiedEmployee.name;
            document.getElementById('empEmail').textContent     = verifiedEmployee.email;
            document.getElementById('empPosition').textContent  = verifiedEmployee.position;
            document.getElementById('empDept').textContent      = verifiedEmployee.dept    || '—';
            document.getElementById('empContact').textContent   = verifiedEmployee.contact || '—';
            document.getElementById('empLookupResult').style.display = 'flex';
            if (verifiedEmployee.dept) {
                const deptSel = document.getElementById('deptSelect');
                for (let i = 0; i < deptSel.options.length; i++) {
                    if (deptSel.options[i].value === verifiedEmployee.dept) { deptSel.value = verifiedEmployee.dept; break; }
                }
                filterRolesByDept(verifiedEmployee.dept);
            }
        }
        if (modalCurrentStep === 2) {
            if (!document.getElementById('deptSelect').value || !document.getElementById('roleSelect').value) {
                showToast('Please select both a department and a role.', 'error');
                return;
            }
            document.getElementById('conf-name').textContent  = verifiedEmployee.name;
            document.getElementById('conf-dept').textContent  = document.getElementById('deptSelect').value;
            document.getElementById('conf-role').textContent  = document.getElementById('roleSelect').value;
            document.getElementById('conf-email').textContent = verifiedEmployee.email;
        }
        if (modalCurrentStep === 3) {
            const newRole = document.getElementById('roleSelect').value;
            const existing = EMPLOYEES.find(e=>e.id===document.getElementById('empIdInput').value.trim());
            if (existing && !existing.roles.includes(newRole)) existing.roles.push(newRole);
            showToast(`Role assigned. Activation link sent to ${verifiedEmployee.email}.`, 'success');
            addAuditEntry({ type:'role', action:'Role Assigned', detail:`${verifiedEmployee.name} — role: ${newRole}`, time:nowStamp(), admin:'SA-001' });
            closeModal('addRoleModal');
            filterRoles();
            return;
        }
        modalCurrentStep = Math.min(3, modalCurrentStep + 1);
    } else {
        modalCurrentStep = Math.max(1, modalCurrentStep - 1);
    }
    updateModalStep();
}

function updateModalStep() {
    [1,2,3].forEach(s => {
        document.getElementById(`modal-step-${s}`).style.display = s === modalCurrentStep ? 'block' : 'none';
        const pill = document.getElementById(`spill-${s}`);
        if (s < modalCurrentStep)       { pill.className = 'step-pill done'; }
        else if (s === modalCurrentStep){ pill.className = 'step-pill active'; }
        else                            { pill.className = 'step-pill'; }
    });
    document.getElementById('modalBackBtn').style.display = modalCurrentStep > 1 ? 'block' : 'none';
    const nextBtn = document.getElementById('modalNextBtn');
    const labels  = ['Verify Employee →','Select Role →','Confirm & Assign'];
    nextBtn.textContent = labels[modalCurrentStep - 1];
}

// ─────────────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────────────
function renderRooms(data) {
    document.getElementById('roomGrid').innerHTML = data.map(r => `
        <div class="room-card">
            <div class="room-card-code">${r.code}</div>
            <div class="room-card-name">${r.name}</div>
            <div class="room-card-tag">${r.building}</div>
            <div style="margin-top:8px;"><span class="badge neutral" style="font-size:0.64rem;">${r.dept}</span></div>
        </div>`).join('');
}

function filterRooms() {
    const q = document.getElementById('roomSearch').value.toLowerCase();
    renderRooms(ROOMS.filter(r => !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)));
}

function openAddRoomModal() { document.getElementById('addRoomModal').classList.add('open'); }

function addRoom() {
    const code = document.getElementById('roomCode').value.trim();
    const name = document.getElementById('roomName').value.trim();
    if (!code || !name) { showToast('Room code and name are required.','error'); return; }
    ROOMS.push({ code, name, building: document.getElementById('roomBuilding').value.trim() || '—', dept: document.getElementById('roomDept').value || 'General Use' });
    showToast(`Room ${code} added successfully.`, 'success');
    closeModal('addRoomModal');
    filterRooms();
}

function renderFaculty(data) {
    document.getElementById('facultyTableBody').innerHTML = data.map(f => `
        <tr>
            <td class="mono-text">${f.id}</td>
            <td><div class="name-cell">${f.name}</div></td>
            <td style="font-size:0.82rem;color:var(--text-secondary);">${f.position}</td>
            <td style="font-size:0.80rem;color:var(--text-secondary);">${f.dept}</td>
            <td class="mono-text" style="font-size:0.76rem;">${f.email}</td>
            <td><span class="badge ${f.hrisStatus==='Active'?'active':'inactive'}">${f.hrisStatus}</span></td>
        </tr>`).join('');
}

function filterFaculty() {
    const q = document.getElementById('facultySearch').value.toLowerCase();
    renderFaculty(FACULTY.filter(f => !q || f.name.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q)));
}

// ─────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────
const LOG_ICONS = {
    activate:   { icon:'✓', cls:'activate' },
    deactivate: { icon:'○', cls:'deactivate' },
    delete:     { icon:'✕', cls:'delete' },
    role:       { icon:'⊕', cls:'role' },
    sync:       { icon:'↺', cls:'sync' },
    sysevent:   { icon:'⚡', cls:'sysevent' },
    student:    { icon:'◈', cls:'role' },
};

function renderAudit(data) {
    const container = document.getElementById('auditFeed');
    if (!data.length) {
        container.innerHTML = `<p style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.84rem;">No log entries found.</p>`;
        return;
    }
    container.innerHTML = data.map(l => {
        const ic = LOG_ICONS[l.type] || LOG_ICONS.sysevent;
        return `
        <div class="log-entry">
            <div class="log-icon ${ic.cls}" style="font-size:0.80rem;font-weight:700;">${ic.icon}</div>
            <div class="log-meta">
                <div class="log-action">${l.action}</div>
                <div class="log-detail">${l.detail}</div>
                <div style="font-family:var(--mono);font-size:0.68rem;color:var(--text-muted);margin-top:4px;">Actor: ${l.admin}</div>
            </div>
            <div class="log-time">${l.time}</div>
        </div>`;
    }).join('');
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    const recent = [...AUDIT_LOGS].reverse().slice(0,5);
    container.innerHTML = recent.map(l => {
        const i = LOG_ICONS[l.type] || LOG_ICONS.sysevent;
        return `
        <div class="log-entry">
            <div class="log-icon ${i.cls}" style="font-size:0.80rem;font-weight:700;">${i.icon}</div>
            <div class="log-meta">
                <div class="log-action">${l.action}</div>
                <div class="log-detail">${l.detail}</div>
            </div>
            <div class="log-time">${l.time}</div>
        </div>`;
    }).join('');
}

function filterAudit() {
    const q    = document.getElementById('auditSearch').value.toLowerCase();
    const type = document.getElementById('auditTypeFilter').value;
    const res  = AUDIT_LOGS.filter(l =>
        (!q    || l.action.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q)) &&
        (!type || l.type === type)
    );
    renderAudit([...res].reverse());
}

function addAuditEntry(entry) {
    AUDIT_LOGS.push(entry);
    renderRecentActivity();
    renderAudit([...AUDIT_LOGS].reverse());
    const badge = document.getElementById('audit-badge');
    if (badge) badge.textContent = parseInt(badge.textContent||0) + 1;
}

// ─────────────────────────────────────────────────
// ══ STUDENTS MODULE ══════════════════════════════
// ─────────────────────────────────────────────────

const STATUS_COLORS = {
    'Enrolled':  'active',
    'Irregular': 'info',
    'On Leave':  'inactive',
    'Dropped':   'danger',
};

const TYPE_COLORS = {
    'Regular':   'neutral',
    'Freshmen':  'info',
    'Transferee':'active',
};

function normalizeCourseKey(value) {
    const raw = (value || '').toString().trim();
    if (!raw) return '';
    const normalized = raw.replace(/[^A-Za-z0-9 ]+/g, ' ').trim();
    const words = normalized.split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const first = words[0].toUpperCase();
    const degreePrefixes = ['BS','BA','AB','BSE','BSN','ACT','BEED','BSTM','BSP'];
    if (degreePrefixes.includes(first)) {
        const suffix = words.slice(1, 4).map(w => w[0].toUpperCase()).join('');
        return (first + suffix).toLowerCase();
    }
    return words.map(w => w[0].toUpperCase()).join('').toLowerCase();
}

function isCourseMatch(studentCourse, filterValue) {
    if (!filterValue) return true;
    if (!studentCourse) return false;
    if (studentCourse === filterValue) return true;
    return normalizeCourseKey(studentCourse) === normalizeCourseKey(filterValue);
}

function getAvailableProspectusPrograms() {
    const programs = [];
    for (const college of Object.values(COLLEGES)) {
        for (const program of Object.values(college.programs)) {
            programs.push({ id: program.id, name: program.name, collegeName: college.name });
        }
    }
    return programs.sort((a, b) => a.name.localeCompare(b.name));
}

function findProgramByIdentifier(identifier) {
    if (!identifier) return null;
    const needle = normalizeCourseKey(identifier);
    for (const college of Object.values(COLLEGES)) {
        for (const program of Object.values(college.programs)) {
            if (
                program.id === identifier ||
                program.name === identifier ||
                normalizeCourseKey(program.id) === needle ||
                normalizeCourseKey(program.name) === needle
            ) {
                return { prog: program, collegeName: college.name };
            }
        }
    }
    return null;
}

function populateCourseSelectors() {
    if (!window.WMSU_COURSE_REQUIREMENTS) return;
    const studentCourseFilter = document.getElementById('studentCourseFilter');
    const prospectusProgram = document.getElementById('prospectus-program');
    const nsCourse = document.getElementById('ns-course');
    const courses = Object.keys(window.WMSU_COURSE_REQUIREMENTS).sort((a, b) => a.localeCompare(b));
    const options = courses.map(name => `<option value="${name}">${name}</option>`).join('');
    if (studentCourseFilter) studentCourseFilter.innerHTML = `<option value="">All Courses</option>${options}`;
    if (nsCourse) nsCourse.innerHTML = `<option value="">— Select —</option>${options}`;

    const prospectusPrograms = getAvailableProspectusPrograms();
    const prospectusOptions = prospectusPrograms.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
    if (prospectusProgram) prospectusProgram.innerHTML = `<option value="">Select Program</option>${prospectusOptions}`;
}

function renderStudentsTable(data) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    const countEl = document.getElementById('students-count');
    if (countEl) countEl.textContent = `${data.length} students`;

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted);">No students found.</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map((s) => `
        <tr class="clickable" onclick="openStudentPanel(${STUDENTS.indexOf(s)})">
            <td class="mono-text">${s.studentId}</td>
            <td>
                <div class="name-cell">${s.fullName}</div>
                <div class="sub-cell mono-text" style="font-size:0.70rem;">${s.email}</div>
            </td>
            <td><span class="badge neutral">${s.course}</span></td>
            <td style="font-size:0.82rem;">${s.yearLevel}${s.section ? ' – Sec ' + s.section : ''}</td>
            <td><span class="badge ${STATUS_COLORS[s.status] || 'neutral'}">${s.status}</span></td>
            <td><span class="badge ${TYPE_COLORS[s.studentType] || 'neutral'}" style="font-size:0.62rem;">${s.studentType}</span></td>
            <td style="font-size:0.80rem;color:var(--text-secondary);">${s.adviserName}</td>
            <td style="font-size:0.80rem;font-family:var(--mono);">${s.units} u</td>
            <td onclick="event.stopPropagation()">
                <div style="display:flex;gap:6px;">
                    <button class="btn-icon" title="View Details" onclick="openStudentPanel(${STUDENTS.indexOf(s)})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="btn-icon red" title="Remove Student" onclick="promptStudentAction('remove',${STUDENTS.indexOf(s)})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

function filterStudentsTable() {
    const q        = document.getElementById('studentsSearch')?.value.toLowerCase() || '';
    const course   = document.getElementById('studentCourseFilter')?.value || '';
    const year     = document.getElementById('studentYearFilter')?.value || '';
    const status   = document.getElementById('studentStatusFilter')?.value || '';
    const type     = document.getElementById('studentTypeFilter')?.value || '';

    const res = STUDENTS.filter(s =>
        (!q      || s.fullName.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
        (!course || isCourseMatch(s.course, course)) &&
        (!year   || s.yearLevel === parseInt(year)) &&
        (!status || s.status === status) &&
        (!type   || s.studentType === type)
    );
    renderStudentsTable(res);
}

function openStudentPanel(idx) {
    const s = STUDENTS[idx];
    selectedStudentIdx = idx;
    const panel = document.getElementById('studentDetailPanel');
    const body = document.getElementById('studentPanelBody');

    const typeColor = TYPE_COLORS[s.studentType] || 'neutral';
    const statusColor = STATUS_COLORS[s.status] || 'neutral';

    body.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
            <div class="employee-photo" style="background:${s.gender==='Female'?'#be185d':'#1d4ed8'};">
                ${s.firstName[0]}${s.lastName[0]}
            </div>
            <div>
                <div class="panel-name">${s.fullName}</div>
                <div class="panel-position mono-text">${s.studentId}</div>
                <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
                    <span class="badge ${statusColor}">${s.status}</span>
                    <span class="badge ${typeColor}">${s.studentType}</span>
                    <span class="badge neutral">${s.course}</span>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <div class="detail-label">Academic Information</div>
            <div class="detail-item"><span class="detail-item-key">Course</span><span class="detail-item-value">${s.course}</span></div>
            <div class="detail-item"><span class="detail-item-key">Year Level</span><span class="detail-item-value">${s.yearLevel}${['st','nd','rd','th'][s.yearLevel-1]||'th'} Year — Section ${s.section}</span></div>
            <div class="detail-item"><span class="detail-item-key">Semester</span><span class="detail-item-value">${s.semester}, AY ${s.ay}</span></div>
            <div class="detail-item"><span class="detail-item-key">Units Enrolled</span><span class="detail-item-value mono-text">${s.units}</span></div>
            <div class="detail-item"><span class="detail-item-key">Adviser</span><span class="detail-item-value">${s.adviserName}</span></div>
            <div class="detail-item"><span class="detail-item-key">Enrollment Date</span><span class="detail-item-value mono-text">${s.enrollmentDate}</span></div>
            ${s.studentType === 'Transferee' ? `
            <div class="detail-item"><span class="detail-item-key">Transferred From</span><span class="detail-item-value">${s.transferFrom}</span></div>
            <div class="detail-item"><span class="detail-item-key">Transfer Units</span><span class="detail-item-value mono-text">${s.transferUnits} u</span></div>` : ''}
        </div>

        <div class="detail-section">
            <div class="detail-label">Personal Information</div>
            <div class="detail-item"><span class="detail-item-key">Gender</span><span class="detail-item-value">${s.gender}</span></div>
            <div class="detail-item"><span class="detail-item-key">Birthdate</span><span class="detail-item-value mono-text">${s.birthdate}</span></div>
            <div class="detail-item"><span class="detail-item-key">Address</span><span class="detail-item-value">${s.address}</span></div>
            <div class="detail-item"><span class="detail-item-key">WMSU Email</span><span class="detail-item-value mono-text" style="font-size:0.76rem;">${s.email}</span></div>
            <div class="detail-item"><span class="detail-item-key">Contact</span><span class="detail-item-value mono-text">${s.contact}</span></div>
        </div>

        <div class="detail-section">
            <div class="detail-label">Guardian</div>
            <div class="detail-item"><span class="detail-item-key">Name</span><span class="detail-item-value">${s.guardian}</span></div>
            <div class="detail-item" style="border-bottom:none;"><span class="detail-item-key">Contact</span><span class="detail-item-value mono-text">${s.guardianContact}</span></div>
        </div>

        <div class="detail-section">
            <div class="detail-label">Enrolled Subjects (${s.subjects.length})</div>
            ${s.subjects.length === 0
                ? `<p style="font-size:0.80rem;color:var(--text-muted);padding:8px 0;">No subjects enrolled this semester.</p>`
                : `<table class="data-table" style="margin-top:4px;">
                    <thead><tr><th>Code</th><th>Subject</th><th style="text-align:right;">Units</th></tr></thead>
                    <tbody>
                        ${s.subjects.map(sub => `
                        <tr>
                            <td class="mono-text">${sub.code}</td>
                            <td style="font-size:0.80rem;">${sub.desc}</td>
                            <td class="mono-text" style="text-align:right;">${sub.units}</td>
                        </tr>`).join('')}
                        <tr style="background:var(--surface-2);">
                            <td colspan="2" style="font-weight:700;font-size:0.80rem;padding:8px 14px;">Total Units</td>
                            <td class="mono-text" style="text-align:right;font-weight:700;padding:8px 14px;">${s.units}</td>
                        </tr>
                    </tbody>
                </table>`
            }
        </div>
    `;
    panel.classList.add('open');
}

function closeStudentPanel() {
    document.getElementById('studentDetailPanel').classList.remove('open');
}

function promptStudentAction(action, idx) {
    const s = STUDENTS[idx];
    const msg = document.getElementById('deactivateMsg');
    const dan = document.getElementById('dangerZoneBlock');
    const btn = document.getElementById('confirmActionBtn');
    pendingAction = 'removeStudent';
    pendingActionIdx = idx;
    msg.textContent = `You are about to remove ${s.fullName} (${s.studentId}) from the system.`;
    dan.style.display = 'block';
    document.getElementById('dangerZoneDesc').textContent = 'This will permanently delete all enrollment records for this student. This action cannot be undone.';
    btn.className = 'btn btn-danger';
    btn.textContent = 'Remove Student';
    document.getElementById('deactivateModal').classList.add('open');
}

// Override confirmAction to handle student removal too
const _originalConfirmAction = confirmAction;
window.confirmAction = function() {
    if (pendingAction === 'removeStudent') {
        const s = STUDENTS[pendingActionIdx];
        STUDENTS.splice(pendingActionIdx, 1);
        showToast(`Student ${s.fullName} removed.`, 'error');
        addAuditEntry({ type:'student', action:'Student Record Removed', detail:`${s.fullName} (${s.studentId}) removed by SA-001`, time:nowStamp(), admin:'SA-001' });
        closeModal('deactivateModal');
        filterStudentsTable();
        updateStudentStats();
        return;
    }
    _originalConfirmAction();
};

function updateStudentStats() {
    const stats = getStudentStats();
    const el = (id) => document.getElementById(id);
    if (el('stat-total-students'))    el('stat-total-students').textContent    = stats.total;
    if (el('stat-enrolled-students')) el('stat-enrolled-students').textContent = stats.enrolled;
    if (el('stat-freshmen'))          el('stat-freshmen').textContent          = stats.freshmen;
    if (el('stat-transferees'))       el('stat-transferees').textContent       = stats.transferees;
}

// ─── REGISTER NEW STUDENT MODAL ──────────────────
let newStudentStep = 1;

function openRegisterStudentModal() {
    newStudentStep = 1;
    // Reset form
    ['ns-firstName','ns-lastName','ns-middleName','ns-gender','ns-birthdate',
     'ns-course','ns-section','ns-contact','ns-address','ns-guardian',
     'ns-guardianContact','ns-adviserId','ns-studentType','ns-transferFrom','ns-transferUnits'
    ].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    document.getElementById('ns-transferFields').style.display = 'none';
    updateRegisterStep();
    document.getElementById('registerStudentModal').classList.add('open');
}

function updateRegisterStep() {
    [1,2].forEach(s => {
        const el = document.getElementById(`ns-step-${s}`);
        if(el) el.style.display = s === newStudentStep ? 'block' : 'none';
        const pill = document.getElementById(`ns-pill-${s}`);
        if (!pill) return;
        if (s < newStudentStep)       pill.className = 'step-pill done';
        else if (s === newStudentStep) pill.className = 'step-pill active';
        else                           pill.className = 'step-pill';
    });
    const backBtn = document.getElementById('nsBackBtn');
    const nextBtn = document.getElementById('nsNextBtn');
    if (backBtn) backBtn.style.display = newStudentStep > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.textContent = newStudentStep === 2 ? 'Register Student' : 'Next →';
}

function nsStep(dir) {
    if (dir === 1) {
        if (newStudentStep === 1) {
            // Validate step 1
            const req = ['ns-firstName','ns-lastName','ns-birthdate','ns-gender','ns-course','ns-studentType'];
            for (const id of req) {
                if (!document.getElementById(id)?.value) {
                    showToast('Please fill in all required fields.','error');
                    return;
                }
            }
            // Preview on step 2
            const fn = document.getElementById('ns-firstName').value;
            const ln = document.getElementById('ns-lastName').value;
            const mn = document.getElementById('ns-middleName').value;
            const course = document.getElementById('ns-course').value;
            const type   = document.getElementById('ns-studentType').value;
            const year   = new Date().getFullYear();
            const isT    = type === 'Transferee';
            const previewId = isT ? `${year}-T####` : `${year}-#####`;
            document.getElementById('ns-preview').innerHTML = `
                <div style="padding:14px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);">
                    <div style="font-weight:700;font-size:1rem;">${fn} ${mn} ${ln}</div>
                    <div class="mono-text" style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">${previewId} · ${course} · <span class="badge ${TYPE_COLORS[type]||'neutral'}" style="font-size:0.62rem;">${type}</span></div>
                    <div style="font-size:0.76rem;color:var(--text-secondary);margin-top:6px;">Email will be auto-generated upon registration.</div>
                </div>`;
        }
        if (newStudentStep === 2) {
            // Final submit
            const type = document.getElementById('ns-studentType').value;
            const advEmp = EMPLOYEES.find(e => e.id === document.getElementById('ns-adviserId').value);
            const newS = addStudent({
                firstName:      document.getElementById('ns-firstName').value,
                lastName:       document.getElementById('ns-lastName').value,
                middleName:     document.getElementById('ns-middleName').value,
                fullName:       `${document.getElementById('ns-firstName').value} ${document.getElementById('ns-middleName').value} ${document.getElementById('ns-lastName').value}`.trim(),
                gender:         document.getElementById('ns-gender').value,
                birthdate:      document.getElementById('ns-birthdate').value,
                course:         document.getElementById('ns-course').value,
                yearLevel:      type === 'Transferee' ? (parseInt(document.getElementById('ns-transferUnits').value)||33) >= 66 ? 3 : 2 : 1,
                section:        document.getElementById('ns-section').value || 'A',
                status:         'Enrolled',
                studentType:    type,
                contact:        document.getElementById('ns-contact').value,
                address:        document.getElementById('ns-address').value,
                guardian:       document.getElementById('ns-guardian').value,
                guardianContact:document.getElementById('ns-guardianContact').value,
                adviserId:      document.getElementById('ns-adviserId').value,
                adviserName:    advEmp?.name || document.getElementById('ns-adviserId').value,
                enrollmentDate: new Date().toISOString().split('T')[0],
                semester:       '1st Semester',
                ay:             '2026–2027',
                units:          0,
                subjects:       [],
                ...(type === 'Transferee' ? {
                    transferFrom:  document.getElementById('ns-transferFrom').value,
                    transferUnits: parseInt(document.getElementById('ns-transferUnits').value) || 0,
                } : {}),
            });
            showToast(`Student ${newS.fullName} registered. ID: ${newS.studentId}`, 'success');
            addAuditEntry({ type:'student', action:'Student Registered', detail:`${newS.fullName} (${newS.studentId}) — ${newS.course} · ${newS.studentType}`, time:nowStamp(), admin:'SA-001' });
            closeModal('registerStudentModal');
            renderStudentsTable(STUDENTS);
            updateStudentStats();
            return;
        }
        newStudentStep = Math.min(2, newStudentStep + 1);
    } else {
        newStudentStep = Math.max(1, newStudentStep - 1);
    }
    updateRegisterStep();
}

function toggleTransferFields() {
    const type = document.getElementById('ns-studentType')?.value;
    const tf = document.getElementById('ns-transferFields');
    if (tf) tf.style.display = type === 'Transferee' ? 'block' : 'none';
}

// ─────────────────────────────────────────────────
// ══ PROSPECTUS MODULE ════════════════════════════
// ─────────────────────────────────────────────────

function renderProspectusTab() {
    const container = document.getElementById('prospectus-content');
    if (!container) return;

    const progSel  = document.getElementById('prospectus-program')?.value  || '';
    const yearSel  = document.getElementById('prospectus-year')?.value     || '';
    const semSel   = document.getElementById('prospectus-sem')?.value      || '';

    if (!progSel) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:24px;">Please select a WMSU program from the dropdown to view its prospectus.</p>';
        return;
    }

    const programData = findProgramByIdentifier(progSel);
    if (!programData) {
        container.innerHTML = `<p style="color:var(--text-muted);padding:24px;">Prospectus is not available for "${progSel}". Only programs currently modeled in the curriculum database are shown.</p>`;
        return;
    }
    const prog = programData.prog;
    const collegeName = programData.collegeName;

    const years = yearSel ? [parseInt(yearSel)] : [1,2,3,4];
    const sems  = semSel  ? [semSel]             : [SEM.FIRST, SEM.SECOND];

    let html = '';

    for (const yr of years) {
        const yrData = prog.prospectus[yr];
        if (!yrData) continue;
        for (const sem of sems) {
            const subjects = yrData[sem];
            if (!subjects || !subjects.length) continue;
            const totalUnits = subjects.reduce((a,s) => a + s.units, 0);

            html += `
            <div class="card section-gap">
                <div class="card-header">
                    <div class="card-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        ${['1st','2nd','3rd','4th'][yr-1]} Year — ${sem} Semester
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span class="badge neutral">${prog.name}</span>
                        <span class="badge info" style="font-family:var(--mono);">${totalUnits} units</span>
                    </div>
                </div>
                <div style="overflow-x:auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Title</th>
                                <th>Units</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Prerequisites</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjects.map(s => `
                            <tr>
                                <td class="mono-text">${s.code}</td>
                                <td style="font-size:0.84rem;">${s.title}</td>
                                <td class="mono-text" style="text-align:center;">${s.units}</td>
                                <td><span class="badge neutral" style="font-size:0.62rem;text-transform:capitalize;">${s.type || 'lecture'}</span></td>
                                <td><span class="badge ${s.category === 'GE' ? 'info' : 'neutral'}" style="font-size:0.62rem;">${s.category || 'Core'}</span></td>
                                <td style="font-size:0.76rem;color:var(--text-muted);">
                                    ${(s.prerequisites||[]).length ? s.prerequisites.join(', ') : '—'}
                                </td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }
    }

    container.innerHTML = html || '<p style="color:var(--text-muted);padding:24px;">No prospectus data found for selected filters.</p>';
}

// ─────────────────────────────────────────────────
// MODAL HELPERS
// ─────────────────────────────────────────────────
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
}

// ─────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────
function showToast(msg, type='success') {
    const icons = { success:'✓', warning:'⚠', error:'✕', info:'i' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span style="font-weight:700;">${icons[type]||'•'}</span> ${msg}`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function nowStamp() {
    const n = new Date();
    const p = x => String(x).padStart(2,'0');
    return `${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}`;
}

const COLLEGE_DEPTS   = ['College of Computing Studies','College of Engineering','College of Nursing','College of Business Administration','College of Arts and Sciences','College of Education'];
const COLLEGE_ROLES   = ['Adviser', 'Secretary', 'College Dean'];
const NON_COLLEGE_ROLES = ['Assessment Officer', 'Registrar Officer'];

function filterRolesByDept(deptValue) {
    const roleSelect = document.getElementById('roleSelect');
    const isCollege  = COLLEGE_DEPTS.includes(deptValue);
    const allowed    = isCollege ? COLLEGE_ROLES : NON_COLLEGE_ROLES;
    roleSelect.innerHTML = '<option value="">— Select Role —</option>';
    allowed.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r; opt.textContent = r;
        roleSelect.appendChild(opt);
    });
}

// ─────────────────────────────────────────────────
// ACCOUNTS TAB
// ─────────────────────────────────────────────────
const ACCOUNT_PASSWORDS = {
    'EMP-20241001': 'Ana@WMSU2024',   'EMP-20241002': 'Maria@WMSU2024',
    'EMP-20241003': 'Jose@WMSU2024',  'EMP-20241004': 'Clara@WMSU2024',
    'EMP-20241005': 'Ramon@WMSU2024', 'EMP-20241006': 'Luisa@WMSU2024',
    'EMP-20241007': 'Ben@WMSU2024',   'EMP-20241008': 'Rosa@WMSU2024',
    'EMP-20241009': 'Edgar@WMSU2024', 'EMP-20241010': 'Patricia@WMSU2024',
    'EMP-20241011': 'Carlos@WMSU2024','EMP-20241012': 'Diana@WMSU2024',
};

let passwordVisibility = {};

function renderAccountsTable(data) {
    const tbody = document.getElementById('accountsTableBody');
    document.getElementById('accounts-count').textContent = `${data.length} accounts`;
    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted);">No accounts found.</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(e => {
        const pw      = ACCOUNT_PASSWORDS[e.id] || '—';
        const visible = passwordVisibility[e.id];
        return `
        <tr>
            <td class="mono-text">${e.id}</td>
            <td><div class="name-cell">${e.name}</div><div class="sub-cell">${e.dept}</div></td>
            <td class="mono-text" style="font-size:0.78rem;">${e.email}</td>
            <td>${e.roles.map(r => `<span class="badge info" style="margin-right:4px;">${r}</span>`).join('')}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="mono-text" style="font-size:0.80rem;">${visible ? pw : '••••••••••'}</span>
                    <button class="btn-icon" onclick="togglePwVisibility('${e.id}')">
                        ${visible
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                    </button>
                </div>
            </td>
            <td><span class="badge ${e.status === 'Active' ? 'active' : 'inactive'}">${e.status}</span></td>
            <td onclick="event.stopPropagation()">
                <button class="btn-icon amber" onclick="openPasswordResetModal(${EMPLOYEES.indexOf(e)})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function togglePwVisibility(empId) {
    passwordVisibility[empId] = !passwordVisibility[empId];
    filterAccounts();
}

function filterAccounts() {
    const q  = document.getElementById('accountsSearch').value.toLowerCase();
    const st = document.getElementById('accountsStatusFilter').value;
    renderAccountsTable(EMPLOYEES.filter(e =>
        (!q  || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) &&
        (!st || e.status === st)
    ));
}

let resetTargetIdx = null;

function openPasswordResetModal(idx) {
    resetTargetIdx = idx;
    const e = EMPLOYEES[idx];
    document.getElementById('resetMsg').textContent =
        `Send a forced password reset link to ${e.name} (${e.email})? They will be required to set a new password on next login.`;
    document.getElementById('passwordResetModal').classList.add('open');
}

function confirmPasswordReset() {
    if (resetTargetIdx === null) return;
    const e = EMPLOYEES[resetTargetIdx];
    showToast(`Password reset link sent to ${e.email}.`, 'success');
    addAuditEntry({ type:'sysevent', action:'Password Reset Forced', detail:`${e.name} (${e.id}) — reset link sent by SA-001`, time:nowStamp(), admin:'SA-001' });
    closeModal('passwordResetModal');
    resetTargetIdx = null;
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });

    const deptSel = document.getElementById('deptSelect');
    if (deptSel) deptSel.addEventListener('change', function() { filterRolesByDept(this.value); });

    const nsType = document.getElementById('ns-studentType');
    if (nsType) nsType.addEventListener('change', toggleTransferFields);

    const prosProgram = document.getElementById('prospectus-program');
    const prosYear    = document.getElementById('prospectus-year');
    const prosSem     = document.getElementById('prospectus-sem');
    if (prosProgram) prosProgram.addEventListener('change', renderProspectusTab);
    if (prosYear)    prosYear.addEventListener('change', renderProspectusTab);
    if (prosSem)     prosSem.addEventListener('change', renderProspectusTab);

    populateCourseSelectors();
    renderProspectusTab();

    // Initial renders
    renderRolesTable(EMPLOYEES);
    renderRooms(ROOMS);
    renderFaculty(FACULTY);
    renderAudit([...AUDIT_LOGS].reverse());
    renderRecentActivity();
    renderAccountsTable(EMPLOYEES);
    updateStudentStats();
});