/* ═══════════════════════════════════════════════════
   WMSU-Ease — Department Head  |  dept-head.js
═══════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────
let currentDept    = '';
let currentView    = 'all';
let currentFilter  = 'all';
let currentCourse  = '';   // "" = all courses in dept
let currentPage    = 1;
const PAGE_SIZE    = 20;
let activeAppNo    = null;
let activeAction   = null; // 'accept' | 'interview' | 'reject'

// Estimated total slots per dept (realistic WMSU numbers)
const DEPT_SLOTS = {
    'College of Computing Studies':        150,
    'College of Engineering':              300,
    'College of Nursing':                  120,
    'College of Business Administration':  200,
    'College of Arts and Sciences':        180,
    'College of Education':                160,
    'College of Agriculture':              200,
    'College of Criminology':              100,
    'College of Islamic and Arabic Studies': 80,
};

// ── Data helpers ──────────────────────────────────
function getApps() {
    try { return JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); } catch(e) { return []; }
}
function saveApps(arr) {
    localStorage.setItem('wmsu_applications', JSON.stringify(arr));
    // also update own freshmanApp if it matches
    const own = localStorage.getItem('freshmanApp');
    if (own) {
        try {
            const o = JSON.parse(own);
            const updated = arr.find(a => a.appNo === o.appNo);
            if (updated) localStorage.setItem('freshmanApp', JSON.stringify(updated));
        } catch(e) { /* ignore */ }
    }
}

function getDeptApps(dept) {
    return getApps().filter(a =>
        a.department === dept && a.admissionStatus !== 'flagged'
    );
}

function isQualified(a) {
    if (!window.WMSU_checkQualification) return null;
    return window.WMSU_checkQualification(
        a.course, a.cet?.oapr || 0, a.natScore, a.eatScore
    );
}

// ── Department change ─────────────────────────────
function onDeptChange() {
    const val = document.getElementById('deptSelect').value;
    setDept(val);
}

function quickDept(d) {
    document.getElementById('deptSelect').value = d;
    setDept(d);
}

function setDept(dept) {
    currentDept   = dept;
    currentView   = 'all';
    currentFilter = 'all';
    currentCourse = '';
    currentPage   = 1;

    const noState   = document.getElementById('noDeptState');
    const mainCont  = document.getElementById('mainContent');
    const sbEmpty   = document.getElementById('sidebarEmpty');
    const sbContent = document.getElementById('sidebarContent');

    if (!dept) {
        noState.style.display  = 'flex';
        mainCont.style.display = 'none';
        sbEmpty.style.display  = 'flex';
        sbContent.style.display= 'none';
        return;
    }

    noState.style.display  = 'none';
    mainCont.style.display = 'block';
    sbEmpty.style.display  = 'none';
    sbContent.style.display= 'block';

    // Topbar avatar initials from dept
    const initials = dept.split(' ').filter(w => /^[A-Z]/.test(w)).map(w=>w[0]).join('').slice(0,2);
    document.getElementById('deptAvatar').textContent  = initials || 'DH';
    document.getElementById('deptUserLabel').textContent = dept.replace('College of ','').replace('College of ','');

    buildCourseNav(dept);
    renderKPIs();
    render();
}

// ── Build course nav ──────────────────────────────
function buildCourseNav(dept) {
    const apps = getDeptApps(dept);
    // Group by course
    const counts = {};
    apps.forEach(a => { if(a.course) counts[a.course] = (counts[a.course]||0)+1; });
    const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);

    const req = window.WMSU_COURSE_REQUIREMENTS || {};
    const html = sorted.map(([c,n]) => {
        const icon = req[c]?.icon || '📚';
        const short = c.replace(/^BS |^BA |^Bachelor of |^Associate in /,'').slice(0,28);
        return `<a class="sidebar-course-link" id="cnav-${btoa(c).replace(/=/g,'')}"
                   onclick="filterByCourse(${JSON.stringify(c)})" title="${c}">
                    <span>${icon}</span>
                    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;">${short}</span>
                    <span class="sidebar-course-badge">${n}</span>
                </a>`;
    }).join('');
    document.getElementById('courseNav').innerHTML = html;
}

