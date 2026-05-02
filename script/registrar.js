// ─── MOCK DATA ──────────────────────────────────────────────────────────────
// Replace with a real API fetch when the backend is ready.

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

const mockRooms = [
  { name:'CAS-201',  building:'CAS Building',      type:'Lecture',      cap:55,  util:95, booked:18, total:20 },
  { name:'CAS-301',  building:'CAS Building',      type:'Lecture',      cap:45,  util:80, booked:16, total:20 },
  { name:'CAS-302',  building:'CAS Building',      type:'Lecture',      cap:40,  util:70, booked:14, total:20 },
  { name:'CAS-402',  building:'CAS Building',      type:'Lecture',      cap:40,  util:75, booked:15, total:20 },
  { name:'Lab-101',  building:'CAS Building',      type:'Computer Lab', cap:45,  util:60, booked:12, total:20 },
  { name:'Lab-202',  building:'CAS Building',      type:'Computer Lab', cap:40,  util:55, booked:11, total:20 },
  { name:'Lab-204',  building:'CAS Building',      type:'Computer Lab', cap:40,  util:45, booked:9,  total:20 },
  { name:'Aud-1',    building:'Main Building',     type:'Auditorium',   cap:200, util:30, booked:6,  total:20 },
  { name:'Sci-101',  building:'Science Complex',   type:'Science Lab',  cap:35,  util:50, booked:10, total:20 },
  { name:'Sci-102',  building:'Science Complex',   type:'Science Lab',  cap:35,  util:45, booked:9,  total:20 },
  { name:'Eng-201',  building:'Engineering Hall',  type:'Lecture',      cap:50,  util:85, booked:17, total:20 },
  { name:'Main-101', building:'Main Building',     type:'Lecture',      cap:50,  util:40, booked:8,  total:20 },
];

const mockAuditLog = [
  { ts:'Jun 29, 9:14 AM',  action:'Approved',    entity:'CS Elec 4 Sec B (New Section)',         user:'Registrar',     role:'Super Admin', detail:'Approved dept. request' },
  { ts:'Jun 28, 4:02 PM',  action:'Published',   entity:'CS Dept. Schedule',                     user:'Registrar',     role:'Super Admin', detail:'24 sections published' },
  { ts:'Jun 27, 2:45 PM',  action:'Edited',      entity:'IT 201 Sec A',                          user:'IT Dept. Admin', role:'Dept. Admin', detail:'Room changed: CAS-301 → Lab-101' },
  { ts:'Jun 26, 11:00 AM', action:'Hold Placed', entity:'Santos, Juan D. (2021-0011)',            user:'Registrar',     role:'Super Admin', detail:'Financial hold — unpaid balance' },
  { ts:'Jun 25, 10:30 AM', action:'Denied',      entity:'CS Elec 6 Sec B Cap Override',          user:'Registrar',     role:'Super Admin', detail:'Room insufficient for proposed cap' },
  { ts:'Jun 24, 9:00 AM',  action:'Published',   entity:'IT Dept. Schedule',                     user:'Registrar',     role:'Super Admin', detail:'31 sections published (2 pending)' },
  { ts:'Jun 23, 3:15 PM',  action:'Deleted',     entity:'PE 1 Sec E',                            user:'Registrar',     role:'Super Admin', detail:'Cancelled — 0 enrolled after 1 week' },
  { ts:'Jun 22, 8:00 AM',  action:'Edited',      entity:'Term: 2025–26, 1st Sem',                user:'Registrar',     role:'Super Admin', detail:'Enrollment close date extended to Jun 30' },
  { ts:'Jun 20, 1:00 PM',  action:'Approved',    entity:'IT Elec 2 Sec A (Online Switch)',       user:'Registrar',     role:'Super Admin', detail:'Modality change approved' },
  { ts:'Jun 18, 11:45 AM', action:'Approved',    entity:'CS 202 Instructor Sub',                 user:'Registrar',     role:'Super Admin', detail:'Santos, J. replaces Gatan, R.' },
];

const deptEnrollData = [
  { dept:'Computer Science',  count:612 },
  { dept:'Information Tech.', count:748 },
  { dept:'Engineering',       count:423 },
  { dept:'Education',         count:519 },
  { dept:'Business Admin.',   count:287 },
  { dept:'Natural Sciences',  count:181 },
  { dept:'Arts & Humanities', count:71  },
];

