/* ═══════════════════════════════════════════════════════
   WMSU-Ease — Secretary Portal
   secretary.js
   ═══════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────
// MOCK DATA
// Replace with real API fetches when the backend is ready.
// ─────────────────────────────────────────────────

let REGISTRAR_SUBMISSIONS_OPEN = true; // Guardrail from Registrar

const FACULTY_LIST = [
    { id:1, name:"Dr. Ana Dizon",       initials:"AD", position:"Associate Professor II", maxUnits:21 },
    { id:2, name:"Prof. Maria Reyes",   initials:"MR", position:"Assistant Professor I",  maxUnits:18 },
    { id:3, name:"Prof. Jose Rizal",    initials:"JR", position:"Instructor I",           maxUnits:15 },
    { id:4, name:"Dr. Ramon Dela Cruz", initials:"RD", position:"Professor III",          maxUnits:21 },
    { id:5, name:"Dr. Luisa Fernandez", initials:"LF", position:"Professor IV",           maxUnits:21 },
    { id:6, name:"Mr. Ben Aquino",      initials:"BA", position:"Instructor II",          maxUnits:15 },
    { id:7, name:"Ms. Clara Bautista",  initials:"CB", position:"Associate Professor I",  maxUnits:18 },
    { id:8, name:"Prof. Edgar Tan",     initials:"ET", position:"Instructor I",           maxUnits:15 },
    { id:9, name:"Dr. Patricia Lim",    initials:"PL", position:"Professor II",           maxUnits:21 },
    { id:10,name:"Ms. Tanya Mercado",   initials:"TM", position:"Instructor I",           maxUnits:15 },
];

const SUBJECTS = [
    { code:"CS 311", title:"Data Structures & Algorithms", units:3, program:"CS", year:3 },
    { code:"CS 312", title:"Object-Oriented Programming",  units:3, program:"CS", year:3 },
    { code:"CS 313", title:"Discrete Mathematics",         units:3, program:"CS", year:2 },
    { code:"CS 401", title:"Software Engineering",         units:3, program:"CS", year:4 },
    { code:"CS 402", title:"Capstone Project 1",           units:3, program:"CS", year:4 },
    { code:"IT 401", title:"Systems Integration",          units:3, program:"IT", year:4 },
    { code:"IT 402", title:"Network Administration",       units:3, program:"IT", year:3 },
    { code:"CC 101", title:"Introduction to Computing",    units:3, program:"CS", year:1 },
    { code:"CC 102", title:"Programming 1",                units:3, program:"CS", year:1 },
    { code:"CC 103", title:"Programming 2",                units:3, program:"CS", year:1 },
    { code:"OOP 112",title:"Object-Oriented Programming",  units:3, program:"IT", year:2 },
    { code:"DB 201", title:"Database Management",          units:3, program:"CS", year:2 },
    { code:"MATH 101",title:"Pre-Calculus",                units:3, program:"CS", year:1 },
    { code:"GE 001", title:"Understanding the Self",       units:3, program:"GE", year:1 },
    { code:"PE 001", title:"Physical Education 1",         units:2, program:"GE", year:1 },
    { code:"NET 101",title:"Networking Fundamentals",      units:3, program:"IT", year:1 },
    { code:"ACT 101",title:"Computer Technology 1",        units:3, program:"ACT",year:1 },
];

const ROOMS_LIST = [
    { code:"CS Lab 1",  cap:40, type:"Computer Lab",  dept:"CS" },
    { code:"CS Lab 2",  cap:40, type:"Computer Lab",  dept:"CS" },
    { code:"CS Lab 3",  cap:40, type:"Computer Lab",  dept:"CS" },
    { code:"IT Lab 1",  cap:35, type:"Computer Lab",  dept:"IT" },
    { code:"NET Lab",   cap:30, type:"Computer Lab",  dept:"IT" },
    { code:"CS CR-101", cap:45, type:"Classroom",     dept:"CS" },
    { code:"CS CR-102", cap:45, type:"Classroom",     dept:"CS" },
    { code:"SCI 204",   cap:35, type:"Classroom",     dept:"GEN" },
    { code:"HSS 301",   cap:45, type:"Classroom",     dept:"GEN" },
    { code:"Gym A",     cap:80, type:"Gym",           dept:"PE" },
];

// Replace with a real API fetch when the backend is ready.
let ASSIGNMENTS = [
    { id:1,  facultyId:1, code:"CS 311", title:"Data Structures & Algorithms", section:"BSCS-3A", days:"MWF", time:"07:30–08:30", room:"CS Lab 1",  units:3 },
    { id:2,  facultyId:1, code:"CS 312", title:"Object-Oriented Programming",  section:"BSCS-3A", days:"TTh", time:"09:00–10:30", room:"CS Lab 2",  units:3 },
    { id:3,  facultyId:1, code:"DB 201", title:"Database Management",          section:"BSCS-2A", days:"MWF", time:"10:30–11:30", room:"CS Lab 3",  units:3 },
    { id:4,  facultyId:2, code:"CC 101", title:"Introduction to Computing",     section:"BSCS-1A", days:"MWF", time:"07:30–08:30", room:"CS CR-101", units:3 },
    { id:5,  facultyId:2, code:"CC 102", title:"Programming 1",                section:"BSCS-1B", days:"TTh", time:"07:30–09:00", room:"CS CR-102", units:3 },
    { id:6,  facultyId:3, code:"MATH 101",title:"Pre-Calculus",               section:"BSCS-1A", days:"TTh", time:"10:30–12:00", room:"SCI 204",   units:3 },
    { id:7,  facultyId:3, code:"GE 001", title:"Understanding the Self",        section:"BSCS-1B", days:"MWF", time:"13:00–14:00", room:"HSS 301",   units:3 },
    { id:8,  facultyId:4, code:"CS 401", title:"Software Engineering",          section:"BSCS-4A", days:"MWF", time:"08:30–09:30", room:"CS CR-101", units:3 },
    { id:9,  facultyId:4, code:"CS 402", title:"Capstone Project 1",            section:"BSCS-4A", days:"TTh", time:"13:00–14:30", room:"CS Lab 1",  units:3 },
    // CONFLICT: same room CS Lab 1, same days MWF, overlapping time as id:1
    { id:10, facultyId:5, code:"OOP 112",title:"Object-Oriented Programming",   section:"BSIT-2A", days:"MWF", time:"08:00–09:00", room:"CS Lab 1",  units:3 },
    { id:11, facultyId:6, code:"IT 402", title:"Network Administration",        section:"BSIT-3A", days:"TTh", time:"07:30–09:00", room:"NET Lab",   units:3 },
    { id:12, facultyId:7, code:"IT 401", title:"Systems Integration",           section:"BSIT-4A", days:"MWF", time:"09:30–10:30", room:"IT Lab 1",  units:3 },
];

let nextAssignmentId = 13;

const SECTIONS = [
    { id:"BSCS-1A", program:"CS", year:1, enrolled:38, cap:40, adviser:"Prof. Maria Reyes",  status:"Active" },
    { id:"BSCS-1B", program:"CS", year:1, enrolled:35, cap:40, adviser:"Prof. Jose Rizal",   status:"Active" },
    { id:"BSCS-2A", program:"CS", year:2, enrolled:40, cap:40, adviser:"Dr. Ana Dizon",      status:"Active" },
    { id:"BSCS-2B", program:"CS", year:2, enrolled:28, cap:40, adviser:"Ms. Tanya Mercado",  status:"Active" },
    { id:"BSCS-3A", program:"CS", year:3, enrolled:32, cap:40, adviser:"Dr. Ramon Dela Cruz",status:"Active" },
    { id:"BSCS-3B", program:"CS", year:3, enrolled:29, cap:40, adviser:"Dr. Luisa Fernandez",status:"Active" },
    { id:"BSCS-4A", program:"CS", year:4, enrolled:20, cap:30, adviser:"Dr. Patricia Lim",   status:"Active" },
    { id:"BSIT-1A", program:"IT", year:1, enrolled:40, cap:40, adviser:"Prof. Edgar Tan",    status:"Active" },
    { id:"BSIT-2A", program:"IT", year:2, enrolled:35, cap:40, adviser:"Ms. Clara Bautista", status:"Active" },
    { id:"BSIT-3A", program:"IT", year:3, enrolled:30, cap:40, adviser:"Mr. Ben Aquino",     status:"Active" },
    { id:"BSIT-4A", program:"IT", year:4, enrolled:18, cap:30, adviser:"Dr. Ana Dizon",      status:"Active" },
    { id:"BSACT-1A",program:"ACT",year:1, enrolled:20, cap:25, adviser:"Prof. Maria Reyes",  status:"Active" },
];

const PROSPECTUS_VERSIONS = [
    { version:"v2025.2", program:"BSCS", changes:3, status:"returned",  updatedBy:"Ms. Clara Santos", date:"2025-01-13", note:"Returned by Dean — CC 101 units issue." },
    { version:"v2025.1", program:"BSCS", changes:1, status:"endorsed",  updatedBy:"Ms. Clara Santos", date:"2025-01-08", note:"" },
    { version:"v2024.2", program:"BSIT", changes:2, status:"endorsed",  updatedBy:"Ms. Clara Santos", date:"2024-07-10", note:"" },
    { version:"v2024.1", program:"BSCS", changes:5, status:"archived",  updatedBy:"Ms. Clara Santos", date:"2024-01-15", note:"" },
    { version:"v2025.1", program:"BSIT", changes:2, status:"draft",     updatedBy:"Ms. Clara Santos", date:"2025-01-14", note:"" },
    { version:"v2025.1", program:"BSACT",changes:1, status:"draft",     updatedBy:"Ms. Clara Santos", date:"2025-01-12", note:"" },
];

const APPROVAL_REQUESTS = [
    { id:1, type:"add_drop",  student:"Maria Santos",   studentId:"2021-00142", detail:"Requesting to drop CC 101 and add GE 001. Medical reason attached.", submitted:"Jan 12, 2025", status:"pending" },
    { id:2, type:"section",   student:"Juan Dela Cruz",  studentId:"2021-00198", detail:"Requesting transfer from BSCS-3A to BSCS-3B due to schedule conflict with PE.", submitted:"Jan 11, 2025", status:"pending" },
    { id:3, type:"override",  student:"Ana Reyes",       studentId:"2022-00311", detail:"Override for CS 311 — missing prerequisite CS 211. Dean's endorsement attached.", submitted:"Jan 10, 2025", status:"forwarded" },
    { id:4, type:"special",   student:"Pedro Lim",       studentId:"2019-00055", detail:"Requesting special enrollment for graduating student beyond max units.", submitted:"Jan 09, 2025", status:"pending" },
    { id:5, type:"add_drop",  student:"Rosa Bautista",   studentId:"2023-00210", detail:"Drop IT 402, add NET 101. Approved by adviser — needs Secretary endorsement.", submitted:"Jan 14, 2025", status:"pending" },
];

const DEADLINES = [
    { title:"Load submission to Dean",    sub:"Faculty loading for all programs",        date:"Today",     urgency:"red" },
    { title:"Section enrollment cutoff",  sub:"BSCS Year 1 — add/drop closes",          date:"Jan 20",    urgency:"amber" },
    { title:"Prospectus resubmission",    sub:"BSCS v2025.2 — after correction fix",    date:"Jan 17",    urgency:"amber" },
    { title:"Adviser assignment deadline",sub:"All sections must have assigned adviser", date:"Jan 22",    urgency:"green" },
    { title:"Syllabus upload deadline",   sub:"All syllabi to registrar portal",         date:"Jan 25",    urgency:"green" },
];

const ACTION_NEEDED = [
    { icon:"🏠", bg:"var(--red-pale)",    title:"Room conflict — CS Lab 1",       sub:"Double-booked MWF 07:30–09:00. CS311-A and OOP112-B overlap.", tab:"rooms" },
    { icon:"👤", bg:"var(--amber-pale)",  title:"Missing instructor",              sub:"BSCS-2B has 28 enrolled students but no faculty assigned for CC 103.", tab:"faculty" },
    { icon:"📉", bg:"var(--amber-pale)",  title:"Low enrollment — BSCS-4A",       sub:"20/30 students. Minimum 15 to push through. Monitor.", tab:"sections" },
    { icon:"📋", bg:"var(--blue-pale)",   title:"Syllabus not uploaded",           sub:"CS 313 Discrete Mathematics — no syllabus on file.", tab:"prospectus" },
    { icon:"🔗", bg:"var(--purple-pale)", title:"Prerequisite not mapped",         sub:"IT 401 has no prerequisite entry in the curriculum map.", tab:"prospectus" },
];

const STUDENT_REQUESTS = [
    { student:"Maria Santos",  type:"Add/Drop", detail:"Drop CC 101 → Add GE 001",           date:"Jan 12" },
    { student:"Juan Dela Cruz",type:"Section",  detail:"Transfer BSCS-3A → BSCS-3B",         date:"Jan 11" },
    { student:"Pedro Lim",     type:"Special",  detail:"Overtime enrollment for graduating",  date:"Jan 09" },
];

const PENDING_SIGNATURES = [
    { doc:"Faculty Load Sheet", role:"Dean",       status:"Waiting", since:"Jan 13" },
    { doc:"BSCS v2025.2",       role:"Dean",       status:"Returned",since:"Jan 13" },
    { doc:"BSIT v2025.1",       role:"Registrar",  status:"Pending", since:"Jan 10" },
];

const CHANGE_LOG = [
    { action:"Prof. Rizal — added MATH 101 assignment",  type:"cr",    time:"Today 09:42" },
    { action:"Section BSCS-2B capacity updated to 40",   type:"blue",  time:"Today 08:15" },
    { action:"BSCS v2025.2 returned by Dean",            type:"amber", time:"Jan 13 16:30" },
    { action:"Room CS Lab 1 conflict flagged",            type:"cr",    time:"Jan 13 09:05" },
    { action:"Dr. Dela Cruz — CS 401 load approved",     type:"green", time:"Jan 12 14:00" },
    { action:"New section BSCS-3B created",              type:"blue",  time:"Jan 10 11:22" },
];

const PROSPECTUS_CHAIN = [
    { role:"Secretary",    name:"Ms. Clara Santos", status:"done",     note:"Submitted Jan 10" },
    { role:"Dean Review",  name:"Dr. Norma Santos", status:"returned", note:"Returned Jan 13 — correction needed" },
    { role:"Registrar",    name:"Pending",          status:"pending",  note:"" },
];

// ─────────────────────────────────────────────────
// STATE MANAGEMENT & DRAFT PERSISTENCE
// ─────────────────────────────────────────────────

const DRAFT_KEY = 'wmsu_secretary_draft_ccs';
let isUnsaved   = false;
let selectedFacultyId = null;
let activeSidecar = 'faculty';

function markUnsaved() {
    isUnsaved = true;
    document.getElementById('saveDot').className   = 'topbar-save-dot unsaved';
    document.getElementById('saveLabel').textContent = 'Unsaved changes';
    document.getElementById('draftDot').className  = 'draft-dot unsaved';
    document.getElementById('draftLabel').textContent = 'Unsaved draft';
}

function markSaved() {
    isUnsaved = false;
    document.getElementById('saveDot').className   = 'topbar-save-dot saved';
    document.getElementById('saveLabel').textContent = 'All changes saved';
    document.getElementById('draftDot').className  = 'draft-dot saved';
    document.getElementById('draftLabel').textContent = 'Draft saved';
}

function saveDraft() {
    // Replace with a real API call when the backend is ready.
    try {
        const payload = { assignments: ASSIGNMENTS, ts: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        markSaved();
        showToast('Draft saved to local storage.', 'success');
        addChangeLog('Draft saved manually by Secretary', 'blue');
    } catch(e) {
        showToast('Could not save draft. Storage may be full.', 'error');
    }
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        const payload = JSON.parse(raw);
        if (payload && payload.assignments) {
            ASSIGNMENTS = payload.assignments;
            const d = new Date(payload.ts);
            document.getElementById('saveLabel').textContent =
                `Restored from ${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
        }
    } catch(e) { /* ignore corrupt draft */ }
}

