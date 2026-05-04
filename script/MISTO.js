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
    { type:"sysevent",   action:"School Year Started",            detail:"AY 2025–2026 2nd Semester initiated by SA-001",             time:"2026-01-06 08:00", admin:"SA-001" },
    { type:"activate",   action:"Account Activated",              detail:"Prof. Jose Rizal (EMP-20241003) — role: Adviser / CCS",     time:"2026-01-06 08:15", admin:"SA-001" },
    { type:"role",       action:"Role Assigned",                  detail:"Prof. Maria Reyes (EMP-20241002) — added role: Secretary",  time:"2026-01-06 09:02", admin:"SA-001" },
    { type:"sync",       action:"HRIS Sync Completed",            detail:"47 records verified, 0 discrepancies found",               time:"2026-01-07 07:14", admin:"SA-001" },
    { type:"deactivate", action:"Account Deactivated",            detail:"Ms. Diana Suarez (EMP-20241012) — reason: On leave",       time:"2026-02-01 14:30", admin:"SA-001" },
    { type:"activate",   action:"Account Reactivated",            detail:"Mr. Ben Aquino (EMP-20241007) — returned from leave",      time:"2026-02-15 09:00", admin:"SA-001" },
    { type:"role",       action:"Role Revoked",                   detail:"EMP-20241008 — Assessment Officer role removed",           time:"2026-02-20 11:45", admin:"SA-001" },
    { type:"sync",       action:"HRIS Sync Triggered",            detail:"3 new employee records detected, pending assignment",      time:"2026-05-01 07:14", admin:"SA-001" },
    { type:"delete",     action:"Employee Record Deleted",        detail:"EMP-20239901 — record permanently removed from system",    time:"2026-03-10 16:22", admin:"SA-001" },
    { type:"sysevent",   action:"SHA-256 Engine Recalibrated",    detail:"Grade verification hashes refreshed for AY 2025–2026",    time:"2026-01-05 23:58", admin:"SA-001" },
];
 
// ─────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────
let modalCurrentStep  = 1;
let pendingAction     = null;
let pendingActionIdx  = null;
let schoolYearActive  = true;
let verifiedEmployee  = null;
 
