// =============================================================
// registrar.js — Registrar Portal Script
// =============================================================

// ─── MOCK DATA ────────────────────────────────────────────────
// Replace with a real API fetch when the backend is ready.

// Inline PROSPECTUS_DATA (richer version — dean workflow)
const PROSPECTUS_DATA = [
  {
    id: 'p1', program: 'BS Computer Science', version: '2025–2026', status: 'pending',
    submittedBy: 'Clara Santos (Secretary)', submittedAt: 'May 3, 2026 · 10:14 AM', effectivity: 'Aug 2026',
    changes: [
      { type:'changed', field:'CC 101 — Units', from:'3', to:'4' },
      { type:'added',   field:'CC 105L — Computer Lab 3', from:'', to:'1 unit' },
      { type:'removed', field:'CS Elec 5 — Special Topics', from:'3 units', to:'' },
    ],
    history: [
      { by:'Clara Santos', action:'Initial draft submitted', at:'May 1, 2026 · 9:00 AM' },
      { by:'Clara Santos', action:'Updated CC 101 units: 3 → 4', at:'May 2, 2026 · 2:30 PM' },
      { by:'Clara Santos', action:'Added CC 105L subject', at:'May 3, 2026 · 10:14 AM' },
    ]
  },
  {
    id: 'p2', program: 'BS Information Technology', version: '2025–2026', status: 'pending',
    submittedBy: 'Rosa Alvarez (Secretary)', submittedAt: 'May 4, 2026 · 8:50 AM', effectivity: 'Aug 2026',
    changes: [
      { type:'changed', field:'IT 301 — Description', from:'Web Systems', to:'Web Systems & Technologies' },
      { type:'added',   field:'IT Elec 4 — Cloud Computing', from:'', to:'3 units' },
    ],
    history: [
      { by:'Rosa Alvarez', action:'Initial draft submitted', at:'May 4, 2026 · 8:50 AM' },
    ]
  },
  {
    id: 'p3', program: 'BS Computer Engineering', version: '2025–2026', status: 'endorsed',
    submittedBy: 'Marco Diaz (Secretary)', submittedAt: 'Apr 28, 2026 · 3:00 PM', effectivity: 'Aug 2026',
    changes: [
      { type:'changed', field:'CpE 402 — Units', from:'4', to:'3' },
    ],
    history: [
      { by:'Marco Diaz', action:'Submitted for review', at:'Apr 28, 2026 · 3:00 PM' },
    ]
  },
];

// Dept submissions (used by renderDeptSubmissions)
const SUBMISSIONS_DATA = [
  { id:1, dept:'Computer Science',      college:'CCS', type:'Faculty Loading', submittedBy:'Ms. Clara Santos',  submittedRole:'Secretary', at:'Jan 14, 10:30 AM', items:18, status:'pending'  },
  { id:2, dept:'Information Technology',college:'CCS', type:'Faculty Loading', submittedBy:'Prof. Maria Reyes', submittedRole:'Secretary', at:'Jan 14, 11:00 AM', items:15, status:'pending'  },
  { id:3, dept:'Civil Engineering',     college:'COE', type:'Schedule',        submittedBy:'Engr. Paulo Dizon', submittedRole:'Secretary', at:'Jan 12, 09:00 AM', items:22, status:'approved' },
  { id:4, dept:'Business Administration',college:'CBA',type:'Faculty Loading', submittedBy:'Ms. Rosa Cruz',     submittedRole:'Secretary', at:'Jan 11, 02:15 PM', items:12, status:'approved' },
  { id:5, dept:'Education',             college:'CED', type:'Schedule',        submittedBy:'Mr. Aldo Santos',   submittedRole:'Secretary', at:'Jan 10, 08:45 AM', items:20, status:'returned' },
];

// Students (used by renderStudentRecords + openStudentPanel)
const STUDENTS_DATA = [
  { id:'2021-00001', name:'Juan Dela Cruz',   college:'CCS', year:4, program:'BSCS', units:21, status:'enrolled'  },
  { id:'2022-00145', name:'Maria Santos',     college:'CCS', year:3, program:'BSIT', units:18, status:'enrolled'  },
  { id:'2023-00312', name:'Pedro Reyes',      college:'COE', year:2, program:'BSCE', units:15, status:'pending'   },
  { id:'2021-00087', name:'Ana Gonzales',     college:'CBA', year:4, program:'BSBA', units:21, status:'enrolled'  },
  { id:'2022-00200', name:'Carlo Fernandez',  college:'CED', year:3, program:'BSEd', units:18, status:'irregular' },
  { id:'2023-00450', name:'Liza Mercado',     college:'CCS', year:2, program:'BSCS', units:0,  status:'hold'      },
  { id:'2020-00009', name:'Rodrigo Tan',      college:'CCS', year:5, program:'BSIT', units:12, status:'irregular' },
  { id:'2023-00501', name:'Sofia Villanueva', college:'CAS', year:2, program:'BSED', units:21, status:'enrolled'  },
  { id:'2024-00032', name:'Miguel Torres',    college:'COE', year:1, program:'BSEE', units:24, status:'pending'   },
  { id:'2022-00388', name:'Rachel Aquino',    college:'CBA', year:3, program:'BSA',  units:21, status:'enrolled'  },
];

// Holds (used by openStudentPanel)
const HOLDS_DATA = [
  { id:1, student:'Liza Mercado',    sid:'2023-00450', type:'Financial',      reason:'Unpaid balance ₱12,450',           placedBy:'Registrar', date:'Jan 10, 2025', status:'active' },
  { id:2, student:'Carlo Fernandez', sid:'2022-00200', type:'Library',        reason:'Unreturned books (3 titles)',       placedBy:'Library',   date:'Jan 8, 2025',  status:'active' },
  { id:3, student:'Rodrigo Tan',     sid:'2020-00009', type:'Academic',       reason:'GPA below 2.0 threshold',          placedBy:'Registrar', date:'Jan 5, 2025',  status:'active' },
  { id:4, student:'Pedro Reyes',     sid:'2023-00312', type:'Administrative', reason:'Missing graduation clearance docs', placedBy:'Registrar', date:'Jan 3, 2025',  status:'active' },
  { id:5, student:'Ana Gonzales',    sid:'2021-00087', type:'Financial',      reason:'Cleared — receipt submitted',      placedBy:'Registrar', date:'Dec 20, 2024', status:'lifted' },
];