// Dirty-state browser leave prompt
window.addEventListener('beforeunload', e => {
    if (isUnsaved) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Auto-save every 60 seconds
setInterval(() => {
    if (isUnsaved) saveDraft();
}, 60000);

// ─────────────────────────────────────────────────
// GUARDRAIL
// ─────────────────────────────────────────────────
function applyGuardrail() {
    const locked = !REGISTRAR_SUBMISSIONS_OPEN;
    const banner = document.getElementById('guardrailBanner');
    const layout = document.getElementById('mainLayout');
    banner.classList.toggle('hidden', !locked);
    layout.classList.toggle('banner-open', locked);

    const btns = document.querySelectorAll('#btnSubmitLoads,#btnSubmitProspectus');
    btns.forEach(b => {
        b.classList.toggle('disabled', locked);
        b.disabled = locked;
    });
}

// ─────────────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────────────
function switchTab(tab, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (btn) btn.classList.add('active');
}

// ─────────────────────────────────────────────────
// CONFLICT DETECTION ENGINE
// ─────────────────────────────────────────────────

/**
 * Converts a time string like "07:30–08:30" or "07:30-08:30"
 * into {start: 450, end: 510} (minutes since midnight).
 */
function parseTime(str) {
    if (!str) return null;
    const parts = str.replace('–','-').split('-');
    if (parts.length !== 2) return null;
    const toMin = t => {
        const [h, m] = t.trim().split(':').map(Number);
        return isNaN(h) || isNaN(m) ? null : h * 60 + m;
    };
    const s = toMin(parts[0]), e = toMin(parts[1]);
    if (s === null || e === null) return null;
    return { start: s, end: e };
}

function daysOverlap(d1, d2) {
    const expand = d => {
        if (d === 'MWF') return ['M','W','F'];
        if (d === 'TTh') return ['T','Th'];
        if (d === 'Daily') return ['M','T','W','Th','F'];
        if (d === 'Sat') return ['Sat'];
        return [d];
    };
    const a = expand(d1), b = expand(d2);
    return a.some(x => b.includes(x));
}

function timesOverlap(t1, t2) {
    const a = parseTime(t1), b = parseTime(t2);
    if (!a || !b) return false;
    return a.start < b.end && b.start < a.end;
}

/**
 * Returns a Set of assignment IDs that have room conflicts.
 * Also returns instructor conflicts (same instructor, overlapping time).
 */
function detectConflicts() {
    const roomConflicts = new Set();
    const instrConflicts = new Set();

    for (let i = 0; i < ASSIGNMENTS.length; i++) {
        for (let j = i + 1; j < ASSIGNMENTS.length; j++) {
            const a = ASSIGNMENTS[i], b = ASSIGNMENTS[j];

            // Room conflict
            if (a.room && b.room && a.room === b.room
                && daysOverlap(a.days, b.days)
                && timesOverlap(a.time, b.time)) {
                roomConflicts.add(a.id);
                roomConflicts.add(b.id);
            }

            // Instructor conflict (same faculty, overlapping time)
            if (a.facultyId === b.facultyId
                && daysOverlap(a.days, b.days)
                && timesOverlap(a.time, b.time)) {
                instrConflicts.add(a.id);
                instrConflicts.add(b.id);
            }
        }
    }
    return { roomConflicts, instrConflicts };
}

// Live conflict preview in Add Assignment modal
function checkConflictPreview() {
    const room  = document.getElementById('assignRoom')?.value?.trim();
    const days  = document.getElementById('assignDays')?.value;
    const time  = document.getElementById('assignTime')?.value?.trim();
    const msg   = document.getElementById('conflictPreviewMsg');
    if (!msg) return;

    if (!room || !days || !time) { msg.style.display = 'none'; return; }

    const clash = ASSIGNMENTS.find(a =>
        a.room === room &&
        daysOverlap(a.days, days) &&
        timesOverlap(a.time, time)
    );

    if (clash) {
        const f = FACULTY_LIST.find(x => x.id === clash.facultyId);
        msg.textContent = `⚠ Room conflict: ${room} is already used by ${clash.code} (${clash.section}) ${clash.days} ${clash.time}${f ? ' — '+f.name : ''}.`;
        msg.style.display = 'block';
        document.getElementById('assignRoom').className = 'form-input conflict';
    } else {
        msg.style.display = 'none';
        document.getElementById('assignRoom').className = 'form-input';
    }
}

// ─────────────────────────────────────────────────
// UNIT CALCULATOR
// ─────────────────────────────────────────────────
function getFacultyUnits(facultyId) {
    return ASSIGNMENTS
        .filter(a => a.facultyId === facultyId)
        .reduce((sum, a) => sum + (a.units || 0), 0);
}

function getLoadStatus(units, maxUnits) {
    if (units > maxUnits) return 'Overloaded';
    if (units < maxUnits * 0.6) return 'Underloaded';
    return 'Optimal';
}

function updateUnitCounter() {
    const sel = document.getElementById('assignFaculty');
    if (!sel) return;
    const id  = parseInt(sel.value);
    const f   = FACULTY_LIST.find(x => x.id === id);
    if (!f) {
        document.getElementById('unitVal').textContent    = '—';
        document.getElementById('unitLimit').textContent  = 'Select a faculty member';
        document.getElementById('unitLimit').className    = 'unit-limit';
        document.getElementById('unitStatusFill').style.width = '0%';
        return;
    }
    const units  = getFacultyUnits(id);
    const status = getLoadStatus(units, f.maxUnits);
    const pct    = Math.min(100, Math.round(units / f.maxUnits * 100));

    document.getElementById('unitVal').textContent = `${units} / ${f.maxUnits}`;
    const limitEl = document.getElementById('unitLimit');
    limitEl.textContent = `${status} — max ${f.maxUnits} units (${f.position})`;
    limitEl.className   = `unit-limit ${status === 'Overloaded' ? 'overload' : status === 'Underloaded' ? 'underload' : ''}`;

    const fill   = document.getElementById('unitStatusFill');
    fill.style.width      = `${pct}%`;
    fill.style.background = status === 'Overloaded' ? 'var(--red)' : status === 'Underloaded' ? 'var(--amber)' : 'var(--green)';

    selectedFacultyId = id;
    renderSidecarContent();
}

// ─────────────────────────────────────────────────
// DASHBOARD RENDERS
// ─────────────────────────────────────────────────
function renderDashboard() {
    // Deadlines
    document.getElementById('deadlineList').innerHTML =
        DEADLINES.map(d => `
        <div class="deadline-item">
            <div class="deadline-dot ${d.urgency}"></div>
            <div>
                <div class="deadline-title">${d.title}</div>
                <div class="deadline-sub">${d.sub}</div>
            </div>
            <div class="deadline-date ${d.urgency === 'red' ? 'urgent' : d.urgency === 'amber' ? 'soon' : ''}">${d.date}</div>
        </div>`).join('');

    // Action needed
    document.getElementById('actionList').innerHTML =
        ACTION_NEEDED.map(a => `
        <div class="action-item" onclick="switchTab('${a.tab}',document.getElementById('nav-${a.tab}'))" style="cursor:pointer;">
            <div class="action-icon" style="background:${a.bg};">${a.icon}</div>
            <div>
                <div class="action-title">${a.title}</div>
                <div class="action-sub">${a.sub}</div>
            </div>
        </div>`).join('');

    // Faculty load
    document.getElementById('dashFacultyLoad').innerHTML =
        FACULTY_LIST.slice(0,6).map(f => {
            const units  = getFacultyUnits(f.id);
            const status = getLoadStatus(units, f.maxUnits);
            const pct    = Math.min(100, Math.round(units / f.maxUnits * 100));
            const col    = status === 'Overloaded' ? 'var(--red)' : status === 'Underloaded' ? 'var(--amber)' : 'var(--green)';
            const badgeC = status === 'Overloaded' ? 'badge-red' : status === 'Underloaded' ? 'badge-amber' : 'badge-green';
            return `
            <div style="display:flex;align-items:center;gap:10px;padding:9px 18px;border-bottom:1px solid var(--border);">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--cr-deep);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;">${f.initials}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
                    <div style="height:4px;background:var(--bg-dk);border-radius:99px;margin-top:4px;overflow:hidden;">
                        <div style="height:100%;width:${pct}%;background:${col};border-radius:99px;"></div>
                    </div>
                </div>
                <span class="badge ${badgeC}" style="flex-shrink:0;">${units}u</span>
            </div>`;
        }).join('');

    // Student requests
    document.getElementById('studentRequests').innerHTML =
        STUDENT_REQUESTS.map(r => `
        <div class="action-item">
            <div class="action-icon" style="background:var(--blue-pale);">📥</div>
            <div style="flex:1;">
                <div class="action-title">${r.student} <span class="badge badge-blue" style="margin-left:4px;">${r.type}</span></div>
                <div class="action-sub">${r.detail}</div>
            </div>
            <div style="font-size:11px;color:var(--muted-lt);white-space:nowrap;">${r.date}</div>
        </div>`).join('');

    // Pending signatures
    document.getElementById('pendingSignatures').innerHTML =
        PENDING_SIGNATURES.map(s => `
        <div class="deadline-item">
            <div class="deadline-dot ${s.status === 'Waiting' ? 'amber' : s.status === 'Returned' ? 'red' : 'amber'}"></div>
            <div>
                <div class="deadline-title">${s.doc}</div>
                <div class="deadline-sub">${s.role} — since ${s.since}</div>
            </div>
            <span class="badge ${s.status === 'Returned' ? 'badge-red' : 'badge-amber'}">${s.status}</span>
        </div>`).join('');

    // Change log
    document.getElementById('changeLog').innerHTML =
        CHANGE_LOG.map(l => `
        <div class="log-entry">
            <div class="log-dot ${l.type}"></div>
            <div>
                <div class="log-action">${l.action}</div>
            </div>
            <div class="log-time">${l.time}</div>
        </div>`).join('');
}

function addChangeLog(action, type = 'cr') {
    const now = new Date();
    const t   = `${now.toLocaleString('en-PH',{hour:'2-digit',minute:'2-digit'})}`;
    CHANGE_LOG.unshift({ action, type, time: `Today ${t}` });
    if (CHANGE_LOG.length > 12) CHANGE_LOG.pop();
    const el = document.getElementById('changeLog');
    if (el) renderDashboard();
}

// ─────────────────────────────────────────────────
// FACULTY TABLE
// ─────────────────────────────────────────────────
function loadStatusBadge(status) {
    const m = {
        Optimal:    'badge badge-green',
        Overloaded: 'badge badge-red',
        Underloaded:'badge badge-amber',
    };
    return `<span class="${m[status] || 'badge badge-gray'}">${status}</span>`;
}

function renderFacultyTable() {
    const q  = (document.getElementById('facultySearch')?.value || '').toLowerCase();
    const sf = document.getElementById('loadStatusFilter')?.value || '';
    const { roomConflicts, instrConflicts } = detectConflicts();
    const allConflicts = new Set([...roomConflicts, ...instrConflicts]);

    const filtered = ASSIGNMENTS.filter(a => {
        const f = FACULTY_LIST.find(x => x.id === a.facultyId);
        if (!f) return false;
        const matchQ  = !q || f.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.title.toLowerCase().includes(q);
        const units   = getFacultyUnits(a.facultyId);
        const status  = getLoadStatus(units, f.maxUnits);
        const matchSt = !sf || status === sf;
        return matchQ && matchSt;
    });

    const hasConflicts = allConflicts.size > 0;
    const notice = document.getElementById('conflictNotice');
    if (notice) notice.classList.toggle('hidden', !hasConflicts);
    if (hasConflicts && notice) {
        document.getElementById('conflictMessage').textContent =
            `${allConflicts.size} conflict${allConflicts.size > 1 ? 's' : ''} detected (room or instructor overlap). Highlighted rows must be resolved before submitting.`;
    }

    document.getElementById('facultyCount').textContent = `${filtered.length} rows`;
    document.getElementById('badge-faculty').textContent =
        FACULTY_LIST.filter(f => getLoadStatus(getFacultyUnits(f.id), f.maxUnits) !== 'Optimal').length || 0;

    document.getElementById('facultyTableBody').innerHTML = filtered.length === 0
        ? `<tr><td colspan="10"><div class="empty-state"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>No assignments match your filters.</p></div></td></tr>`
        : filtered.map(a => {
            const f      = FACULTY_LIST.find(x => x.id === a.facultyId);
            const units  = getFacultyUnits(a.facultyId);
            const status = getLoadStatus(units, f?.maxUnits || 21);
            const hasC   = allConflicts.has(a.id);
            const rowCls = hasC ? 'conflict-row' : '';
            return `
            <tr class="${rowCls}">
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;background:var(--cr-deep);color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;flex-shrink:0;">${f?.initials||'?'}</div>
                        <span style="font-weight:600;font-size:13px;">${f?.name||'Unknown'}</span>
                    </div>
                </td>
                <td class="mono">${a.code}</td>
                <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.title}</td>
                <td><span class="badge badge-gray">${a.section}</span></td>
                <td>${a.days}</td>
                <td class="mono" style="white-space:nowrap;">${a.time}</td>
                <td>
                    ${a.room}
                    ${hasC ? '<span class="conflict-badge" style="margin-left:5px;">⚠ Conflict</span>' : ''}
                </td>
                <td style="text-align:center;font-weight:700;">${a.units}</td>
                <td>${loadStatusBadge(status)}</td>
                <td>
                    <div style="display:flex;gap:4px;">
                        <button style="background:none;border:1px solid var(--border);border-radius:5px;padding:3px 7px;cursor:pointer;font-size:11px;font-family:inherit;color:var(--muted);"
                            onclick="editAssignment(${a.id})">Edit</button>
                        <button style="background:none;border:1px solid var(--red-b);border-radius:5px;padding:3px 7px;cursor:pointer;font-size:11px;font-family:inherit;color:var(--red);"
                            onclick="removeAssignment(${a.id})">Remove</button>
                    </div>
                </td>
            </tr>`;
        }).join('');
}

function removeAssignment(id) {
    if (!confirm('Remove this assignment?')) return;
    const idx = ASSIGNMENTS.findIndex(a => a.id === id);
    if (idx > -1) {
        const a = ASSIGNMENTS[idx];
        const f = FACULTY_LIST.find(x => x.id === a.facultyId);
        ASSIGNMENTS.splice(idx, 1);
        markUnsaved();
        renderFacultyTable();
        showToast(`${a.code} removed from ${f?.name || 'faculty'}.`, 'warning');
        addChangeLog(`${a.code} assignment removed`, 'cr');
    }
}

function editAssignment(id) {
    showToast('Inline editing — click any cell to edit (coming soon).', 'info');
}

// ─────────────────────────────────────────────────
// SECTIONS TABLE
// ─────────────────────────────────────────────────
function renderSectionsTable() {
    const q    = (document.getElementById('sectionSearch')?.value || '').toLowerCase();
    const prog = document.getElementById('sectionProgramFilter')?.value || '';
    const yr   = document.getElementById('sectionYearFilter')?.value || '';

    const filtered = SECTIONS.filter(s =>
        (!q    || s.id.toLowerCase().includes(q) || s.adviser.toLowerCase().includes(q)) &&
        (!prog || s.program === prog) &&
        (!yr   || String(s.year) === yr)
    );

    document.getElementById('sectionCount').textContent = `${filtered.length} sections`;
    document.getElementById('sectionsTableBody').innerHTML = filtered.length === 0
        ? `<tr><td colspan="8"><div class="empty-state"><p>No sections match your filters.</p></div></td></tr>`
        : filtered.map(s => {
            const pct    = Math.round(s.enrolled / s.cap * 100);
            const fillC  = pct >= 95 ? 'var(--red)' : pct >= 70 ? 'var(--green)' : 'var(--amber)';
            return `
            <tr>
                <td><strong>${s.id}</strong></td>
                <td><span class="badge badge-gray">${s.program === 'CS' ? 'BSCS' : s.program === 'IT' ? 'BSIT' : 'BSACT'}</span></td>
                <td>Year ${s.year}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-weight:600;">${s.enrolled}/${s.cap}</span>
                        <div style="flex:1;height:5px;background:var(--bg-dk);border-radius:99px;overflow:hidden;max-width:60px;">
                            <div style="height:100%;width:${pct}%;background:${fillC};border-radius:99px;"></div>
                        </div>
                        <span style="font-size:11px;color:var(--muted);">${pct}%</span>
                    </div>
                </td>
                <td>${s.cap}</td>
                <td style="font-size:12.5px;">${s.adviser}</td>
                <td><span class="badge badge-green">${s.status}</span></td>
                <td>
                    <button class="sec-detail-btn edit"
                        onclick="openSectionDetail('${s.id}')">Open</button>
                </td>
            </tr>`;
        }).join('');
}

// ─────────────────────────────────────────────────
// ROOMS CARDS + SCHEDULE
// ─────────────────────────────────────────────────
function renderRoomsTable() { renderRoomsCards(); } // alias for legacy calls

function renderRoomsCards() {
    const q    = (document.getElementById('roomSearch')?.value || '').toLowerCase();
    const type = document.getElementById('roomTypeFilter')?.value || '';
    const { roomConflicts } = detectConflicts();

    const conflictRooms = new Set(
        ASSIGNMENTS.filter(a => roomConflicts.has(a.id)).map(a => a.room)
    );

    const filtered = ROOMS_LIST.filter(r =>
        (!q    || r.code.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)) &&
        (!type || r.type === type)
    );

    document.getElementById('roomCount').textContent = `${filtered.length} rooms`;

    const typeIcon = { 'Computer Lab':'🖥️', 'Classroom':'🏫', 'Gym':'🏃' };

    document.getElementById('roomCardsGrid').innerHTML =
        `<div class="room-cards-grid">` +
        (filtered.length === 0
            ? `<div class="empty-state" style="grid-column:1/-1;"><p>No rooms match your filters.</p></div>`
            : filtered.map(r => {
                const sessions = ASSIGNMENTS.filter(a => a.room === r.code).length;
                const hasC = conflictRooms.has(r.code);
                return `
                <div class="room-card${hasC?' has-conflict':''}" onclick="openRoomSchedule('${r.code}')">
                    <div class="room-card-name">${r.code}</div>
                    <div class="room-card-type">${typeIcon[r.type]||'📍'} ${r.type}</div>
                    <div class="room-card-meta">
                        <span>Capacity: <strong>${r.cap}</strong></span>
                        <span class="room-card-sessions">${sessions} session${sessions!==1?'s':''}</span>
                    </div>
                    ${hasC ? `<div class="room-card-conflict">⚠ Conflict</div>` : ''}
                </div>`;
            }).join('')) +
        `</div>`;
}

function openRoomSchedule(roomCode) {
    const room = ROOMS_LIST.find(r => r.code === roomCode);
    if (!room) return;

    document.getElementById('roomSchedModalTitle').textContent = roomCode + ' — Weekly Schedule';
    document.getElementById('roomSchedModalMeta').textContent =
        `${room.type} · Capacity ${room.cap} · Dept: ${room.dept}`;

    // Build time slots: 7:00 AM to 7:00 PM in 30-min increments
    const slots = [];
    for (let h = 7; h < 19; h++) {
        slots.push({ label: fmt12(h, 0), startMin: h*60 });
        slots.push({ label: fmt12(h, 30), startMin: h*60+30 });
    }

    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const dayKeys = { Monday:['M','MWF','Daily'], Tuesday:['T','TTh','Daily'],
        Wednesday:['W','MWF','Daily'], Thursday:['Th','TTh','Daily'],
        Friday:['F','MWF','Daily'], Saturday:['Sat'], Sunday:[] };

    // Build schedule map: for each day, list of assignments
    const roomAssignments = ASSIGNMENTS.filter(a => a.room === roomCode);
    const { roomConflicts } = detectConflicts();

    function assignmentCoversSlot(a, dayKey, slotStart) {
        const expanded = expandDays(a.days);
        if (!expanded.includes(dayKey)) return false;
        const t = parseTime(a.time);
        if (!t) return false;
        return slotStart >= t.start && slotStart < t.end;
    }

    function expandDays(d) {
        if (d === 'MWF') return ['M','W','F'];
        if (d === 'TTh') return ['T','Th'];
        if (d === 'Daily') return ['M','T','W','Th','F'];
        if (d === 'Sat') return ['Sat'];
        return [d];
    }

    // Map day names to day key abbreviations
    const dayAbbr = {
        Monday:'M', Tuesday:'T', Wednesday:'W', Thursday:'Th',
        Friday:'F', Saturday:'Sat', Sunday:'Sun'
    };

    // Build table HTML
    let html = '<thead><tr><th>Time</th>';
    days.forEach(d => { html += `<th>${d}</th>`; });
    html += '</tr></thead><tbody>';

    slots.forEach(slot => {
        html += `<tr><td>${slot.label}</td>`;
        days.forEach(day => {
            const abbr = dayAbbr[day];
            const match = roomAssignments.find(a => assignmentCoversSlot(a, abbr, slot.startMin));
            if (match) {
                const hasC = roomConflicts.has(match.id);
                const t = parseTime(match.time);
                // Only show at the start slot
                const isStart = t && slot.startMin === t.start;
                if (isStart) {
                    html += `<td><div class="sched-cell${hasC?' conflict':''}">
                        <span class="sched-cell-code">${match.code}</span>
                        <span class="sched-cell-sec">${match.section}</span>
                    </div></td>`;
                } else {
                    html += `<td style="background:var(--cr-pale);opacity:.35;"></td>`;
                }
            } else {
                html += `<td></td>`;
            }
        });
        html += '</tr>';
    });

    html += '</tbody>';
    document.getElementById('roomSchedTable').innerHTML = html;
    openModal('roomScheduleModal');
}

function fmt12(h, m) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh   = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${hh}:${String(m).padStart(2,'0')} ${ampm}`;
}

// ─────────────────────────────────────────────────
// APPROVALS
// ─────────────────────────────────────────────────
function renderApprovals() {
    const q    = (document.getElementById('approvalSearch')?.value || '').toLowerCase();
    const type = document.getElementById('approvalTypeFilter')?.value || '';

    const filtered = APPROVAL_REQUESTS.filter(r =>
        (!q    || r.student.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q)) &&
        (!type || r.type === type)
    );

    document.getElementById('approvalCount').textContent = `${filtered.length} requests`;

    const typeLabelMap = { add_drop:'Add/Drop', section:'Section', override:'Override', special:'Special' };
    const typeBadgeMap = { add_drop:'badge-blue', section:'badge-green', override:'badge-amber', special:'badge-purple' };
    const statusBadge  = { pending:'badge-amber', forwarded:'badge-blue', approved:'badge-green', rejected:'badge-red' };

    document.getElementById('approvalsList').innerHTML = filtered.length === 0
        ? `<div class="empty-state" style="margin:0;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>No requests match your filters.</p></div>`
        : filtered.map(r => `
        <div class="approval-item" style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:10px;flex-direction:column;">
            <div style="display:flex;align-items:flex-start;gap:12px;width:100%;">
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
                        <span class="badge ${typeBadgeMap[r.type]||'badge-gray'}">${typeLabelMap[r.type]||r.type}</span>
                        <strong style="font-size:13.5px;">${r.student}</strong>
                        <span style="font-size:11.5px;color:var(--muted);">${r.studentId}</span>
                    </div>
                    <div style="font-size:13px;color:var(--text-soft);margin-bottom:4px;">${r.detail}</div>
                    <div style="font-size:11.5px;color:var(--muted-lt);">Submitted ${r.submitted}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
                    <span class="badge ${statusBadge[r.status]||'badge-gray'}">${r.status}</span>
                    ${r.status === 'pending' ? `
                    <div style="display:flex;gap:6px;">
                        <button class="btn btn-ghost btn-xs" onclick="toggleApprovalFeedback(${r.id},'reject')">Reject</button>
                        <button class="btn btn-cr btn-xs" onclick="approvalAction(${r.id},'forwarded')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Accept &amp; Forward
                        </button>
                    </div>` : ''}
                </div>
            </div>
            ${r.status === 'pending' ? `
            <div class="approval-feedback-area" id="feedback-area-${r.id}">
                <div class="approval-feedback-label">Rejection Reason / Feedback</div>
                <textarea id="feedback-text-${r.id}" placeholder="Enter reason for rejection or adjustment note…"></textarea>
                <div class="approval-feedback-btns">
                    <button class="btn btn-ghost btn-xs" onclick="toggleApprovalFeedback(${r.id},'reject')">Cancel</button>
                    <button class="btn btn-danger btn-xs" onclick="approvalAction(${r.id},'rejected')">
                        Confirm Rejection
                    </button>
                </div>
            </div>` : r.feedback ? `
            <div style="margin-top:8px;padding:8px 10px;background:var(--red-pale);border:1px solid var(--red-b);border-radius:6px;font-size:12px;color:var(--red);">
                <strong>Rejection reason:</strong> ${r.feedback}
            </div>` : ''}
        </div>`).join('');
}