function filterByCourse(course) {
    currentCourse = course;
    currentView   = 'all';
    currentFilter = 'all';
    currentPage   = 1;

    // Deactivate sidebar links
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.sidebar-course-link').forEach(l => l.classList.remove('active'));

    const key = btoa(course).replace(/=/g,'');
    document.getElementById('cnav-'+key)?.classList.add('active');

    const req = window.WMSU_COURSE_REQUIREMENTS?.[course];
    document.getElementById('pageTitle').textContent = course;
    document.getElementById('pageDesc').textContent  = req ? `${req.note} · Min OAPR: ${req.oaprMin} PR` : 'Course applicants';

    render();
}

// ── KPI + badges ──────────────────────────────────
function renderKPIs() {
    if (!currentDept) return;
    const apps = getDeptApps(currentDept);

    const pending   = apps.filter(a => a.status === 'pending_review' && !a.deptStatus);
    const qualified = apps.filter(a => { const r=isQualified(a); return r&&r.qualified; });
    const interview = apps.filter(a => a.deptStatus === 'for_interview');
    const accepted  = apps.filter(a => a.deptStatus === 'accepted');
    const rejected  = apps.filter(a => a.deptStatus === 'rejected');

    document.getElementById('kpi-total').textContent    = apps.length;
    document.getElementById('kpi-pending').textContent  = pending.length;
    document.getElementById('kpi-qualified').textContent= qualified.length;
    document.getElementById('kpi-interview').textContent= interview.length;
    document.getElementById('kpi-accepted').textContent = accepted.length;
    document.getElementById('kpi-rejected').textContent = rejected.length;

    document.getElementById('badge-all').textContent       = apps.length;
    document.getElementById('badge-pending').textContent   = pending.length;
    document.getElementById('badge-qualified').textContent = qualified.length;
    document.getElementById('badge-interview').textContent = interview.length;
    document.getElementById('badge-accepted').textContent  = accepted.length;
    document.getElementById('badge-rejected').textContent  = rejected.length;

    // Slot bar
    const slots = DEPT_SLOTS[currentDept] || 150;
    const pct   = Math.min(100, Math.round(accepted.length / slots * 100));
    document.getElementById('slotFill').style.width = pct + '%';
    document.getElementById('slotPct').textContent  = pct + '%';
    document.getElementById('slotSub').textContent  =
        `${accepted.length} accepted of ${slots} estimated slots — ${slots - accepted.length} remaining`;

    document.getElementById('syncLabel').textContent =
        'Last sync: ' + new Date().toLocaleTimeString('en-PH', {hour:'2-digit',minute:'2-digit'});
}

// ── Render table ──────────────────────────────────
function render() {
    if (!currentDept) return;

    let rows = getDeptApps(currentDept);

    // Course filter (sidebar course nav)
    if (currentCourse) {
        rows = rows.filter(a => a.course === currentCourse);
    }

    // View filter
    if (currentView === 'pending')   rows = rows.filter(a => a.status==='pending_review' && !a.deptStatus);
    if (currentView === 'qualified') rows = rows.filter(a => { const r=isQualified(a); return r&&r.qualified; });
    if (currentView === 'interview') rows = rows.filter(a => a.deptStatus==='for_interview');
    if (currentView === 'accepted')  rows = rows.filter(a => a.deptStatus==='accepted');
    if (currentView === 'rejected')  rows = rows.filter(a => a.deptStatus==='rejected');

    // Toolbar filter
    if (currentFilter === 'qualified')   rows = rows.filter(a => { const r=isQualified(a); return r&&r.qualified; });
    if (currentFilter === 'unqualified') rows = rows.filter(a => { const r=isQualified(a); return r&&!r.qualified; });
    if (currentFilter === 'freshman')    rows = rows.filter(a => a.applicantType==='freshman');
    if (currentFilter === 'transferee')  rows = rows.filter(a => a.applicantType==='transferee');

    // Search
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    if (q) rows = rows.filter(a =>
        (a.name||'').toLowerCase().includes(q) ||
        (a.appNo||'').toLowerCase().includes(q) ||
        (a.course||'').toLowerCase().includes(q)
    );

    // Sort
    const sort = document.getElementById('sortSel').value;
    if (sort==='oapr-desc') rows.sort((a,b)=>(b.cet?.oapr||0)-(a.cet?.oapr||0));
    if (sort==='oapr-asc')  rows.sort((a,b)=>(a.cet?.oapr||0)-(b.cet?.oapr||0));
    if (sort==='date-desc') rows.sort((a,b)=>new Date(b.submittedDate||0)-new Date(a.submittedDate||0));
    if (sort==='date-asc')  rows.sort((a,b)=>new Date(a.submittedDate||0)-new Date(b.submittedDate||0));
    if (sort==='name-asc')  rows.sort((a,b)=>(a.name||'').localeCompare(b.name||''));

    paginateAndRender(rows);
}