// ─── PAGE NAVIGATION ────────────────────────────────────────────────────────
function showPage(pageId, el) {
  const targetPage = document.getElementById('page-' + pageId);
  if (!targetPage) return; // Exit if page doesn't exist

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  targetPage.classList.add('active');

  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  
  if (el) {
    el.classList.add('active');
  } else {
    // Safer check for sidebar items
    document.querySelectorAll('.sidebar-item').forEach(i => {
      const clickHandler = i.getAttribute('onclick');
      if (clickHandler && clickHandler.includes("'" + pageId + "'")) {
        i.classList.add('active');
      }
    });
  }

  // Trigger renders only if the target container exists
  if (pageId === 'course-offerings' && document.getElementById('courseTableBody')) renderCourseTable(mockCourses);
  if (pageId === 'room-assignment' && document.getElementById('roomGrid')) renderRoomGrid(mockRooms);
  if (pageId === 'reports') renderReports();
  if (pageId === 'audit' && document.getElementById('auditLogBody')) renderAuditLog();
}

// ─── TABS ────────────────────────────────────────────────────────────────────
function switchTab(el, tabId) {
  const parent = el.closest('.tabs');
  parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function(e) { if (e.target === o) closeModal(o.id); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(o => o.classList.remove('active'));
});

// ─── COURSE TABLE ────────────────────────────────────────────────────────────
function renderCourseTable(data) {
  const tbody = document.getElementById('courseTableBody');
  tbody.innerHTML = data.map(c => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td>${c.desc}</td>
      <td>${c.section}</td>
      <td style="text-align:center">${c.units}</td>
      <td>${c.instructor}</td>
      <td style="white-space:nowrap">${c.days} ${c.time}</td>
      <td>${c.room || '<span style="color:var(--danger);font-size:0.78rem">Unassigned</span>'}</td>
      <td style="text-align:center;font-weight:700;color:${c.enrolled > c.cap ? 'var(--danger)' : c.enrolled / c.cap > 0.9 ? 'var(--warning)' : 'inherit'}">${c.enrolled}</td>
      <td style="text-align:center;color:var(--text-muted)">${c.cap}</td>
      <td><span class="badge ${c.modality === 'F2F' ? 'badge-neutral' : 'badge-info'}">${c.modality}</span></td>
      <td>
        <span class="badge ${c.status === 'Published' ? 'badge-success' : c.status === 'Draft' ? 'badge-neutral' : 'badge-danger'}">${c.status}</span>
        ${c.conflict ? '<span class="badge badge-danger" style="margin-left:4px"><i class="fas fa-triangle-exclamation"></i></span>' : ''}
      </td>
      <td>
        <button class="btn btn-ghost btn-xs" onclick="alert('Edit section')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-ghost btn-xs" onclick="alert('Delete section')" style="color:var(--danger)"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function filterCourses(q) {
  const filtered = mockCourses.filter(c =>
    c.code.toLowerCase().includes(q.toLowerCase()) ||
    c.desc.toLowerCase().includes(q.toLowerCase()) ||
    c.instructor.toLowerCase().includes(q.toLowerCase())
  );
  renderCourseTable(filtered);
}

function filterCoursesByDept() { renderCourseTable(mockCourses); }

// ─── ROOM GRID ────────────────────────────────────────────────────────────────
function renderRoomGrid(data) {
  const grid = document.getElementById('roomGrid');
  grid.innerHTML = data.map(r => {
    const utilClass = r.util >= 90 ? 'high-util' : r.util >= 100 ? 'full' : '';
    const utilColor = r.util >= 90 ? 'var(--danger)' : r.util >= 70 ? 'var(--warning)' : 'var(--success)';
    return `
      <div class="room-card ${utilClass}" onclick="alert('View ${r.name} schedule')">
        <div class="room-name">${r.name}</div>
        <div class="room-type">${r.type} · ${r.building}</div>
        <div class="flex items-center gap-2">
          <span class="fas fa-users text-sm text-muted"></span>
          <span class="text-sm">Capacity: <strong>${r.cap}</strong></span>
        </div>
        <div class="progress-bar-wrap" style="margin-top:8px">
          <div class="progress-bar" style="width:${r.util}%;background:${utilColor}"></div>
        </div>
        <div class="room-util" style="color:${utilColor}">${r.util}% utilization · ${r.booked}/${r.total} slots booked</div>
      </div>
    `;
  }).join('');
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
let trendChartObj = null;

function renderReports() {
  const max = Math.max(...deptEnrollData.map(d => d.count));

  document.getElementById('deptEnrollChart').innerHTML = deptEnrollData.map(d => `
    <div>
      <div class="flex items-center justify-between mb-2">
        <span style="font-size:0.8rem;width:140px;flex-shrink:0">${d.dept}</span>
        <div class="progress-bar-wrap" style="flex:1;margin:0 10px">
          <div class="progress-bar" style="width:${Math.round(d.count / max * 100)}%"></div>
        </div>
        <span style="font-size:0.8rem;font-weight:700;min-width:36px;text-align:right">${d.count}</span>
      </div>
    </div>
  `).join('');

  const roomUtils = [...mockRooms].sort((a, b) => b.util - a.util).slice(0, 8);
  document.getElementById('roomUtilChart').innerHTML = roomUtils.map(r => {
    const c = r.util >= 90 ? 'var(--danger)' : r.util >= 70 ? 'var(--warning)' : 'var(--success)';
    return `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span style="font-size:0.8rem;width:80px;flex-shrink:0">${r.name}</span>
          <div class="progress-bar-wrap" style="flex:1;margin:0 10px">
            <div class="progress-bar" style="width:${r.util}%;background:${c}"></div>
          </div>
          <span style="font-size:0.8rem;font-weight:700;min-width:36px;text-align:right;color:${c}">${r.util}%</span>
        </div>
      </div>`;
  }).join('');

  if (trendChartObj) { trendChartObj.destroy(); trendChartObj = null; }

  setTimeout(() => {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    trendChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2023-24 2S', '2024-25 1S', '2024-25 2S', '2025-26 1S'],
        datasets: [{
          label: 'Enrolled',
          data: [2711, 2987, 3102, 2841],
          borderColor: '#9b1c2e',
          backgroundColor: 'rgba(155,28,46,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#9b1c2e',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, min: 2500, ticks: { font: { size: 11 } } },
          x: { ticks: { font: { size: 11 } } },
        },
      },
    });
  }, 50);
}

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
function renderAuditLog() {
  const actionColors = {
    Approved:      'badge-success',
    Denied:        'badge-danger',
    Published:     'badge-crimson',
    Edited:        'badge-info',
    Deleted:       'badge-danger',
    'Hold Placed': 'badge-warning',
  };
  document.getElementById('auditLogBody').innerHTML = mockAuditLog.map(l => `
    <tr>
      <td style="white-space:nowrap;color:var(--text-muted);font-size:0.78rem">${l.ts}</td>
      <td><span class="badge ${actionColors[l.action] || 'badge-neutral'}">${l.action}</span></td>
      <td style="font-size:0.83rem">${l.entity}</td>
      <td>${l.user}</td>
      <td><span class="badge badge-neutral">${l.role}</span></td>
      <td style="font-size:0.78rem;color:var(--text-muted)">${l.detail}</td>
    </tr>
  `).join('');
}