function toggleApprovalFeedback(id, action) {
    const area = document.getElementById(`feedback-area-${id}`);
    if (!area) return;
    area.classList.toggle('open');
}

function approvalAction(id, action) {
    const r = APPROVAL_REQUESTS.find(x => x.id === id);
    if (!r) return;
    if (action === 'rejected') {
        const feedbackEl = document.getElementById(`feedback-text-${id}`);
        r.feedback = feedbackEl?.value.trim() || '';
    }
    r.status = action;
    const msg = action === 'forwarded'
        ? `✓ ${r.student}'s request accepted and forwarded to Registrar.`
        : `${r.student}'s request rejected.${r.feedback ? ' Feedback recorded.' : ''}`;
    showToast(msg, action === 'forwarded' ? 'success' : 'warning');
    addChangeLog(`${typeLabelMap[r.type]||r.type} request ${action} — ${r.student}`, action === 'forwarded' ? 'blue' : 'cr');
    renderApprovals();
    document.getElementById('kpi-pending').textContent =
        APPROVAL_REQUESTS.filter(x => x.status === 'pending').length;
    document.getElementById('badge-approvals').textContent =
        APPROVAL_REQUESTS.filter(x => x.status === 'pending').length;
}
const typeLabelMap = { add_drop:'Add/Drop', section:'Section', override:'Override', special:'Special' };