function paginateAndRender(rows) {
    const total = rows.length;
    const pages = Math.ceil(total / PAGE_SIZE) || 1;
    if (currentPage > pages) currentPage = pages;
    const start = (currentPage-1)*PAGE_SIZE;
    const paged = rows.slice(start, start+PAGE_SIZE);

    const tbody = document.getElementById('tableBody');
    const empty = document.getElementById('emptyState');
    const pagin = document.getElementById('pagination');

    if (!total) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        pagin.style.display = 'none';
        return;
    }
    empty.style.display = 'none';
    pagin.style.display = 'flex';
    document.getElementById('paginInfo').textContent =
        `Showing ${start+1}–${Math.min(start+PAGE_SIZE,total)} of ${total}`;
    document.getElementById('prevBtn').disabled = currentPage <= 1;
    document.getElementById('nextBtn').disabled = currentPage >= pages;

    tbody.innerHTML = paged.map(renderRow).join('');
}

function renderRow(a) {
    const oapr = a.cet?.oapr || 0;
    const oaprClass = oapr >= 75 ? 'sp-high' : oapr >= 50 ? 'sp-mid' : 'sp-low';

    const qr = isQualified(a);
    const qualHtml = qr
        ? `<span class="qual-tag ${qr.qualified?'qual-pass':'qual-fail'}">${qr.qualified?'✓ Qualifies':'✗ Below cutoff'}</span>`
        : '—';

    // Dept status badge
    const ds = a.deptStatus;
    let statusHtml = '<span class="badge b-pending">Pending</span>';
    if (ds === 'for_interview') statusHtml = '<span class="badge b-interview">For Interview</span>';
    if (ds === 'accepted')      statusHtml = '<span class="badge b-accepted">Accepted</span>';
    if (ds === 'rejected')      statusHtml = '<span class="badge b-rejected">Rejected</span>';

    const dateStr = a.submittedDate
        ? new Date(a.submittedDate).toLocaleDateString('en-PH', {month:'short',day:'numeric',year:'numeric'})
        : '—';

    // Action buttons: only show relevant actions based on current status
    let actBtns = `<button class="btn-act btn-view" onclick="openPanel('${a.appNo}')">View</button>`;
    if (!ds || ds === 'for_interview') {
        actBtns += `<button class="btn-act btn-accept" onclick="openActionModal('${a.appNo}','accept')">Accept</button>`;
    }
    if (!ds) {
        actBtns += `<button class="btn-act btn-interview" onclick="openActionModal('${a.appNo}','interview')">Interview</button>`;
    }
    if (ds !== 'rejected' && ds !== 'accepted') {
        actBtns += `<button class="btn-act btn-reject" onclick="openActionModal('${a.appNo}','reject')">Reject</button>`;
    }

    const courseShort = (a.course||'—').replace(/^BS |^BA |^Bachelor of /,'');

    return `<tr>
        <td>
            <div class="sname">${a.name||'—'}</div>
            <div class="sid">${a.appNo} · ${a.email||''}</div>
        </td>
        <td>
            <span class="score-pill ${oaprClass}">${oapr||'—'}</span>
            ${a.natScore?`<span style="font-size:10px;color:var(--muted);display:block;margin-top:2px;">NAT:${a.natScore}</span>`:''}
            ${a.eatScore?`<span style="font-size:10px;color:var(--muted);display:block;margin-top:2px;">EAT:${a.eatScore}</span>`:''}
        </td>
        <td>${qualHtml}</td>
        <td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;" title="${a.course||''}">${courseShort}</td>
        <td><span class="type-tag ${a.applicantType||'freshman'}">${a.applicantType||'freshman'}</span></td>
        <td>${statusHtml}</td>
        <td style="font-size:12px;color:var(--muted);">${dateStr}</td>
        <td><div class="act-row">${actBtns}</div></td>
    </tr>`;
}