// Recent activity (used by renderDashboard)
const RECENT_ACTIVITY = [
  { action:'BSIT Curriculum v2025.1 received from CCS Dean', detail:'Endorsed by Dr. Norma Santos',        time:'Today 09:10',   type:'submit'  },
  { action:'BSCS Curriculum v2025.2 received from CCS Dean', detail:'Endorsed by Dr. Norma Santos',        time:'Today 08:42',   type:'submit'  },
  { action:'Civil Engineering schedule approved',             detail:'22 sections approved',                time:'Jan 14 16:02',  type:'approve' },
  { action:'Financial hold placed — Liza Mercado',           detail:'Unpaid balance ₱12,450',              time:'Jan 10 11:00',  type:'warn'    },
  { action:'Education schedule returned for revision',        detail:'Missing room assignments',            time:'Jan 8 09:00',   type:'warn'    },
];

// Oversubscribed sections (used by renderEnrollMonitor)
const OVERSUBSCRIBED = [
  { code:'CS 101',    desc:'Introduction to Computing', section:'A', enrolled:58, cap:45, dept:'CCS' },
  { code:'CS Elec 3', desc:'Machine Learning',           section:'A', enrolled:41, cap:35, dept:'CCS' },
  { code:'IT 101',    desc:'Fundamentals of IT',          section:'B', enrolled:52, cap:45, dept:'CCS' },
  { code:'GE 101',    desc:'Understanding the Self',      section:'C', enrolled:67, cap:60, dept:'CAS' },
  { code:'Math 102',  desc:'Calculus 2',                  section:'A', enrolled:55, cap:50, dept:'COE' },
];

// Rooms data (used by renderReports)
const ROOMS_DATA = [
  { name:'CAS-201', building:'CAS Building',     type:'Lecture',      cap:55,  util:95, booked:18, total:20 },
  { name:'CAS-301', building:'CAS Building',     type:'Lecture',      cap:45,  util:80, booked:16, total:20 },
  { name:'CAS-302', building:'CAS Building',     type:'Lecture',      cap:40,  util:70, booked:14, total:20 },
  { name:'Lab-101', building:'CAS Building',     type:'Computer Lab', cap:45,  util:60, booked:12, total:20 },
  { name:'Lab-202', building:'CAS Building',     type:'Computer Lab', cap:40,  util:55, booked:11, total:20 },
  { name:'Aud-1',   building:'Main Building',    type:'Auditorium',   cap:200, util:30, booked:6,  total:20 },
  { name:'Sci-101', building:'Science Complex',  type:'Science Lab',  cap:35,  util:50, booked:10, total:20 },
  { name:'Eng-201', building:'Engineering Hall', type:'Lecture',      cap:50,  util:85, booked:17, total:20 },
];

// Course offerings mock
const mockCourses = [
  { code:'CS 101',      desc:'Introduction to Computing',  section:'A', units:3, instructor:'Dela Cruz, J.',  days:'MWF', time:'8:00–9:00 AM',   room:'CAS-201',  enrolled:58, cap:45, modality:'F2F', status:'Published', conflict:true  },
  { code:'CS 201',      desc:'Data Structures',            section:'A', units:3, instructor:'Santos, L.',     days:'TTh', time:'10:30–12:00 PM', room:'CAS-301',  enrolled:40, cap:45, modality:'F2F', status:'Published', conflict:false },
  { code:'CS 301',      desc:'Algorithms',                 section:'A', units:3, instructor:'Reyes, M.',      days:'MWF', time:'1:00–2:00 PM',   room:'CAS-302',  enrolled:38, cap:40, modality:'F2F', status:'Published', conflict:false },
  { code:'CS 401',      desc:'Software Engineering',       section:'A', units:3, instructor:'Garcia, P.',     days:'TTh', time:'2:30–4:00 PM',   room:'CAS-303',  enrolled:35, cap:40, modality:'F2F', status:'Published', conflict:false },
  { code:'CS Elec 3',   desc:'Machine Learning',           section:'A', units:3, instructor:'Santos, J.',     days:'MWF', time:'8:30–10:00 AM',  room:'CAS-402',  enrolled:22, cap:35, modality:'F2F', status:'Published', conflict:true  },
  { code:'CS Thesis 1', desc:'Thesis Writing 1',           section:'A', units:3, instructor:'Bautista, R.',   days:'TTh', time:'4:00–5:30 PM',   room:'CAS-304',  enrolled:18, cap:25, modality:'F2F', status:'Published', conflict:false },
  { code:'IT 101',      desc:'Fundamentals of IT',         section:'A', units:3, instructor:'Cruz, E.',       days:'MWF', time:'9:00–10:00 AM',  room:'CAS-210',  enrolled:47, cap:45, modality:'F2F', status:'Published', conflict:false },
  { code:'IT 201',      desc:'Database Management',        section:'A', units:3, instructor:'Tan, B.',        days:'TTh', time:'8:00–9:30 AM',   room:'Lab-101',  enrolled:42, cap:45, modality:'F2F', status:'Published', conflict:false },
  { code:'IT Elec 2',   desc:'Mobile Development',         section:'A', units:3, instructor:'Marquez, F.',    days:'MWF', time:'11:00–12:00 PM', room:'Lab-202',  enrolled:30, cap:35, modality:'F2F', status:'Draft',     conflict:false },
  { code:'GE 101',      desc:'Understanding the Self',     section:'A', units:3, instructor:'Lopez, C.',      days:'MWF', time:'7:30–8:30 AM',   room:'Aud-1',    enrolled:55, cap:60, modality:'F2F', status:'Published', conflict:false },
  { code:'Math 102',    desc:'Calculus 2',                 section:'A', units:5, instructor:'Alcantara, N.',  days:'MWF', time:'2:00–3:30 PM',   room:'Main-101', enrolled:44, cap:50, modality:'F2F', status:'Published', conflict:false },
  { code:'PE 1',        desc:'Physical Education 1',       section:'A', units:2, instructor:'Fuentes, D.',    days:'TTh', time:'3:00–4:30 PM',   room:'Gym',      enrolled:38, cap:40, modality:'F2F', status:'Published', conflict:false },
];