// ─────────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    document.getElementById('systemClock').textContent =
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
    document.getElementById('tab-' + tab).classList.add('active');
    if (btn) btn.classList.add('active');
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
    const btn  = document.getElementById('syncBtn');
    const icon = document.getElementById('syncIcon');
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
    tbody.innerHTML = data.map((e, idx) => `
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
// ACTION PROMPTS (Deactivate / Reactivate / Delete)
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
            ${e.roles.map(r=>`
            <div class="detail-item">
                <span class="detail-item-key">Role</span>
                <span class="detail-item-value">${r}</span>
            </div>`).join('')}
        </div>
 
        <div class="detail-section">
            <div class="detail-label">Contact</div>
            <div class="detail-item"><span class="detail-item-key">WMSU Email</span><span class="detail-item-value mono-text" style="font-size:0.78rem;">${e.email}</span></div>
            <div class="detail-item" style="border-bottom:none;"><span class="detail-item-key">Contact No.</span><span class="detail-item-value mono-text">${e.contact}</span></div>
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
            // Validate + lookup
            const id = document.getElementById('empIdInput').value.trim();
            const found = HRIS_LOOKUP[id] || EMPLOYEES.find(e=>e.id===id);
            if (!found) {
                document.getElementById('empIdInput').className = 'form-input error';
                showToast('Employee ID not found in HRIS records.', 'error');
                return;
            }
            verifiedEmployee = found.name ? found : { name:found.name||'Unknown', initials:(found.name||'??').split(' ').map(w=>w[0]).slice(0,2).join(''), email:found.email||'—', position:found.position||'—', dept:found.dept||'—', contact:found.contact||'—' };
            document.getElementById('empIdInput').className = 'form-input verified';
            document.getElementById('empInitials').textContent  = verifiedEmployee.initials;
            document.getElementById('empName').textContent      = verifiedEmployee.name;
            document.getElementById('empEmail').textContent     = verifiedEmployee.email;
            document.getElementById('empPosition').textContent  = verifiedEmployee.position;
            document.getElementById('empDept').textContent      = verifiedEmployee.dept    || '—';
            document.getElementById('empContact').textContent   = verifiedEmployee.contact || '—';
            document.getElementById('empLookupResult').style.display = 'flex';
            // Pre-fill and filter the dept select on Step 2
            if (verifiedEmployee.dept) {
                const deptSel = document.getElementById('deptSelect');
                for (let i = 0; i < deptSel.options.length; i++) {
                    if (deptSel.options[i].value === verifiedEmployee.dept) {
                        deptSel.value = verifiedEmployee.dept;
                        break;
                    }
                }
                filterRolesByDept(verifiedEmployee.dept);
            }
        }
        if (modalCurrentStep === 2) {
            if (!document.getElementById('deptSelect').value || !document.getElementById('roleSelect').value) {
                showToast('Please select both a department and a role.', 'error');
                return;
            }
            // Populate confirm step
            document.getElementById('conf-name').textContent  = verifiedEmployee.name;
            document.getElementById('conf-dept').textContent  = document.getElementById('deptSelect').value;
            document.getElementById('conf-role').textContent  = document.getElementById('roleSelect').value;
            document.getElementById('conf-email').textContent = verifiedEmployee.email;
        }
        if (modalCurrentStep === 3) {
            // Final confirm
            const newRole = document.getElementById('roleSelect').value;
            const existing = EMPLOYEES.find(e=>e.id===document.getElementById('empIdInput').value.trim());
            if (existing) {
                if (!existing.roles.includes(newRole)) existing.roles.push(newRole);
            }
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
    const ic = LOG_ICONS;
    container.innerHTML = recent.map(l => {
        const i = ic[l.type] || ic.sysevent;
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
    badge.textContent = parseInt(badge.textContent||0) + 1;
}
 
// ─────────────────────────────────────────────────
// MODAL HELPERS
// ─────────────────────────────────────────────────
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}
 
// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
    });
});
 
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
 
// ─────────────────────────────────────────────────
// ROLE FILTERING BY DEPARTMENT TYPE
// ─────────────────────────────────────────────────
const COLLEGE_DEPTS = [
    'College of Computing Studies',
    'College of Engineering',
    'College of Nursing',
    'College of Business Administration',
    'College of Arts and Sciences',
    'College of Education',
];

// Roles available per department type
const COLLEGE_ROLES      = ['Adviser', 'Secretary', 'College Dean'];
const NON_COLLEGE_ROLES  = ['Assessment Officer', 'Registrar Officer'];

function filterRolesByDept(deptValue) {
    const roleSelect  = document.getElementById('roleSelect');
    const isCollege   = COLLEGE_DEPTS.includes(deptValue);
    const allowed     = isCollege ? COLLEGE_ROLES : NON_COLLEGE_ROLES;

    // Reset and re-render options
    roleSelect.innerHTML = '<option value="">— Select Role —</option>';
    allowed.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        roleSelect.appendChild(opt);
    });
}

// ─────────────────────────────────────────────────
// ACCOUNTS TAB
// ─────────────────────────────────────────────────

// Mock passwords — prototype only. Replace with hashed values from backend.
const ACCOUNT_PASSWORDS = {
    'EMP-20241001': 'Ana@WMSU2024',
    'EMP-20241002': 'Maria@WMSU2024',
    'EMP-20241003': 'Jose@WMSU2024',
    'EMP-20241004': 'Clara@WMSU2024',
    'EMP-20241005': 'Ramon@WMSU2024',
    'EMP-20241006': 'Luisa@WMSU2024',
    'EMP-20241007': 'Ben@WMSU2024',
    'EMP-20241008': 'Rosa@WMSU2024',
    'EMP-20241009': 'Edgar@WMSU2024',
    'EMP-20241010': 'Patricia@WMSU2024',
    'EMP-20241011': 'Carlos@WMSU2024',
    'EMP-20241012': 'Diana@WMSU2024',
};

let passwordVisibility = {}; // tracks which rows are revealed

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
            <td>
                <div class="name-cell">${e.name}</div>
                <div class="sub-cell">${e.dept}</div>
            </td>
            <td class="mono-text" style="font-size:0.78rem;">${e.email}</td>
            <td>${e.roles.map(r => `<span class="badge info" style="margin-right:4px;">${r}</span>`).join('')}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="mono-text" style="font-size:0.80rem;letter-spacing:0.04em;">
                        ${visible ? pw : '••••••••••'}
                    </span>
                    <button class="btn-icon" title="${visible ? 'Hide' : 'Reveal'} password"
                        style="color:var(--text-muted);"
                        onclick="togglePwVisibility('${e.id}')">
                        ${visible
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
                        }
                    </button>
                </div>
            </td>
            <td><span class="badge ${e.status === 'Active' ? 'active' : 'inactive'}">${e.status}</span></td>
            <td onclick="event.stopPropagation()" style="white-space:nowrap;">
                <button class="btn-icon amber" title="Force Password Reset"
                    onclick="openPasswordResetModal(${EMPLOYEES.indexOf(e)})">
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
    const res = EMPLOYEES.filter(e =>
        (!q  || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) &&
        (!st || e.status === st)
    );
    renderAccountsTable(res);
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
    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Modal backdrop: click outside to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });

    // Hook dept select to role filter
    document.getElementById('deptSelect').addEventListener('change', function() {
        filterRolesByDept(this.value);
    });

    // Initial renders
    renderRolesTable(EMPLOYEES);
    renderRooms(ROOMS);
    renderFaculty(FACULTY);
    renderAudit([...AUDIT_LOGS].reverse());
    renderRecentActivity();
    renderAccountsTable(EMPLOYEES);
});