function changePage(d) { currentPage += d; render(); window.scrollTo({top:0,behavior:'smooth'}); }

// ── View/filter setters ───────────────────────────
function setView(v, el) {
    currentView   = v;
    currentCourse = '';
    currentPage   = 1;

    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.sidebar-course-link').forEach(l => l.classList.remove('active'));
    if (el) el.classList.add('active');

    const titles = {
        all:       ['All Applicants',   'All applicants assigned to your department.'],
        pending:   ['For Review',       'New applications awaiting your decision.'],
        qualified: ['Qualified',        'Applicants who meet the minimum OAPR requirements.'],
        interview: ['For Interview',    'Applicants you have scheduled for interview.'],
        accepted:  ['Accepted',         'Applicants you have accepted into your program.'],
        rejected:  ['Rejected',         'Applications that did not meet requirements.'],
    };
    const t = titles[v] || titles.all;
    document.getElementById('pageTitle').textContent = t[0];
    document.getElementById('pageDesc').textContent  = t[1];

    render();
}

function setFilter(f) {
    currentFilter = f; currentPage = 1;
    document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
    document.getElementById('fc-'+f)?.classList.add('active');
    render();
}

// ── Detail Panel ──────────────────────────────────
function openPanel(appNo) {
    const a = getApps().find(x => x.appNo === appNo);
    if (!a) return;

    document.getElementById('panelName').textContent = a.name || appNo;

    const oapr = a.cet?.oapr || 0;
    const qr   = isQualified(a);
    const req  = window.WMSU_COURSE_REQUIREMENTS?.[a.course];

    const cetHtml = a.cet ? `
        <div class="oapr-box">
            <span class="oapr-lbl">OAPR</span>
            <span class="oapr-val">${oapr} PR</span>
        </div>
        ${[['ep','English Proficiency'],['rc','Reading Comprehension'],['sps','Science Process Skills'],['qs','Quantitative Skills'],['ats','Abstract Thinking Skills']].map(([k,lbl])=>`
        <div class="cet-sub-row">
            <div class="cet-sub-lbl"><span>${lbl}</span><span class="cet-sub-val">${a.cet[k]}</span></div>
            <div class="cet-bar"><div class="cet-fill" style="width:${a.cet[k]}%;background:${a.cet[k]>=50?'var(--green)':'var(--cr)'}"></div></div>
        </div>`).join('')}
    ` : '<p style="font-size:12px;color:var(--muted)">No CET scores on record.</p>';

    const qualHtml = qr ? `
        <div class="qual-result-box ${qr.qualified?'pass':'fail'}">
            <div class="qt">${qr.qualified ? '✓ Applicant Qualifies' : '✗ Does Not Meet Requirements'}</div>
            ${qr.reasons.length
                ? `<div class="qr">${qr.reasons.map(r=>`• ${r}`).join('<br>')}</div>`
                : req ? `<div class="qr">Meets all requirements for ${a.course}.<br><em>${req.note}</em></div>` : ''
            }
        </div>` : '';

    const extraHtml = (a.natScore || a.eatScore) ? `
        <div class="panel-section">
            <div class="panel-sec-title">Special Exam Scores</div>
            ${a.natScore ? `<div class="panel-row"><span class="panel-key">NAT Score</span><span class="panel-val" style="color:${a.natScore>=260?'var(--green)':'var(--cr)'}">${a.natScore}</span></div>` : ''}
            ${a.eatScore ? `<div class="panel-row"><span class="panel-key">EAT Score</span><span class="panel-val" style="color:${a.eatScore>=240?'var(--green)':'var(--cr)'}">${a.eatScore}</span></div>` : ''}
        </div>` : '';

    // Interview schedule display
    const schedHtml = a.interviewDate ? `
        <div class="panel-section">
            <div class="panel-sec-title">Interview Schedule</div>
            <div class="panel-row"><span class="panel-key">Date & Time</span><span class="panel-val">${new Date(a.interviewDate).toLocaleString('en-PH',{month:'long',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span></div>
            ${a.interviewMode  ? `<div class="panel-row"><span class="panel-key">Mode</span><span class="panel-val">${a.interviewMode}</span></div>` : ''}
            ${a.interviewNotes ? `<div class="panel-row"><span class="panel-key">Notes</span><span class="panel-val">${a.interviewNotes}</span></div>` : ''}
        </div>` : '';

    // Rejection reason
    const rejectHtml = a.deptStatus === 'rejected' && a.rejectionReason ? `
        <div class="panel-section">
            <div class="panel-sec-title">Rejection Reason</div>
            <div style="background:var(--red-pale);border:1px solid #fecaca;border-radius:8px;padding:11px 13px;font-size:12.5px;">
                <strong style="color:var(--red);">${a.rejectionReason}</strong>
                ${a.rejectionNotes ? `<div style="color:var(--muted);margin-top:4px;font-size:12px;">${a.rejectionNotes}</div>` : ''}
            </div>
        </div>` : '';

    const ds = a.deptStatus;
    const dateStr = a.submittedDate ? new Date(a.submittedDate).toLocaleString('en-PH') : '—';

    document.getElementById('panelBody').innerHTML = `
        <div class="panel-section">
            <div class="panel-sec-title">Personal Info</div>
            <div class="panel-row"><span class="panel-key">App No.</span><span class="panel-val">${a.appNo}</span></div>
            <div class="panel-row"><span class="panel-key">Full Name</span><span class="panel-val">${a.name}</span></div>
            <div class="panel-row"><span class="panel-key">Type</span><span class="panel-val"><span class="type-tag ${a.applicantType}">${a.applicantType}</span></span></div>
            <div class="panel-row"><span class="panel-key">Email</span><span class="panel-val">${a.email||'—'}</span></div>
            <div class="panel-row"><span class="panel-key">Contact</span><span class="panel-val">${a.contact||'—'}</span></div>
            <div class="panel-row"><span class="panel-key">Course</span><span class="panel-val">${a.course||'—'}</span></div>
            <div class="panel-row"><span class="panel-key">Submitted</span><span class="panel-val">${dateStr}</span></div>
        </div>
        <div class="panel-section">
            <div class="panel-sec-title">CET Scores</div>
            ${cetHtml}
            ${qualHtml}
        </div>
        ${extraHtml}
        ${schedHtml}
        ${rejectHtml}
        <div class="panel-actions">
            ${(!ds || ds==='for_interview') ? `<button class="btn-panel btn-panel-accept" onclick="openActionModal('${a.appNo}','accept');closePanel()">✓ Accept</button>` : ''}
            ${!ds ? `<button class="btn-panel btn-panel-interview" onclick="openActionModal('${a.appNo}','interview');closePanel()">📅 Schedule Interview</button>` : ''}
            ${(ds !== 'rejected' && ds !== 'accepted') ? `<button class="btn-panel btn-panel-reject" onclick="openActionModal('${a.appNo}','reject');closePanel()">✗ Reject</button>` : ''}
        </div>
    `;

    document.getElementById('detailPanel').classList.add('open');
}