// ─── BUILDING + ROOM DATA ─────────────────────────────────────
const BUILDINGS = [
  {
    id: 'cas',
    name: 'CAS Building',
    college: 'College of Arts & Sciences',
    totalRooms: 6,
    roomTypes: 'Lecture, Computer Lab',
    img: '🏛️',
    rooms: [
      { code:'CAS-201', name:'Room 201', type:'Lecture',      dept:'CAS', cap:55, classCount:4 },
      { code:'CAS-301', name:'Room 301', type:'Lecture',      dept:'CAS', cap:45, classCount:3 },
      { code:'CAS-302', name:'Room 302', type:'Lecture',      dept:'CAS', cap:40, classCount:3 },
      { code:'CAS-303', name:'Room 303', type:'Lecture',      dept:'CCS', cap:40, classCount:2 },
      { code:'CAS-402', name:'Room 402', type:'Lecture',      dept:'CCS', cap:40, classCount:3 },
      { code:'Lab-101', name:'Lab 101',  type:'Computer Lab', dept:'CCS', cap:45, classCount:4 },
    ]
  },
  {
    id: 'ccs',
    name: 'CCS Building',
    college: 'College of Computing Studies',
    totalRooms: 4,
    roomTypes: 'Lecture, Computer Lab',
    img: '💻',
    rooms: [
      { code:'CCS-101', name:'Room 101', type:'Lecture',      dept:'CCS', cap:50, classCount:5 },
      { code:'CCS-102', name:'Room 102', type:'Lecture',      dept:'CCS', cap:50, classCount:4 },
      { code:'Lab-201', name:'Lab 201',  type:'Computer Lab', dept:'CCS', cap:40, classCount:5 },
      { code:'Lab-202', name:'Lab 202',  type:'Computer Lab', dept:'CCS', cap:40, classCount:3 },
    ]
  },
  {
    id: 'eng',
    name: 'Engineering Hall',
    college: 'College of Engineering',
    totalRooms: 3,
    roomTypes: 'Lecture, Science Lab',
    img: '⚙️',
    rooms: [
      { code:'Eng-201', name:'Room 201', type:'Lecture',     dept:'Engineering', cap:50, classCount:5 },
      { code:'Eng-202', name:'Room 202', type:'Lecture',     dept:'Engineering', cap:50, classCount:4 },
      { code:'Eng-Lab', name:'Eng Lab',  type:'Science Lab', dept:'Engineering', cap:35, classCount:3 },
    ]
  },
  {
    id: 'sci',
    name: 'Science Complex',
    college: 'General Use',
    totalRooms: 2,
    roomTypes: 'Science Lab',
    img: '🔬',
    rooms: [
      { code:'Sci-101', name:'Science Lab 1', type:'Science Lab', dept:'General', cap:35, classCount:3 },
      { code:'Sci-102', name:'Science Lab 2', type:'Science Lab', dept:'General', cap:35, classCount:2 },
    ]
  },
  {
    id: 'main',
    name: 'Main Building',
    college: 'General Use',
    totalRooms: 3,
    roomTypes: 'Lecture, Auditorium',
    img: '🏫',
    rooms: [
      { code:'Main-101', name:'Room 101',     type:'Lecture',    dept:'General', cap:50, classCount:3 },
      { code:'Aud-1',    name:'Auditorium 1', type:'Auditorium', dept:'General', cap:200, classCount:2 },
      { code:'Gym',      name:'Gymnasium',    type:'General Use',dept:'General', cap:300, classCount:2 },
    ]
  },
];

// Room timetable mock — slots keyed by "ROOM-DAY-HOUR-HALF"
// Format: { subject, instructor, section, color }
const ROOM_SCHEDULE = {
  'CAS-201': {
    'Mon-8-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Mon-8-1':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Mon-9-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Wed-8-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Wed-8-1':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Wed-9-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Fri-8-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Fri-8-1':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Fri-9-0':  { subject:'CS 101', instructor:'Dela Cruz, J.', section:'CS-1A', color:'#c0192b' },
    'Tue-10-1': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
    'Tue-11-0': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
    'Tue-11-1': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
    'Thu-10-1': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
    'Thu-11-0': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
    'Thu-11-1': { subject:'GE 200', instructor:'Lopez, C.', section:'GE-A', color:'#1d4ed8' },
  },
  'Lab-101': {
    'Tue-8-0':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Tue-8-1':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Tue-9-0':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Tue-9-1':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Thu-8-0':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Thu-8-1':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Thu-9-0':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Thu-9-1':  { subject:'IT 201', instructor:'Tan, B.', section:'IT-2A', color:'#15803d' },
    'Mon-13-0': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
    'Mon-13-1': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
    'Mon-14-0': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
    'Wed-13-0': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
    'Wed-13-1': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
    'Wed-14-0': { subject:'CS 201', instructor:'Santos, L.', section:'CS-2A', color:'#7c3aed' },
  }
};


// ─── STATE ────────────────────────────────────────────────────
let activeBuilding   = null;
let activeRoom       = null;
let selectedProspectus = new Set();

// ─── PAGE NAVIGATION ─────────────────────────────────────────
function showPage(pageId, el) {
  const targetPage = document.getElementById('page-' + pageId);
  if (!targetPage) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  targetPage.classList.add('active');

  document.querySelectorAll('.sidebar-item, .sidebar-link').forEach(i => i.classList.remove('active'));

  if (el) {
    el.classList.add('active');
  } else {
    document.querySelectorAll('.sidebar-item, .sidebar-link').forEach(i => {
      const h = i.getAttribute('onclick') || '';
      if (h.includes("'" + pageId + "'")) i.classList.add('active');
    });
  }

  if (pageId === 'room-assignment') renderBuildings();
  if (pageId === 'reports')         renderReports();
  if (pageId === 'audit')           renderAuditLog();
  if (pageId === 'prospectus-review') renderProspectusQueue();
  if (pageId === 'dept-submissions')  renderDeptSubmissions();
  if (pageId === 'student-records')   renderStudentRecords(STUDENT_RECORDS);
  if (pageId === 'dashboard')         renderDashboard();
}