// ─────────────────────────────────────────────────
// PROSPECTUS
// ─────────────────────────────────────────────────
function renderProspectus() {
    // Chain
    const chainEl = document.getElementById('prospectusChain');
    if (chainEl) {
        chainEl.innerHTML = PROSPECTUS_CHAIN.map((s, i) => `
        <div class="chain-step">
            <div class="chain-step-dot ${s.status}">
                ${s.status === 'done' ? '✓' : s.status === 'returned' ? '↩' : i + 1}
            </div>
            <div>
                <div class="chain-step-label">${s.role}</div>
                <div class="chain-step-sub">${s.name}${s.note ? ' · ' + s.note : ''}</div>
            </div>
        </div>`).join('');
    }

    // Versions table
    const statusBadge = { draft:'badge-gray', returned:'badge-red', endorsed:'badge-green', archived:'badge-amber' };
    const tbody = document.getElementById('prospectusVersions');
    if (tbody) {
        tbody.innerHTML = PROSPECTUS_VERSIONS.map(v => `
        <tr class="${v.status === 'returned' ? 'correction-row' : ''}">
            <td><strong>${v.version}</strong></td>
            <td><span class="badge badge-gray">${v.program}</span></td>
            <td>${v.changes} change${v.changes !== 1 ? 's' : ''}</td>
            <td><span class="badge ${statusBadge[v.status]||'badge-gray'}">${v.status}</span></td>
            <td style="font-size:12px;color:var(--muted);">${v.date}</td>
            <td>
                <div style="display:flex;gap:5px;">
                    <button class="btn btn-ghost btn-xs" onclick="showToast('Opening ${v.version} editor…','info')">Edit</button>
                    ${v.status === 'draft' ? `<button class="btn btn-cr btn-xs" id="btnSubmitProspectus" onclick="submitProspectus()">Submit</button>` : ''}
                </div>
            </td>
        </tr>`).join('');
    }
}