function closePanel() {
    document.getElementById('detailPanel').classList.remove('open');
}

// ── Action Modal ──────────────────────────────────
function openActionModal(appNo, action) {
    activeAppNo  = appNo;
    activeAction = action;

    const apps = getApps();
    const a    = apps.find(x => x.appNo === appNo);
    if (!a) return;

    const modalHd   = document.getElementById('modalHd');
    const modalTitle= document.getElementById('modalTitle');
    const body      = document.getElementById('modalBodyContent');

    const studentBox = `
        <div class="modal-student-box">
            <strong>${a.name}</strong>
            <span>${a.appNo} · ${a.course||'—'} · OAPR: ${a.cet?.oapr||'—'}</span>
        </div>`;

    if (action === 'accept') {
        modalHd.className = 'modal-hd accept-hd';
        modalTitle.textContent = '✓ Accept Applicant';
        body.innerHTML = `
            ${studentBox}
            <p style="font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6;">
                Accepting this applicant will notify them via email and lock their course — they will <strong>no longer be able to change</strong> their applied course.
            </p>
            <div class="form-field">
                <label>Remarks for Applicant (optional)</label>
                <textarea id="acceptRemarks" rows="3" placeholder="e.g. Congratulations! Please bring your documents on enrollment day."></textarea>
            </div>
            <div class="modal-alert" id="modalAlert"></div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button class="btn-confirm-accept" onclick="confirmAction()">Confirm Acceptance</button>
            </div>`;
    }

    if (action === 'interview') {
        modalHd.className = 'modal-hd interview-hd';
        modalTitle.textContent = '📅 Schedule Interview';
        // Default to 3 days from now at 9am
        const d = new Date(); d.setDate(d.getDate()+3); d.setHours(9,0);
        const dtLocal = d.toISOString().slice(0,16);
        body.innerHTML = `
            ${studentBox}
            <div class="form-field">
                <label>Interview Date & Time</label>
                <input type="datetime-local" id="interviewDate" value="${dtLocal}">
            </div>
            <div class="form-field">
                <label>Mode</label>
                <select id="interviewMode">
                    <option value="Face-to-face">Face-to-face (On-campus)</option>
                    <option value="Online (Zoom)">Online (Zoom)</option>
                    <option value="Online (Google Meet)">Online (Google Meet)</option>
                    <option value="Phone call">Phone call</option>
                </select>
            </div>
            <div class="form-field">
                <label>Notes to Applicant (optional)</label>
                <textarea id="interviewNotes" rows="2" placeholder="e.g. Bring original documents. Wear semi-formal attire."></textarea>
            </div>
            <div class="modal-alert" id="modalAlert"></div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button class="btn-confirm-interview" onclick="confirmAction()">Schedule Interview</button>
            </div>`;
    }

    if (action === 'reject') {
        modalHd.className = 'modal-hd reject-hd';
        modalTitle.textContent = '✗ Reject Application';
        body.innerHTML = `
            ${studentBox}
            <div class="form-field">
                <label>Reason for Rejection</label>
                <select id="rejectionReason">
                    <option value="">Select a reason…</option>
                    <option value="OAPR does not meet the minimum requirement for this course">OAPR below minimum requirement</option>
                    <option value="NAT score does not meet the minimum requirement">NAT score below minimum (Nursing)</option>
                    <option value="EAT score does not meet the minimum requirement">EAT score below minimum (Engineering)</option>
                    <option value="No available slots for this program">No available slots for this program</option>
                    <option value="Incomplete or invalid application documents">Incomplete or invalid documents</option>
                    <option value="Did not appear for scheduled interview">Did not appear for interview</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-field">
                <label>Additional Notes (optional)</label>
                <textarea id="rejectionNotes" rows="2" placeholder="Any additional explanation for the applicant…"></textarea>
            </div>
            <div class="modal-alert" id="modalAlert"></div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button class="btn-confirm-reject" onclick="confirmAction()">Confirm Rejection</button>
            </div>`;
    }

    document.getElementById('actionModal').classList.add('open');
}