// ─── MODALS ───────────────────────────────────────────────────
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-overlay.active').forEach(o => o.classList.remove('active'));
});

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success:'✓', warning:'⚠', error:'✕', info:'i', warn:'⚠' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || '•'}</span>${msg}`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3200);
}

// ─── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  // Dept curriculum status table
  const deptStatusBody = document.getElementById('deptStatusTableBody');
  if (deptStatusBody) {
    const depts = [
      { name:'Computer Science',  received:true,  modified:true,  by:'Clara Santos' },
      { name:'Information Tech.', received:true,  modified:false, by:'' },
      { name:'Engineering',       received:true,  modified:false, by:'' },
      { name:'Nursing',           received:false, modified:false, by:'' },
      { name:'Business Admin.',   received:true,  modified:true,  by:'Ana Guevara' },
      { name:'Arts & Sciences',   received:false, modified:false, by:'' },
    ];
    deptStatusBody.innerHTML = depts.map(d => `
      <tr>
        <td style="font-size:12.5px;font-weight:600">${d.name}</td>
        <td>${d.received ? '<span class="badge badge-green">Yes</span>' : '<span class="badge badge-gray">No</span>'}</td>
        <td>${d.modified ? `<span class="badge badge-amber">Yes — ${d.by}</span>` : '<span class="badge badge-gray">No</span>'}</td>
        <td>${d.received ? '<span class="badge badge-green">Received</span>' : '<span class="badge badge-red">Pending</span>'}</td>
      </tr>`).join('');
  }

  // Active controls summary
  const controls = document.getElementById('activeControlsSummary');
  if (controls) {
    controls.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Global Enrollment Lock</span><span class="badge badge-red">OFF</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Publish to Departments</span><span class="badge badge-green">ON</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Publish to Students</span><span class="badge badge-gray">OFF</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Grade Encoding Window</span><span class="badge badge-green">Open until Oct 31</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Assessment Office Access</span><span class="badge badge-green">ON</span></div>
      </div>`;
  }

  // Pending prospectus quick list
  const prospList = document.getElementById('dashProspectusList');
  if (prospList) {
    const pending = PROSPECTUS_DATA.filter(p => p.status === 'pending');
    prospList.innerHTML = pending.length
      ? pending.map(p => `
        <div style="display:flex;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);align-items:flex-start">
          <div style="width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--amber)"></div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600">${p.program}</div>
            <div style="font-size:11.5px;color:var(--muted)">Submitted by ${p.submittedBy} · ${p.submittedAt}</div>
          </div>
          <button class="btn btn-success btn-xs" onclick="endorseSingle('${p.id}')">
            <i class="fas fa-circle-check"></i> Endorse
          </button>
        </div>`).join('')
      : `<div class="empty-state"><i class="fas fa-inbox"></i><p>No pending prospectus endorsements.</p></div>`;
  }

  // Enrollment by college chart
  const enrollChart = document.getElementById('dashEnrollChart');
  if (enrollChart) {
    const colleges = [
      { label:'CCS', val:500, max:900 }, { label:'COE', val:423, max:900 },
      { label:'CBA', val:287, max:900 }, { label:'CED', val:519, max:900 },
      { label:'CAS', val:181, max:900 }, { label:'CON', val:340, max:900 },
    ];
    enrollChart.innerHTML = colleges.map(c => `
      <div class="bar-row">
        <span class="bar-label">${c.label}</span>
        <div class="bar-track"><div class="bar-fill green" style="width:${Math.round(c.val/c.max*100)}%"></div></div>
        <span class="bar-val">${c.val}</span>
      </div>`).join('');
  }

  // Recent activity feed
  const actFeed = document.getElementById('dashActivityFeed');
  if (actFeed) {
    actFeed.innerHTML = RECENT_ACTIVITY.map(a => `
      <div style="display:flex;gap:12px;padding:11px 18px;border-bottom:1px solid var(--border);align-items:flex-start">
        <div style="width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${a.type==='approve'?'var(--green)':a.type==='warn'?'var(--red)':'var(--blue-lt)'}"></div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600">${a.action}</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:1px">${a.detail}</div>
        </div>
        <div style="font-size:11px;color:var(--muted-lt);white-space:nowrap">${a.time}</div>
      </div>`).join('');
  }
}

// ─── ROOM ASSIGNMENT — BUILDINGS ─────────────────────────────
function renderBuildings(query = '') {
  const grid = document.getElementById('buildingGrid');
  if (!grid) return;

  // Reset to building view
  document.getElementById('roomListView')?.style && (document.getElementById('roomListView').style.display = 'none');
  document.getElementById('timetableView')?.style && (document.getElementById('timetableView').style.display = 'none');
  document.getElementById('buildingGrid').style.display = 'grid';
  document.getElementById('roomBreadcrumb').style.display = 'none';

  const data = query
    ? BUILDINGS.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.college.toLowerCase().includes(query.toLowerCase()))
    : BUILDINGS;

  grid.innerHTML = data.map(b => `
    <div class="building-card" onclick="showRoomList('${b.id}')">
      <div class="building-card-icon">${b.img}</div>
      <div class="building-card-body">
        <div class="building-name">${b.name}</div>
        <div class="building-college">${b.college}</div>
        <div class="building-meta">
          <span>${b.totalRooms} rooms</span>
          <span>·</span>
          <span>${b.roomTypes}</span>
        </div>
      </div>
      <div class="building-card-arrow">›</div>
    </div>`).join('');
}

function showRoomList(buildingId) {
  activeBuilding = BUILDINGS.find(b => b.id === buildingId);
  if (!activeBuilding) return;

  document.getElementById('buildingGrid').style.display    = 'none';
  document.getElementById('timetableView').style.display   = 'none';
  document.getElementById('roomListView').style.display    = 'block';
  document.getElementById('roomBreadcrumb').style.display  = 'flex';

  document.getElementById('breadcrumbBuilding').textContent = activeBuilding.name;
  document.getElementById('breadcrumbRoom').style.display   = 'none';
  document.getElementById('breadcrumbArrow2').style.display = 'none';

  const tbody = document.getElementById('roomListBody');
  tbody.innerHTML = activeBuilding.rooms.map(r => `
    <tr onclick="showRoomTimetable('${r.code}')" style="cursor:pointer;">
      <td><strong>${r.code}</strong></td>
      <td>${r.name}</td>
      <td><span class="badge ${roomTypeBadge(r.type)}">${r.type}</span></td>
      <td style="color:var(--muted)">${r.dept}</td>
      <td style="text-align:center;font-weight:700;">${r.cap}</td>
      <td style="text-align:center;">${r.classCount} classes</td>
      <td style="text-align:center;">
        <button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showRoomTimetable('${r.code}')">
          <i class="fas fa-calendar-week"></i> View Schedule
        </button>
      </td>
    </tr>`).join('');
}

function roomTypeBadge(type) {
  const map = {
    'Lecture':      'badge-blue',
    'Computer Lab': 'badge-crimson',
    'Science Lab':  'badge-green',
    'Auditorium':   'badge-amber',
    'General Use':  'badge-gray',
  };
  return map[type] || 'badge-gray';
}

// ─── ROOM TIMETABLE ───────────────────────────────────────────
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function buildTimeSlots() {
  const slots = [];
  for (let h = 7; h <= 22; h++) {
    slots.push({ h, half: 0, label: `${h}:00` });
    slots.push({ h, half: 1, label: `${h}:30` });
  }
  slots.push({ h: 23, half: 0, label: '23:00' });
  return slots;
}