function submitProspectus() {
    if (!REGISTRAR_SUBMISSIONS_OPEN) { showToast('Submissions are locked by the Registrar.', 'error'); return; }
    showToast('Prospectus submitted to Dean for review.', 'success');
    addChangeLog('Prospectus submitted to Dean', 'green');
    PROSPECTUS_VERSIONS[0].status = 'pending_dean';
    renderProspectus();
}

function submitForApproval() {
    if (!REGISTRAR_SUBMISSIONS_OPEN) { showToast('Submissions are locked by the Registrar.', 'error'); return; }
    const { roomConflicts, instrConflicts } = detectConflicts();
    if (roomConflicts.size > 0 || instrConflicts.size > 0) {
        showToast('Cannot submit — resolve all schedule conflicts first.', 'error');
        return;
    }
    saveDraft();
    showToast('Faculty loading submitted for Dean approval.', 'success');
    addChangeLog('Faculty loads submitted to Dean', 'green');
}

// ─────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────
function renderReports() {
    // Faculty load chart
    document.getElementById('reportFacultyChart').innerHTML =
        FACULTY_LIST.map(f => {
            const units  = getFacultyUnits(f.id);
            const status = getLoadStatus(units, f.maxUnits);
            const pct    = Math.min(100, Math.round(units / f.maxUnits * 100));
            const col    = status === 'Overloaded' ? 'red' : status === 'Underloaded' ? 'amber' : 'green';
            return `
            <div class="bar-row">
                <span class="bar-label">${f.name.split(' ').slice(-1)[0]}, ${f.name.split(' ')[0]}</span>
                <div class="bar-track"><div class="bar-fill ${col}" style="width:${pct}%"></div></div>
                <span class="bar-val">${units}u</span>
            </div>`;
        }).join('');

    // Room utilization (mock — slots used / total available)
    const roomUsage = {};
    ASSIGNMENTS.forEach(a => {
        if (a.room) roomUsage[a.room] = (roomUsage[a.room] || 0) + 1;
    });
    document.getElementById('reportRoomChart').innerHTML =
        Object.entries(roomUsage).sort((a,b) => b[1]-a[1]).map(([room, count]) => {
            const maxSlots = 20; // arbitrary weekly slot max
            const pct = Math.min(100, Math.round(count / maxSlots * 100));
            return `
            <div class="bar-row">
                <span class="bar-label">${room}</span>
                <div class="bar-track"><div class="bar-fill blue" style="width:${pct}%"></div></div>
                <span class="bar-val">${count} sessions</span>
            </div>`;
        }).join('');

    // Prospectus version history
    const statusBadge = { draft:'badge-gray', returned:'badge-red', endorsed:'badge-green', archived:'badge-amber', pending_dean:'badge-blue' };
    document.getElementById('reportVersionHistory').innerHTML =
        PROSPECTUS_VERSIONS.map(v => `
        <tr>
            <td><strong>${v.version}</strong></td>
            <td><span class="badge badge-gray">${v.program}</span></td>
            <td>Ms. Clara Santos</td>
            <td style="font-size:12px;color:var(--muted);">${v.date}</td>
            <td><span class="badge ${statusBadge[v.status]||'badge-gray'}">${v.status}</span></td>
            <td style="font-size:12.5px;color:var(--muted);">${v.changes} change${v.changes !== 1 ? 's' : ''}${v.note ? ' · '+v.note : ''}</td>
        </tr>`).join('');
}

// ─────────────────────────────────────────────────
// RESOURCE SIDECAR
// ─────────────────────────────────────────────────
function switchSidecar(type, btn) {
    activeSidecar = type;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('sidecarSearch').value = '';
    renderSidecarContent();
}