// ─── APPROVAL ACTIONS ────────────────────────────────────────────────────────
function approveItem(btn) {
  const item = btn.closest('.approval-item');
  item.style.opacity      = '0.4';
  item.style.pointerEvents = 'none';
  const badge = document.getElementById('approvalBadge');
  const n = parseInt(badge.textContent) - 1;
  badge.textContent = n;
  if (n <= 0) badge.style.display = 'none';
}

// ─── TERM BADGE ──────────────────────────────────────────────────────────────
function updateTermBadges() {
  const sel = document.getElementById('termSelect');
  const subtitle = document.querySelector('.page-subtitle');
  if (sel && subtitle) { // Only run if both elements exist
    subtitle.textContent = sel.options[sel.selectedIndex].text + ' · Registration Period: Open';
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('courseTableBody')) {
    renderCourseTable(mockCourses);
  }
});

document.addEventListener('DOMContentLoaded', () => {
// Check if the element exists to avoid "null" errors
    const courseTable = document.getElementById('courseTableBody');
    const roomGrid = document.getElementById('roomGrid');
    const auditLog = document.getElementById('auditLogBody');

    if (courseTable) renderCourseTable(mockCourses);
    if (roomGrid) renderRoomGrid(mockRooms);
    if (auditLog) renderAuditLog();

     if (document.getElementById('termSelect')) {
        updateTermBadges();
      }});