function showRoomTimetable(roomCode) {
  activeRoom = roomCode;
  const building = activeBuilding;
  const room = building?.rooms.find(r => r.code === roomCode);

  document.getElementById('roomListView').style.display  = 'none';
  document.getElementById('timetableView').style.display = 'block';

  document.getElementById('breadcrumbRoom').textContent  = roomCode;
  document.getElementById('breadcrumbRoom').style.display   = 'inline';
  document.getElementById('breadcrumbArrow2').style.display = 'inline';

  document.getElementById('timetableRoomTitle').textContent =
    `${roomCode}${room ? ' — ' + room.name : ''} · ${room?.type || ''} · Capacity: ${room?.cap || '—'}`;

  const schedule = ROOM_SCHEDULE[roomCode] || {};
  const slots    = buildTimeSlots();

  // Build header
  const thead = document.getElementById('timetableThead');
  thead.innerHTML = `<tr>
    <th class="time-col">Time</th>
    ${DAYS_FULL.map(d => `<th class="day-col">${d}</th>`).join('')}
  </tr>`;

  // Build body
  const tbody = document.getElementById('timetableTbody');
  tbody.innerHTML = slots.map(slot => {
    const timeLabel = slot.label;
    const cells = DAYS.map(day => {
      const key  = `${day}-${slot.h}-${slot.half}`;
      const cls  = schedule[key];
      if (cls) {
        return `<td class="timetable-booked" style="background:${cls.color}18;border-left:3px solid ${cls.color};">
          <div class="timetable-subject" style="color:${cls.color}">${cls.subject}</div>
          <div class="timetable-instr">${cls.instructor}</div>
          <div class="timetable-section">${cls.section}</div>
        </td>`;
      }
      return `<td class="timetable-free"></td>`;
    }).join('');

    return `<tr>
      <td class="time-label">${timeLabel}</td>
      ${cells}
    </tr>`;
  }).join('');
}

function goBackToBuildings() {
  document.getElementById('buildingGrid').style.display  = 'grid';
  document.getElementById('roomListView').style.display  = 'none';
  document.getElementById('timetableView').style.display = 'none';
  document.getElementById('roomBreadcrumb').style.display = 'none';
  activeBuilding = null;
  activeRoom     = null;
}

function goBackToRooms() {
  if (!activeBuilding) return;
  showRoomList(activeBuilding.id);
}

// ─── PROSPECTUS REVIEW ────────────────────────────────────────
function renderProspectusQueue(filter = 'all') {
  const container = document.getElementById('prospectusQueue');
  if (!container) return;

  const data = filter === 'all'
    ? PROSPECTUS_DATA
    : PROSPECTUS_DATA.filter(p => p.status === filter);

  if (!data.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted)">No prospectus submissions found.</div>`;
    return;
  }

  container.innerHTML = data.map(p => `
    <div class="prospectus-item" id="prosp-${p.id}">
      <div class="prosp-item-hd">
        <input type="checkbox" class="prosp-checkbox" data-id="${p.id}" onchange="onProspCheckChange()">
        <div class="prosp-item-info">
          <div class="prosp-item-title">${p.program}</div>
          <div class="prosp-item-meta">
            Version ${p.version} &nbsp;·&nbsp; Submitted by ${p.submittedBy} &nbsp;·&nbsp; ${p.submittedAt}
            &nbsp;·&nbsp; Effectivity: <strong>${p.effectivity}</strong>
          </div>
        </div>
        <span class="badge ${p.status === 'pending' ? 'badge-amber' : p.status === 'endorsed' ? 'badge-green' : 'badge-gray'}">
          ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
        </span>
        <button class="btn btn-ghost btn-xs" onclick="toggleProspDetail('${p.id}')">
          <i class="fas fa-chevron-down" id="prosp-chevron-${p.id}"></i> Details
        </button>
      </div>

      <div class="prosp-item-detail" id="prosp-detail-${p.id}" style="display:none;">
        <!-- Diff viewer -->
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted-lt);margin-bottom:8px;">
            Changes from previous version
          </div>
          <div class="diff-viewer">
            ${p.changes.map(c => `
            <div class="diff-row ${c.type}">
              <span class="diff-tag">${c.type === 'added' ? '+' : c.type === 'removed' ? '−' : '≈'}</span>
              <span class="diff-line-content">
                <strong>${c.field}</strong>
                ${c.type === 'changed' ? ` &nbsp; <span style="text-decoration:line-through;opacity:.55">${c.from}</span> → <strong>${c.to}</strong>` : ''}
                ${c.type === 'added'   ? ` &nbsp; ${c.to}` : ''}
                ${c.type === 'removed' ? ` &nbsp; ${c.from}` : ''}
              </span>
            </div>`).join('')}
          </div>
        </div>

        <!-- Secretary edit history -->
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--muted-lt);margin-bottom:8px;">
            Secretary Edit History
          </div>
          ${p.history.map(h => `
          <div style="display:flex;gap:10px;font-size:12px;padding:5px 0;border-bottom:1px dashed var(--border);">
            <span style="color:var(--muted);white-space:nowrap">${h.at}</span>
            <span><strong>${h.by}</strong> — ${h.action}</span>
          </div>`).join('')}
        </div>

        <!-- Per-item actions -->
        ${p.status === 'pending' ? `
        <div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end;">
          <button class="btn btn-ghost btn-sm" onclick="returnSingle('${p.id}')">
            <i class="fas fa-rotate-left"></i> Return to Secretary
          </button>
          <button class="btn btn-primary btn-sm" onclick="endorseSingle('${p.id}')">
            <i class="fas fa-check-circle"></i> Endorse to Registrar
          </button>
        </div>` : ''}
      </div>
    </div>`).join('');

  updateBatchBar();
}

function toggleProspDetail(id) {
  const detail  = document.getElementById(`prosp-detail-${id}`);
  const chevron = document.getElementById(`prosp-chevron-${id}`);
  const isOpen  = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  chevron.className    = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
}

function onProspCheckChange() {
  selectedProspectus.clear();
  document.querySelectorAll('.prosp-checkbox:checked').forEach(cb => {
    selectedProspectus.add(cb.dataset.id);
  });
  updateBatchBar();
}

function updateBatchBar() {
  const bar   = document.getElementById('prospBatchBar');
  const count = document.getElementById('batchCount');
  if (!bar) return;
  if (selectedProspectus.size > 0) {
    bar.style.display = 'flex';
    count.textContent = `${selectedProspectus.size} selected`;
  } else {
    bar.style.display = 'none';
  }
}

function selectAllProspectus() {
  document.querySelectorAll('.prosp-checkbox').forEach(cb => { cb.checked = true; selectedProspectus.add(cb.dataset.id); });
  updateBatchBar();
}

function clearProspectusSelection() {
  document.querySelectorAll('.prosp-checkbox').forEach(cb => { cb.checked = false; });
  selectedProspectus.clear();
  updateBatchBar();
}

function endorseSingle(id) {
  const p = PROSPECTUS_DATA.find(x => x.id === id);
  if (p) { p.status = 'endorsed'; }
  showToast(`${PROSPECTUS_DATA.find(x=>x.id===id)?.program || ''} endorsed to Registrar.`, 'success');
  renderProspectusQueue();
}

function returnSingle(id) {
  openReturnModal([id]);
}