function filterSidecar() { renderSidecarContent(); }

function renderSidecarContent() {
    const q   = (document.getElementById('sidecarSearch')?.value || '').toLowerCase();
    const cnt = document.getElementById('sidecarContent');
    if (!cnt) return;

    if (activeSidecar === 'faculty') {
        const filtered = FACULTY_LIST.filter(f => !q || f.name.toLowerCase().includes(q));
        cnt.innerHTML = filtered.map(f => {
            const units  = getFacultyUnits(f.id);
            const status = getLoadStatus(units, f.maxUnits);
            const dotC   = status === 'Overloaded' ? 'var(--red)' : status === 'Underloaded' ? 'var(--amber)' : 'var(--green)';
            const active = selectedFacultyId === f.id;
            return `
            <div class="resource-item ${active ? 'active' : ''}" onclick="selectFacultySidecar(${f.id})"
                 style="${active ? 'background:var(--crimson-light);border-color:var(--crimson);' : ''}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                    <div style="width:8px;height:8px;border-radius:50%;background:${dotC};flex-shrink:0;"></div>
                    <div class="res-name">${f.name}</div>
                </div>
                <div class="res-meta">${f.position} · ${units}/${f.maxUnits} units</div>
            </div>`;
        }).join('') || '<div style="padding:12px;font-size:12.5px;color:var(--muted-lt);">No faculty found.</div>';

    } else if (activeSidecar === 'rooms') {
        const filtered = ROOMS_LIST.filter(r => !q || r.code.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
        cnt.innerHTML = filtered.map(r => {
            const used = ASSIGNMENTS.filter(a => a.room === r.code).length;
            return `
            <div class="resource-item" onclick="document.getElementById('assignRoom')&&(document.getElementById('assignRoom').value='${r.code}')">
                <div class="res-name">${r.code}</div>
                <div class="res-meta">${r.type} · Cap ${r.cap} · ${used} session${used!==1?'s':''}</div>
            </div>`;
        }).join('') || '<div style="padding:12px;font-size:12.5px;color:var(--muted-lt);">No rooms found.</div>';

    } else if (activeSidecar === 'courses') {
        const filtered = SUBJECTS.filter(s => !q || s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q));
        cnt.innerHTML = filtered.map(s => `
            <div class="resource-item"
                 onclick="document.getElementById('assignSubject')&&(document.getElementById('assignSubject').value='${s.code}')">
                <div class="res-name">${s.code} <span style="font-weight:400;color:var(--muted);">(${s.units}u)</span></div>
                <div class="res-meta">${s.title} · ${s.program} Yr ${s.year}</div>
            </div>`).join('') || '<div style="padding:12px;font-size:12.5px;color:var(--muted-lt);">No subjects found.</div>';
    }
}

function selectFacultySidecar(id) {
    selectedFacultyId = id;
    const sel = document.getElementById('assignFaculty');
    if (sel) { sel.value = id; updateUnitCounter(); }
    else {
        // Reflect unit count even without the modal open
        const f = FACULTY_LIST.find(x => x.id === id);
        if (!f) return;
        const units  = getFacultyUnits(id);
        const status = getLoadStatus(units, f.maxUnits);
        const pct    = Math.min(100, Math.round(units / f.maxUnits * 100));
        document.getElementById('unitVal').textContent   = `${units} / ${f.maxUnits}`;
        const limitEl = document.getElementById('unitLimit');
        limitEl.textContent = `${status} — ${f.position}`;
        limitEl.className   = `unit-limit ${status === 'Overloaded' ? 'overload' : status === 'Underloaded' ? 'underload' : ''}`;
        const fill = document.getElementById('unitStatusFill');
        fill.style.width      = `${pct}%`;
        fill.style.background = status === 'Overloaded' ? 'var(--red)' : status === 'Underloaded' ? 'var(--amber)' : 'var(--green)';
    }
    renderSidecarContent();
}

// ─────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).classList.add('open');

    // Populate selects when opening Add Assignment
    if (id === 'addAssignmentModal') {
        const fSel = document.getElementById('assignFaculty');
        fSel.innerHTML = '<option value="">— Select Faculty —</option>' +
            FACULTY_LIST.map(f => `<option value="${f.id}">${f.name} (${getFacultyUnits(f.id)}/${f.maxUnits}u)</option>`).join('');
        if (selectedFacultyId) { fSel.value = selectedFacultyId; updateUnitCounter(); }

        const sSel = document.getElementById('assignSubject');
        sSel.innerHTML = '<option value="">— Select Subject —</option>' +
            SUBJECTS.map(s => `<option value="${s.code}" data-units="${s.units}" data-title="${s.title}">${s.code} — ${s.title} (${s.units}u)</option>`).join('');

        // Room datalist
        document.getElementById('roomList').innerHTML =
            ROOMS_LIST.map(r => `<option value="${r.code}"></option>`).join('');
    }

    // Populate adviser select for Add Section
    if (id === 'addSectionModal') {
        document.getElementById('newSectionAdviser').innerHTML =
            '<option value="">— Assign Later —</option>' +
            FACULTY_LIST.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
    }
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function confirmAddAssignment() {
    const facultyId = parseInt(document.getElementById('assignFaculty').value);
    const subSel    = document.getElementById('assignSubject');
    const code      = subSel?.value;
    const section   = document.getElementById('assignSection').value;
    const days      = document.getElementById('assignDays').value;
    const time      = document.getElementById('assignTime').value.trim();
    const room      = document.getElementById('assignRoom').value.trim();

    if (!facultyId || !code || !section || !days || !time) {
        showToast('Please fill in all required fields.', 'error'); return;
    }

    const selected = subSel.options[subSel.selectedIndex];
    const units    = parseInt(selected.dataset.units) || 3;
    const title    = selected.dataset.title || code;

    const newA = { id: nextAssignmentId++, facultyId, code, title, section, days, time, room, units };
    ASSIGNMENTS.push(newA);
    markUnsaved();
    renderFacultyTable();
    renderSidecarContent();
    checkConflictPreview();
    const f = FACULTY_LIST.find(x => x.id === facultyId);
    showToast(`${code} assigned to ${f?.name || 'faculty'}.`, 'success');
    addChangeLog(`${code} assigned to ${f?.name || 'faculty'}`, 'green');
    closeModal('addAssignmentModal');
}

// Section roster rows being built (before committing)
let _rosterRows = [];

function proceedToRoster() {
    const prog   = document.getElementById('newSectionProgram').value;
    const year   = document.getElementById('newSectionYear').value;
    const letter = document.getElementById('newSectionLetter').value.trim().toUpperCase();
    const cap    = parseInt(document.getElementById('newSectionCap').value) || 40;

    if (!letter) { showToast('Please enter a section letter.', 'error'); return; }
    const prefix = prog === 'CS' ? 'BSCS' : prog === 'IT' ? 'BSIT' : 'BSACT';
    const sectionId = `${prefix}-${year}${letter}`;
    if (SECTIONS.find(s => s.id === sectionId)) {
        showToast(`Section ${sectionId} already exists.`, 'error'); return;
    }

    _rosterRows = [];
    document.getElementById('rosterSectionLabel').textContent = sectionId;
    document.getElementById('rosterCapLabel').textContent = cap;
    document.getElementById('rosterEnrolledCount').textContent = '0';
    document.getElementById('rosterTableBody').innerHTML = '';

    // Grey out Add Student if already at capacity
    updateRosterAddBtn(cap);

    document.getElementById('sectionStep1').style.display = 'none';
    document.getElementById('sectionStep2').style.display = 'block';
    document.getElementById('sectionFooter1').style.display = 'none';
    document.getElementById('sectionFooter2').style.display = 'flex';
}

function backToSectionStep1() {
    document.getElementById('sectionStep1').style.display = 'block';
    document.getElementById('sectionStep2').style.display = 'none';
    document.getElementById('sectionFooter1').style.display = 'flex';
    document.getElementById('sectionFooter2').style.display = 'none';
}

function updateRosterAddBtn(cap) {
    const btn = document.getElementById('btnAddStudentToSection');
    const full = _rosterRows.length >= cap;
    btn.disabled = full;
    btn.style.opacity = full ? '.4' : '1';
    btn.style.cursor  = full ? 'not-allowed' : 'pointer';
    document.getElementById('rosterEnrolledCount').textContent = _rosterRows.length;
}

function addRosterRow() {
    const cap = parseInt(document.getElementById('rosterCapLabel').textContent) || 40;
    if (_rosterRows.length >= cap) { showToast('Section is at full capacity.', 'warning'); return; }

    const rowIdx = _rosterRows.length;
    _rosterRows.push({ id: '', name: '' });

    const tbody = document.getElementById('rosterTableBody');
    const tr = document.createElement('tr');
    tr.id = `rosterRow-${rowIdx}`;
    tr.innerHTML = `
        <td style="text-align:center;font-weight:700;color:var(--muted-lt);font-size:12px;">${rowIdx + 1}</td>
        <td>
            <input class="roster-input id-input" type="text" placeholder="e.g. 2024-00001"
                oninput="onRosterIdInput(this, ${rowIdx})"
                onblur="onRosterIdBlur(this, ${rowIdx})" />
        </td>
        <td>
            <input class="roster-input name-input" type="text" placeholder="Auto-filled from ID"
                id="rosterName-${rowIdx}" readonly style="background:#f9fafb;color:#555;" />
        </td>
        <td style="text-align:center;">
            <button class="roster-del-btn" onclick="removeRosterRow(${rowIdx})">✕</button>
        </td>`;
    tbody.appendChild(tr);
    updateRosterAddBtn(cap);
}