function closeModal() {
    document.getElementById('actionModal').classList.remove('open');
    activeAppNo  = null;
    activeAction = null;
}

function confirmAction() {
    const alertEl = document.getElementById('modalAlert');
    const apps = getApps();
    const idx  = apps.findIndex(a => a.appNo === activeAppNo);
    if (idx === -1) { closeModal(); return; }

    const a = apps[idx];

    if (activeAction === 'accept') {
        apps[idx].deptStatus    = 'accepted';
        apps[idx].status        = 'reviewed';
        apps[idx].acceptedDate  = new Date().toISOString();
        apps[idx].acceptRemarks = document.getElementById('acceptRemarks')?.value.trim() || '';
        // Lock course — cannot be changed once accepted
        apps[idx].courseLocked  = true;
        saveApps(apps);
        closeModal(); renderKPIs(); render();
        showToast(`${a.name} accepted for ${a.course}.`, 'success');
        return;
    }

    if (activeAction === 'interview') {
        const dateVal = document.getElementById('interviewDate')?.value;
        if (!dateVal) {
            alertEl.textContent = 'Please select an interview date.';
            alertEl.className = 'modal-alert show err'; return;
        }
        apps[idx].deptStatus     = 'for_interview';
        apps[idx].interviewDate  = new Date(dateVal).toISOString();
        apps[idx].interviewMode  = document.getElementById('interviewMode')?.value || 'Face-to-face';
        apps[idx].interviewNotes = document.getElementById('interviewNotes')?.value.trim() || '';
        saveApps(apps);
        closeModal(); renderKPIs(); render();
        const fmt = new Date(dateVal).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
        showToast(`Interview scheduled for ${a.name} on ${fmt}.`, 'info');
        return;
    }

    if (activeAction === 'reject') {
        const reason = document.getElementById('rejectionReason')?.value;
        if (!reason) {
            alertEl.textContent = 'Please select a rejection reason.';
            alertEl.className = 'modal-alert show err'; return;
        }
        apps[idx].deptStatus      = 'rejected';
        apps[idx].rejectionReason = reason;
        apps[idx].rejectionNotes  = document.getElementById('rejectionNotes')?.value.trim() || '';
        apps[idx].rejectedDate    = new Date().toISOString();
        saveApps(apps);
        closeModal(); renderKPIs(); render();
        showToast(`Application of ${a.name} has been rejected.`, 'error');
        return;
    }
}