function batchEndorse() {
  if (!selectedProspectus.size) return;
  selectedProspectus.forEach(id => {
    const p = PROSPECTUS_DATA.find(x => x.id === id);
    if (p && p.status === 'pending') p.status = 'endorsed';
  });
  showToast(`${selectedProspectus.size} prospectus(es) endorsed to Registrar.`, 'success');
  clearProspectusSelection();
  renderProspectusQueue();
}

function batchReturn() {
  if (!selectedProspectus.size) return;
  openReturnModal([...selectedProspectus]);
}

function openReturnModal(ids) {
  const modal = document.getElementById('returnModal');
  if (!modal) return;
  const names = ids.map(id => PROSPECTUS_DATA.find(p => p.id === id)?.program || id).join(', ');
  document.getElementById('returnTargetNames').textContent = names;
  modal.dataset.returnIds = JSON.stringify(ids);
  modal.classList.add('active');
}

function confirmReturn() {
  const modal = document.getElementById('returnModal');
  const ids   = JSON.parse(modal.dataset.returnIds || '[]');
  const note  = document.getElementById('returnNote').value.trim();
  if (!note) { showToast('Please enter a correction note.', 'warn'); return; }
  ids.forEach(id => {
    const p = PROSPECTUS_DATA.find(x => x.id === id);
    if (p) p.status = 'returned';
  });
  showToast(`${ids.length} prospectus(es) returned with correction note.`, 'warning');
  closeModal('returnModal');
  document.getElementById('returnNote').value = '';
  clearProspectusSelection();
  renderProspectusQueue();
}

// ─── DEPT SUBMISSIONS ─────────────────────────────────────────
function renderDeptSubmissions(query = '') {
  const container = document.getElementById('deptSubmissionsBody');
  if (!container) return;

  const data = query
    ? DEPT_SUBMISSIONS.filter(d => d.dept.toLowerCase().includes(query.toLowerCase()) || d.program.toLowerCase().includes(query.toLowerCase()))
    : DEPT_SUBMISSIONS;

  container.innerHTML = data.map(d => `
    <tr>
      <td>
        <div style="font-weight:600;font-size:13px">${d.dept}</div>
        <div style="font-size:11.5px;color:var(--muted)">${d.program}</div>
      </td>
      <td>
        <span class="badge ${d.type === 'faculty_loading' ? 'badge-blue' : 'badge-crimson'}">
          ${d.type === 'faculty_loading' ? '📋 Faculty Loading' : '📅 Schedule'}
        </span>
      </td>
      <td>
        <span class="badge ${d.status === 'submitted' ? 'badge-green' : 'badge-gray'}">
          ${d.status === 'submitted' ? 'Submitted' : 'Pending'}
        </span>
      </td>
      <td style="font-size:12px;color:var(--muted)">${d.submittedBy}</td>
      <td style="font-size:12px;color:var(--muted);white-space:nowrap">${d.submittedAt}</td>
      <td>
        ${d.status === 'submitted'
          ? `<button class="btn btn-ghost btn-xs" onclick="viewSubmission('${d.id}')">
               <i class="fas fa-eye"></i> View
             </button>`
          : `<span style="font-size:12px;color:var(--muted-lt)">—</span>`
        }
      </td>
    </tr>`).join('');
}