function onRosterIdInput(input, idx) {
    _rosterRows[idx].id = input.value.trim();
}

function onRosterIdBlur(input, idx) {
    const id = input.value.trim();
    const nameEl = document.getElementById(`rosterName-${idx}`);
    if (!id) { nameEl.value = ''; return; }

    // Look up from STUDENT_DB if available, else from SECTIONS student mock
    let found = null;
    if (typeof STUDENT_DB !== 'undefined') {
        found = STUDENT_DB.find(s => s.studentId === id);
    }
    if (found) {
        nameEl.value = `${found.lastName}, ${found.firstName} ${found.middleInitial}.`;
        _rosterRows[idx].name = nameEl.value;
    } else {
        nameEl.value = '— Not found —';
        _rosterRows[idx].name = '';
    }
}

function removeRosterRow(idx) {
    _rosterRows.splice(idx, 1);
    rebuildRosterTable();
}

function rebuildRosterTable() {
    const cap = parseInt(document.getElementById('rosterCapLabel').textContent) || 40;
    const tbody = document.getElementById('rosterTableBody');
    tbody.innerHTML = '';
    _rosterRows.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.id = `rosterRow-${i}`;
        tr.innerHTML = `
            <td style="text-align:center;font-weight:700;color:var(--muted-lt);font-size:12px;">${i + 1}</td>
            <td>
                <input class="roster-input id-input" type="text" value="${row.id}"
                    placeholder="e.g. 2024-00001"
                    oninput="onRosterIdInput(this, ${i})"
                    onblur="onRosterIdBlur(this, ${i})" />
            </td>
            <td>
                <input class="roster-input name-input" type="text" value="${row.name}"
                    id="rosterName-${i}" readonly style="background:#f9fafb;color:#555;" />
            </td>
            <td style="text-align:center;">
                <button class="roster-del-btn" onclick="removeRosterRow(${i})">✕</button>
            </td>`;
        tbody.appendChild(tr);
    });
    updateRosterAddBtn(cap);
}

function confirmAddSection() {
    const prog   = document.getElementById('newSectionProgram').value;
    const year   = document.getElementById('newSectionYear').value;
    const letter = document.getElementById('newSectionLetter').value.trim().toUpperCase();
    const cap    = parseInt(document.getElementById('newSectionCap').value) || 40;
    const advId  = parseInt(document.getElementById('newSectionAdviser').value) || null;
    const f      = FACULTY_LIST.find(x => x.id === advId);
    const prefix = prog === 'CS' ? 'BSCS' : prog === 'IT' ? 'BSIT' : 'BSACT';
    const id     = `${prefix}-${year}${letter}`;

    const enrolled = _rosterRows.filter(r => r.id).length;
    // Store roster on the section for the Open view
    SECTIONS.push({ id, program:prog, year:parseInt(year), enrolled, cap, adviser: f?.name || 'TBA', status:'Active', students: _rosterRows.filter(r => r.id) });
    markUnsaved();
    renderSectionsTable();
    showToast(`Section ${id} created with ${enrolled} student(s).`, 'success');
    addChangeLog(`Section ${id} created`, 'blue');
    closeModal('addSectionModal');
    // Reset modal state
    document.getElementById('sectionStep1').style.display = 'block';
    document.getElementById('sectionStep2').style.display = 'none';
    document.getElementById('sectionFooter1').style.display = 'flex';
    document.getElementById('sectionFooter2').style.display = 'none';
    _rosterRows = [];
}

// ─── SECTION DETAIL (Open button) ───────────────────────────
let _openSectionId = null;

// Mock student lists per section (attached when section is created, or seeded here)
function getSectionStudents(sectionId) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (sec && sec.students) return sec.students;
    // Seed mock data for existing sections
    if (!sec._seeded) {
        const count = sec ? Math.min(sec.enrolled, 5) : 0;
        const mock  = [];
        for (let i = 0; i < count; i++) {
            const idx = (sectionId.charCodeAt(0) + i) % (typeof STUDENT_DB !== 'undefined' ? STUDENT_DB.length : 1);
            const s = typeof STUDENT_DB !== 'undefined' ? STUDENT_DB[idx] : null;
            mock.push(s
                ? { id: s.studentId, name: `${s.lastName}, ${s.firstName} ${s.middleInitial}.`, program: s.program }
                : { id: `2024-0000${i+1}`, name: 'Student Name', program: sec?.program || 'CS' });
        }
        if (sec) { sec.students = mock; sec._seeded = true; }
        return mock;
    }
    return sec?.students || [];
}

function openSectionDetail(sectionId) {
    _openSectionId = sectionId;
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return;

    document.getElementById('sectionDetailTitle').textContent = sectionId;
    document.getElementById('sectionDetailMeta').textContent =
        `${sec.program === 'CS' ? 'BSCS' : sec.program === 'IT' ? 'BSIT' : 'BSACT'} · Year ${sec.year} · Adviser: ${sec.adviser}`;

    renderSectionDetailBody(sec);
    openModal('sectionDetailModal');
}

function renderSectionDetailBody(sec) {
    const students = getSectionStudents(sec.id);
    const pct      = Math.min(100, Math.round(students.length / sec.cap * 100));
    const fillC    = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--green)';

    document.getElementById('detailEnrolled').textContent = students.length;
    document.getElementById('detailCap').textContent = sec.cap;
    document.getElementById('detailCapBar').style.width      = `${pct}%`;
    document.getElementById('detailCapBar').style.background = fillC;

    // Grey Add Student if at capacity
    const addBtn = document.getElementById('btnDetailAddStudent');
    const full   = students.length >= sec.cap;
    addBtn.disabled    = full;
    addBtn.style.opacity = full ? '.4' : '1';
    addBtn.style.cursor  = full ? 'not-allowed' : 'pointer';
    if (full) addBtn.title = 'Section is at full capacity.';

    document.getElementById('sectionDetailBody').innerHTML = students.length === 0
        ? `<tr><td colspan="5"><div class="empty-state"><p>No students enrolled in this section.</p></div></td></tr>`
        : students.map((st, i) => `
        <tr>
            <td style="text-align:center;font-size:12px;color:var(--muted-lt);font-weight:700;">${i + 1}</td>
            <td class="mono" style="font-size:12px;">${st.id}</td>
            <td style="font-size:13px;font-weight:500;">${st.name}</td>
            <td><span class="badge badge-gray" style="font-size:10.5px;">${st.program === 'CS' ? 'BSCS' : st.program === 'IT' ? 'BSIT' : 'BSACT'}</span></td>
            <td style="text-align:center;">
                <div style="display:flex;gap:5px;justify-content:center;">
                    <button class="sec-detail-btn edit"   onclick="editSectionStudent('${sec.id}',${i})">Edit</button>
                    <button class="sec-detail-btn remove" onclick="removeSectionStudent('${sec.id}',${i})">Remove</button>
                </div>
            </td>
        </tr>`).join('');
}

function removeSectionStudent(sectionId, idx) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec || !sec.students) return;
    const name = sec.students[idx]?.name || 'Student';
    sec.students.splice(idx, 1);
    sec.enrolled = sec.students.length;
    renderSectionDetailBody(sec);
    renderSectionsTable();
    markUnsaved();
    showToast(`${name} removed from ${sectionId}.`, 'warning');
    addChangeLog(`Student removed from ${sectionId}`, 'cr');
}

function editSectionStudent(sectionId, idx) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec || !sec.students) return;
    const st  = sec.students[idx];
    const row = document.getElementById('sectionDetailBody').querySelectorAll('tr')[idx];
    if (!row) return;
    row.cells[1].innerHTML = `<input class="roster-input id-input" value="${st.id}" id="editId-${idx}" style="width:120px;" />`;
    row.cells[2].innerHTML = `<input class="roster-input" value="${st.name}" id="editName-${idx}" style="width:100%;" />`;
    row.cells[4].innerHTML = `<div style="display:flex;gap:5px;justify-content:center;">
        <button class="sec-detail-btn edit" onclick="saveEditStudent('${sectionId}',${idx})">Save</button>
        <button class="sec-detail-btn remove" onclick="renderSectionDetailBody(SECTIONS.find(s=>s.id==='${sectionId}'))">Cancel</button>
    </div>`;
}

function saveEditStudent(sectionId, idx) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return;
    sec.students[idx].id   = document.getElementById(`editId-${idx}`)?.value.trim() || sec.students[idx].id;
    sec.students[idx].name = document.getElementById(`editName-${idx}`)?.value.trim() || sec.students[idx].name;
    renderSectionDetailBody(sec);
    markUnsaved();
    showToast('Student record updated.', 'success');
}

function addStudentToSection() {
    const sec = SECTIONS.find(s => s.id === _openSectionId);
    if (!sec) return;
    if (sec.students.length >= sec.cap) { showToast('Section is at full capacity.', 'warning'); return; }

    // Append an empty editable row at the bottom
    const idx = sec.students.length;
    sec.students.push({ id: '', name: '', program: sec.program });
    sec.enrolled = sec.students.length;

    renderSectionDetailBody(sec);
    // Immediately put last row into edit mode
    editSectionStudent(_openSectionId, idx);
    renderSectionsTable();
}

// ─── PROSPECTUS BUILDER ─────────────────────────────────────
let _prospData = {}; // { program, effStart, effEnd, notes, years: { 1: [{code,name,units,requisite}], 2:[], ... } }
let _activeProspYear = null;

function onProspProgramChange() {
    checkProspContinue();
}