// ── Toast ─────────────────────────────────────────
function showToast(msg, type = '') {
    const c = document.getElementById('toastContainer');
    const d = document.createElement('div');
    d.className = 'toast' + (type ? ' '+type : '');
    d.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>${msg}`;
    c.appendChild(d);
    setTimeout(() => d.remove(), 3800);
}

// ── Close modal on overlay click ──────────────────
document.getElementById('actionModal').addEventListener('click', e => {
    if (e.target === document.getElementById('actionModal')) closeModal();
});

// ── Init ──────────────────────────────────────────
function init() {
    // Restore last selected dept from session
    const lastDept = sessionStorage.getItem('wmsu_dept_head_dept');
    if (lastDept) {
        document.getElementById('deptSelect').value = lastDept;
        setDept(lastDept);
    }
    setInterval(() => { renderKPIs(); render(); }, 15000);
}

function waitAndInit() {
    if (window.WMSU_CET_DB && window.WMSU_COURSE_REQUIREMENTS) {
        setTimeout(init, 350);
    } else {
        setTimeout(waitAndInit, 100);
    }
}
waitAndInit();

// Save dept selection to session
document.getElementById('deptSelect').addEventListener('change', () => {
    const v = document.getElementById('deptSelect').value;
    if (v) sessionStorage.setItem('wmsu_dept_head_dept', v);
});