function viewSubmission(id) {
  const sub = DEPT_SUBMISSIONS.find(d => d.id === id);
  if (!sub || !sub.data.length) { showToast('No data available for this submission.', 'info'); return; }

  const modal = document.getElementById('submissionViewModal');
  const title = document.getElementById('submissionViewTitle');
  const body  = document.getElementById('submissionViewBody');

  title.textContent = `${sub.dept} — ${sub.type === 'faculty_loading' ? 'Faculty Loading Sheet' : 'Schedule'} (${sub.program})`;

  if (sub.type === 'faculty_loading') {
    body.innerHTML = `
      <div style="font-size:12px;color:var(--muted);margin-bottom:12px;">
        Faculty loading includes both teaching units and administrative credits where applicable.
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:var(--cr);">
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Faculty Member</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Subjects</th>
          <th style="padding:9px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Teaching Units</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Admin Credits</th>
          <th style="padding:9px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Load Status</th>
        </tr></thead>
        <tbody>
          ${sub.data.map(f => `
          <tr style="${f.status === 'overloaded' ? 'background:#fff5f5;' : ''}border-bottom:1px solid var(--border);">
            <td style="padding:10px 12px;font-weight:600;">${f.faculty}</td>
            <td style="padding:10px 12px;font-size:12px;color:var(--muted)">${f.subjects.join(', ')}</td>
            <td style="padding:10px 12px;text-align:center;font-weight:700;">${f.units}</td>
            <td style="padding:10px 12px;font-size:12px;font-style:italic;color:var(--muted)">
              ${f.adminLoad || '—'}
            </td>
            <td style="padding:10px 12px;text-align:center;">
              <span class="badge ${f.status === 'overloaded' ? 'badge-danger' : f.status === 'underload' ? 'badge-amber' : 'badge-green'}">
                ${f.status === 'overloaded' ? 'Overloaded' : f.status === 'underload' ? 'Underloaded' : 'Optimal'}
              </span>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  } else {
    body.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:var(--cr);">
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Section</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Subject</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Instructor</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Schedule</th>
          <th style="padding:9px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Room</th>
          <th style="padding:9px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.05em;">Units</th>
        </tr></thead>
        <tbody>
          ${sub.data.map(s => `
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:10px 12px;font-weight:600;">${s.section}</td>
            <td style="padding:10px 12px;">${s.subject}</td>
            <td style="padding:10px 12px;color:var(--muted)">${s.instructor}</td>
            <td style="padding:10px 12px;white-space:nowrap">${s.days} · ${s.time}</td>
            <td style="padding:10px 12px;">${s.room}</td>
            <td style="padding:10px 12px;text-align:center;font-weight:700;">${s.units}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }

  modal.classList.add('active');
}

// ─── STUDENT RECORDS ──────────────────────────────────────────
function renderStudentRecords(data) {
  const tbody = document.getElementById('studentRecordsBody');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--muted)">No student records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((s, i) => `
    <tr>
      <td style="color:var(--muted-lt);font-size:12px">${i + 1}</td>
      <td style="font-family:monospace;font-size:12.5px">${s.id}</td>
      <td>
        <div style="font-weight:600">${s.name}</div>
      </td>
      <td>${s.program}</td>
      <td>${s.year}</td>
      <td style="font-family:monospace;font-size:12.5px">${s.section}</td>
      <td>
        <span class="badge ${s.status === 'Enrolled' ? 'badge-green' : 'badge-blue'}">${s.status}</span>
      </td>
      <td>
        <span class="badge ${s.type === 'regular' ? 'badge-gray' : 'badge-amber'}">
          ${s.type === 'regular' ? 'Regular' : 'Irregular'}
        </span>
        ${s.tag ? `<span class="badge ${s.tag === 'Freshman' ? 'badge-blue' : s.tag === 'Shiftee' ? 'badge-crimson' : 'badge-purple'}" style="margin-left:4px">${s.tag}</span>` : ''}
      </td>
    </tr>`).join('');

  document.getElementById('studentRecordCount').textContent = `${data.length} records`;
}

function filterStudentRecords() {
  const q       = (document.getElementById('studentSearch')?.value || '').toLowerCase();
  const program = document.getElementById('studentProgramFilter')?.value || '';
  const status  = document.getElementById('studentStatusFilter')?.value || '';
  const tag     = document.getElementById('studentTagFilter')?.value || '';

  const filtered = STUDENT_RECORDS.filter(s => {
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchP = !program || s.program === program;
    const matchS = !status  || s.status  === status;
    const matchT = !tag     || (tag === 'regular' ? s.type === 'regular' : tag === 'irregular' ? s.type === 'irregular' : s.tag === tag);
    return matchQ && matchP && matchS && matchT;
  });

  renderStudentRecords(filtered);
}

// ─── REPORTS ─────────────────────────────────────────────────
let trendChartObj = null;

function renderReports() {
  const deptEnrollData = [
    { dept:'Computer Science',  count:612 }, { dept:'Information Tech.', count:748 },
    { dept:'Engineering',       count:423 }, { dept:'Education',         count:519 },
    { dept:'Business Admin.',   count:287 }, { dept:'Natural Sciences',  count:181 },
  ];
  const max = Math.max(...deptEnrollData.map(d => d.count));
  const deptEl = document.getElementById('deptEnrollChart');
  if (deptEl) deptEl.innerHTML = deptEnrollData.map(d => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="font-size:12px;width:140px;flex-shrink:0">${d.dept}</span>
      <div style="flex:1;height:8px;background:var(--bg-dk);border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${Math.round(d.count/max*100)}%;background:var(--cr);border-radius:4px;"></div>
      </div>
      <span style="font-size:12px;font-weight:700;min-width:36px;text-align:right">${d.count}</span>
    </div>`).join('');

  const mockRooms = [
    { name:'CAS-201', util:95 }, { name:'Eng-201', util:85 }, { name:'CAS-301', util:80 },
    { name:'Lab-101', util:60 }, { name:'Sci-101', util:50 }, { name:'Main-101', util:40 },
  ];
  const roomEl = document.getElementById('roomUtilChart');
  if (roomEl) roomEl.innerHTML = mockRooms.map(r => {
    const c = r.util >= 90 ? 'var(--danger)' : r.util >= 70 ? 'var(--warning)' : 'var(--success)';
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="font-size:12px;width:80px;flex-shrink:0">${r.name}</span>
      <div style="flex:1;height:8px;background:var(--bg-dk);border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${r.util}%;background:${c};border-radius:4px;"></div>
      </div>
      <span style="font-size:12px;font-weight:700;min-width:36px;text-align:right;color:${c}">${r.util}%</span>
    </div>`; }).join('');

  if (trendChartObj) { trendChartObj.destroy(); trendChartObj = null; }
  setTimeout(() => {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    trendChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2023-24 2S', '2024-25 1S', '2024-25 2S', '2025-26 1S'],
        datasets: [{ label:'Enrolled', data:[2711,2987,3102,3241], borderColor:'#9b1c2e', backgroundColor:'rgba(155,28,46,0.08)', borderWidth:2, fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:'#9b1c2e' }],
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:false,min:2500,ticks:{font:{size:11}}}, x:{ticks:{font:{size:11}}} } },
    });
  }, 50);
}

// ─── AUDIT LOG ────────────────────────────────────────────────
function renderAuditLog(q = '') {
  const colors = { Approved:'badge-green', Endorsed:'badge-green', Published:'badge-crimson', Edited:'badge-blue', Returned:'badge-amber', Denied:'badge-danger' };
  const body = document.getElementById('auditLogBody');
  if (!body) return;
  const filtered = q ? mockAuditLog.filter(l => l.action.toLowerCase().includes(q) || l.entity.toLowerCase().includes(q) || l.user.toLowerCase().includes(q)) : mockAuditLog;
  body.innerHTML = filtered.map(l => `
    <tr>
      <td style="white-space:nowrap;color:var(--muted);font-size:11.5px">${l.ts}</td>
      <td><span class="badge ${colors[l.action]||'badge-gray'}">${l.action}</span></td>
      <td style="font-size:13px">${l.entity}</td>
      <td>${l.user}</td>
      <td><span class="badge badge-gray">${l.role}</span></td>
      <td style="font-size:12px;color:var(--muted)">${l.detail}</td>
    </tr>`).join('');
}

function filterAuditLog(q) { renderAuditLog(q.toLowerCase()); }

// ─── REG RULES ────────────────────────────────────────────────
function onToggleChange(key, val) {
  showToast(`${key.replace(/-/g,' ')} ${val ? 'enabled' : 'disabled'}.`, val ? 'success' : 'warning');
}

function onPublishDeptChange(val) {
  const notice        = document.getElementById('studentPublishLockNotice');
  const studentToggle = document.getElementById('toggle-publish-student');
  if (!val) {
    if (studentToggle) { studentToggle.checked = false; studentToggle.disabled = true; }
    if (notice) notice.style.display = 'flex';
  } else {
    if (studentToggle) studentToggle.disabled = false;
    if (notice) notice.style.display = 'none';
  }
  onToggleChange('publish-dept', val);
}

// ─── TERM / CALENDAR ─────────────────────────────────────────
function updateTermBadges() {
  const sel      = document.getElementById('termSelect');
  const subtitle = document.getElementById('dashSubtitle');
  if (sel && subtitle) {
    subtitle.innerHTML = sel.options[sel.selectedIndex].text +
      ' &nbsp;·&nbsp; Registration: <strong style="color:var(--green)">Open</strong>';
  }
}

// Make calendar dates editable inline
function initEditableDates() {
  document.querySelectorAll('.calendar-date-editable').forEach(el => {
    el.addEventListener('click', function () {
      const current = this.textContent.trim();
      const input   = document.createElement('input');
      input.type    = 'date';
      input.value   = '';
      input.className = 'calendar-date-input';
      input.style.cssText = 'font-size:12px;border:1px solid var(--cr);border-radius:4px;padding:2px 6px;font-family:inherit;';
      this.replaceWith(input);
      input.focus();
      input.addEventListener('blur', function () {
        const span = document.createElement('span');
        span.className = 'calendar-date-editable';
        span.textContent = this.value || current;
        span.title = 'Click to edit';
        span.style.cssText = 'cursor:pointer;text-decoration:underline dotted;color:var(--cr);';
        this.replaceWith(span);
        initEditableDates();
        showToast('Date updated.', 'success');
      });
    });
    el.title = 'Click to edit';
    el.style.cssText += 'cursor:pointer;text-decoration:underline dotted;color:var(--cr);';
  });
}

// ─── COURSE TABLE ────────────────────────────────────────────
function renderCourseTable(data) {
  const tbody = document.getElementById('courseTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(c => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td>${c.desc}</td>
      <td>${c.section}</td>
      <td style="text-align:center">${c.units}</td>
      <td>${c.instructor}</td>
      <td style="white-space:nowrap">${c.days} ${c.time}</td>
      <td>${c.room || '<span style="color:var(--danger);font-size:11px">Unassigned</span>'}</td>
      <td style="text-align:center;font-weight:700;color:${c.enrolled > c.cap ? 'var(--danger)' : 'inherit'}">${c.enrolled}</td>
      <td style="text-align:center;color:var(--muted)">${c.cap}</td>
      <td><span class="badge ${c.status==='Published'?'badge-green':'badge-gray'}">${c.status}</span>
          ${c.conflict ? '<span class="badge badge-danger" style="margin-left:3px"><i class="fas fa-triangle-exclamation"></i></span>' : ''}</td>
    </tr>`).join('');
}

function filterCourses(q) {
  renderCourseTable(mockCourses.filter(c =>
    c.code.toLowerCase().includes(q.toLowerCase()) ||
    c.desc.toLowerCase().includes(q.toLowerCase()) ||
    c.instructor.toLowerCase().includes(q.toLowerCase())
  ));
}

// ─── DEPT CURRICULUM GRID (Course Offerings) ─────────────────
const DEPT_DATA = [
  { name:'Computer Science',  college:'CCS', subjects:48, lastPublished:'May 1, 2026',  status:'modified',    modifiedBy:'Clara Santos' },
  { name:'Information Tech.', college:'CCS', subjects:44, lastPublished:'May 1, 2026',  status:'published',   modifiedBy:'' },
  { name:'Engineering',       college:'COE', subjects:52, lastPublished:'Apr 28, 2026', status:'published',   modifiedBy:'' },
  { name:'Nursing',           college:'CON', subjects:60, lastPublished:'—',            status:'unpublished', modifiedBy:'' },
  { name:'Business Admin.',   college:'CBA', subjects:39, lastPublished:'May 2, 2026',  status:'modified',    modifiedBy:'Ana Guevara' },
  { name:'Arts & Sciences',   college:'CAS', subjects:35, lastPublished:'—',            status:'draft',       modifiedBy:'' },
];

function renderDeptGrid(data) {
  const grid = document.getElementById('deptCurriculumGrid');
  if (!grid) return;
  const statusBadge = s => ({
    published:   `<span class="badge badge-green">Published</span>`,
    draft:       `<span class="badge badge-gray">Draft</span>`,
    modified:    `<span class="badge badge-amber">Secretary Modified</span>`,
    unpublished: `<span class="badge badge-red">Not Published</span>`,
  }[s] || `<span class="badge badge-gray">${s}</span>`);

  grid.innerHTML = (data || DEPT_DATA).map(d => `
    <div class="card">
      <div style="padding:14px 16px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:13.5px;font-weight:700">${d.name}</div>
          <div style="font-size:11.5px;color:var(--muted)">${d.college}</div>
        </div>
        ${statusBadge(d.status)}
      </div>
      ${d.status==='modified'?`<div style="margin:8px 16px;padding:8px 12px;background:var(--amber-pale);border:1px solid #fde68a;border-left:3px solid var(--amber);border-radius:0 6px 6px 0;font-size:11.5px;color:#78350f;display:flex;align-items:center;gap:6px"><i class="fas fa-triangle-exclamation" style="color:var(--amber)"></i> Modified by ${d.modifiedBy}</div>`:''}
      <div style="padding:12px 16px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px"><span>Subjects</span><span style="font-weight:700;color:var(--text)">${d.subjects}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted)"><span>Last Published</span><span>${d.lastPublished}</span></div>
      </div>
      <div style="padding:10px 16px;border-top:1px solid var(--border);background:#fafafa;display:flex;gap:6px;justify-content:flex-end">
        <button class="btn btn-ghost btn-xs" onclick="showToast('Opening ${d.name} live view…','info')"><i class="fas fa-eye"></i> View</button>
        <button class="btn btn-ghost btn-xs" onclick="showToast('Opening editor for ${d.name}…','info')"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn btn-primary btn-xs" onclick="showToast('${d.name} published to department.','success')"><i class="fas fa-bullhorn"></i> Publish</button>
      </div>
    </div>`).join('');
}

function filterCourseOfferings(q) {
  renderDeptGrid(DEPT_DATA.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.college.toLowerCase().includes(q.toLowerCase())));
}

function filterCourseOfferingsByStatus(v) {
  renderDeptGrid(v ? DEPT_DATA.filter(d => d.status === v) : DEPT_DATA);
}

// Prospectus filter
function filterProspectus(v) { renderProspectusQueue(v); }

// ─── COMPATIBILITY ALIASES ────────────────────────────────────
// These map HTML onclick names to registrar.js equivalents.

function updateTermLabel()      { updateTermBadges(); }
function confirmReturnToDean()  { confirmReturn(); }
function filterSubmissions(q)   { renderDeptSubmissions(q || ''); }

function closePanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function approveAllSubmissions() {
  SUBMISSIONS_DATA.filter(s => s.status === 'pending').forEach(s => s.status = 'approved');
  DEPT_SUBMISSIONS.filter(s => s.status === 'submitted').forEach(s => s.status = 'approved');
  showToast('All pending submissions approved.', 'success');
  renderDeptSubmissions();
}

// confirmActivate — used by the inline HTML modal button
// HTML activateModal calls this after the registrar clicks Confirm Activate
let _activateTargetId = null;
function openActivateModal(id) {
  _activateTargetId = id;
  const p = PROSPECTUS_DATA.find(x => x.id === id);
  const lbl = document.getElementById('activateLabel');
  if (lbl && p) lbl.value = p.program;
  openModal('activateModal');
}
function confirmActivate() {
  const p = PROSPECTUS_DATA.find(x => x.id === _activateTargetId);
  if (p) { p.status = 'activated'; }
  showToast(`${p?.program || 'Prospectus'} activated as official curriculum.`, 'success');
  closeModal('activateModal');
  renderProspectusQueue();
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  renderDeptGrid();
  if (document.getElementById('courseTableBody')) renderCourseTable(mockCourses);
  if (document.getElementById('auditLogBody'))    renderAuditLog();
  updateTermBadges();
  initEditableDates();

  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
  });
});