function checkProspContinue() {
    const prog = document.getElementById('ppProgram').value;
    const eff  = document.getElementById('ppEffStart').value.trim();
    const btn  = document.getElementById('btnProspContinue');
    const ready = prog && eff;
    btn.disabled = !ready;
    btn.style.opacity = ready ? '1' : '.4';
    btn.style.cursor  = ready ? 'pointer' : 'not-allowed';
}

function proceedToProspectusBuilder() {
    const prog     = document.getElementById('ppProgram').value;
    const effStart = document.getElementById('ppEffStart').value.trim();
    const effEnd   = document.getElementById('ppEffEnd').value.trim();
    const notes    = document.getElementById('ppNotes').value.trim();

    if (!prog || !effStart) { showToast('Please fill in Program and Effectivity Start.', 'error'); return; }

    // Year range: BSACT only has 2 years
    const maxYear = prog === 'BSACT' ? 2 : 4;
    _prospData = { program: prog, effStart, effEnd, notes, years: {} };
    for (let y = 1; y <= maxYear; y++) _prospData.years[y] = [];
    _activeProspYear = 1;

    // Summary bar
    document.getElementById('prospSummaryProgram').textContent = prog;
    document.getElementById('prospSummaryEff').textContent     = effEnd ? `${effStart} to ${effEnd}` : effStart;

    // Build year tabs
    const tabsEl = document.getElementById('prospYearTabs');
    tabsEl.innerHTML = '';
    for (let y = 1; y <= maxYear; y++) {
        const btn = document.createElement('button');
        btn.className = `prosp-year-tab${y === 1 ? ' active' : ''}`;
        btn.textContent = `Year ${y}`;
        btn.onclick = () => switchProspYear(y);
        btn.id = `prospTab-${y}`;
        tabsEl.appendChild(btn);
    }

    // Build year blocks (empty, one per year)
    const blocksEl = document.getElementById('prospYearBlocks');
    blocksEl.innerHTML = '';
    for (let y = 1; y <= maxYear; y++) {
        const div = document.createElement('div');
        div.className = `prosp-year-block${y === 1 ? ' active' : ''}`;
        div.id = `prospBlock-${y}`;
        div.innerHTML = `
            <div class="prosp-block-hd">
                <span class="prosp-block-hd-title">Year ${y}</span>
                <span style="font-size:11.5px;color:var(--muted);font-weight:500;" id="prospRowCount-${y}">0 subjects</span>
            </div>
            <table class="prosp-table">
                <thead><tr>
                    <th style="width:140px;">Subject Code</th>
                    <th>Subject Name</th>
                    <th style="width:80px;text-align:center;">Units</th>
                    <th style="width:200px;">Requisite Subject</th>
                    <th style="width:42px;"></th>
                </tr></thead>
                <tbody id="prospTbody-${y}"></tbody>
            </table>
            <button class="prosp-add-row-btn" onclick="addProspRow(${y})">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Subject
            </button>`;
        blocksEl.appendChild(div);
    }

    // Show step 2
    document.getElementById('prospStep1').style.display  = 'none';
    document.getElementById('prospStep2').style.display  = 'block';
    document.getElementById('prospFooter1').style.display = 'none';
    document.getElementById('prospFooter2').style.display = 'flex';
}

function switchProspYear(year) {
    _activeProspYear = year;
    document.querySelectorAll('.prosp-year-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prosp-year-block').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById(`prospTab-${year}`);
    const blk = document.getElementById(`prospBlock-${year}`);
    if (tab) tab.classList.add('active');
    if (blk) blk.classList.add('active');
}

function addProspRow(year) {
    const tbody = document.getElementById(`prospTbody-${year}`);
    const idx   = _prospData.years[year].length;
    _prospData.years[year].push({ code:'', name:'', units:'', requisite:'' });

    const tr = document.createElement('tr');
    tr.id = `prow-${year}-${idx}`;
    tr.innerHTML = `
        <td><input class="prosp-input code-input" placeholder="e.g. CC101 (Lec)"
            oninput="_prospData.years[${year}][${idx}].code=this.value" /></td>
        <td><input class="prosp-input" placeholder="e.g. Computer Programming 1 (Lec)" style="width:100%;"
            oninput="_prospData.years[${year}][${idx}].name=this.value" /></td>
        <td><input class="prosp-input units-input" type="number" placeholder="e.g. 2" min="0" max="9" step="0.25"
            oninput="_prospData.years[${year}][${idx}].units=this.value" /></td>
        <td><input class="prosp-input" placeholder="e.g. CC102 (Lec) or —" style="width:100%;"
            oninput="_prospData.years[${year}][${idx}].requisite=this.value" /></td>
        <td style="text-align:center;">
            <button class="prosp-del-btn" onclick="deleteProspRow(${year},${idx})" title="Remove row">✕</button>
        </td>`;
    tbody.appendChild(tr);
    updateProspRowCount(year);
}

function deleteProspRow(year, idx) {
    _prospData.years[year].splice(idx, 1);
    rebuildProspTable(year);
}

function rebuildProspTable(year) {
    const tbody = document.getElementById(`prospTbody-${year}`);
    tbody.innerHTML = '';
    const rows = _prospData.years[year];
    rows.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.id = `prow-${year}-${idx}`;
        tr.innerHTML = `
            <td><input class="prosp-input code-input" value="${row.code}" placeholder="e.g. CC101 (Lec)"
                oninput="_prospData.years[${year}][${idx}].code=this.value" /></td>
            <td><input class="prosp-input" value="${row.name}" placeholder="e.g. Computer Programming 1 (Lec)" style="width:100%;"
                oninput="_prospData.years[${year}][${idx}].name=this.value" /></td>
            <td><input class="prosp-input units-input" type="number" value="${row.units}" placeholder="2" min="0" max="9" step="0.25"
                oninput="_prospData.years[${year}][${idx}].units=this.value" /></td>
            <td><input class="prosp-input" value="${row.requisite}" placeholder="e.g. CC102 (Lec) or —" style="width:100%;"
                oninput="_prospData.years[${year}][${idx}].requisite=this.value" /></td>
            <td style="text-align:center;">
                <button class="prosp-del-btn" onclick="deleteProspRow(${year},${idx})" title="Remove row">✕</button>
            </td>`;
        tbody.appendChild(tr);
    });
    updateProspRowCount(year);
}

function updateProspRowCount(year) {
    const el = document.getElementById(`prospRowCount-${year}`);
    const n  = _prospData.years[year]?.length || 0;
    if (el) el.textContent = `${n} subject${n !== 1 ? 's' : ''}`;
}

function backToProspStep1() {
    document.getElementById('prospStep1').style.display  = 'block';
    document.getElementById('prospStep2').style.display  = 'none';
    document.getElementById('prospFooter1').style.display = 'flex';
    document.getElementById('prospFooter2').style.display = 'none';
}

function saveProspectusDraft() {
    const totalSubjects = Object.values(_prospData.years).reduce((s, arr) => s + arr.length, 0);
    const label = `${_prospData.program} ${_prospData.effStart}`;
    PROSPECTUS_VERSIONS.unshift({
        version:   label,
        program:   _prospData.program,
        changes:   totalSubjects,
        status:    'draft',
        updatedBy: 'Ms. Clara Santos',
        date:      new Date().toISOString().slice(0, 10),
        note:      _prospData.notes || '',
    });
    markUnsaved();
    renderProspectus();
    showToast(`Prospectus draft saved — ${totalSubjects} subject(s) across ${Object.keys(_prospData.years).length} year(s).`, 'success');
    addChangeLog(`New prospectus draft created: ${label}`, 'green');
    closeNewProspectus();
}

function closeNewProspectus() {
    closeModal('newProspectusModal');
    // Reset state for next open
    setTimeout(() => {
        document.getElementById('prospStep1').style.display  = 'block';
        document.getElementById('prospStep2').style.display  = 'none';
        document.getElementById('prospFooter1').style.display = 'flex';
        document.getElementById('prospFooter2').style.display = 'none';
        document.getElementById('ppProgram').value    = '';
        document.getElementById('ppEffStart').value   = '';
        document.getElementById('ppEffEnd').value     = '';
        document.getElementById('ppNotes').value      = '';
        const btn = document.getElementById('btnProspContinue');
        btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed';
        _prospData = {};
    }, 300);
}

function renderCourseOfferings() {
    const prog = document.getElementById('offeringProgramFilter')?.value || '';
    const yr   = document.getElementById('offeringYearFilter')?.value || '';
    const filtered = SUBJECTS.filter(s =>
        (!prog || s.program === prog) &&
        (!yr   || String(s.year) === yr)
    );
    document.getElementById('courseOfferingsBody').innerHTML = filtered.map(s => `
        <tr>
            <td class="mono">${s.code}</td>
            <td>${s.title}</td>
            <td style="text-align:center;">${s.units}</td>
            <td><span class="badge badge-gray">${s.program}</span></td>
            <td>Year ${s.year}</td>
            <td style="color:var(--muted-lt);font-size:12px;">—</td>
            <td><span class="badge badge-blue">Lecture</span></td>
        </tr>`).join('');
}

// ─────────────────────────────────────────────────
// MODAL BACKDROP / ESC
// ─────────────────────────────────────────────────
document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
});

// ─────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    const typeMap = { success:'success', error:'error', warning:'warning', warn:'warning', info:'' };
    const el = document.createElement('div');
    el.className = `toast ${typeMap[type] || ''}`;
    el.style.background = type === 'info' ? 'var(--blue-lt)' : '';
    el.textContent = msg;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadDraft();           // restore any autosaved state
    applyGuardrail();
    renderDashboard();
    renderFacultyTable();
    renderSectionsTable();
    renderRoomsCards();
    renderApprovals();
    renderProspectus();
    renderReports();
    renderSidecarContent();
    renderCourseOfferings();
});