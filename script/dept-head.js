/* ═══════════════════════════════════════════════════
   WMSU-Ease — Department Head  |  dept-head.js
   v2 — Auto-scheduling, composite scores, bug fixes
═══════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────
let currentDept    = '';
let currentView    = 'all';
let currentFilter  = 'all';
let currentCourse  = '';
let currentPage    = 1;
const PAGE_SIZE    = 20;
let activeAppNo    = null;
let activeAction   = null;

const DEPT_SLOTS = {
  'College of Computing Studies':          150,
  'College of Engineering':                300,
  'College of Nursing':                    120,
  'College of Business Administration':    200,
  'College of Arts and Sciences':          180,
  'College of Education':                  160,
  'College of Agriculture':                200,
  'College of Criminology':                100,
  'College of Islamic and Arabic Studies':  80,
};

// ── Interview Evaluation Criteria ─────────────────
const INTERVIEW_CRITERIA = {
  _base: [
    { id: 'comm',    label: 'Communication Skills',    desc: 'Clarity, articulation, and listening ability',             max: 5 },
    { id: 'motiv',   label: 'Motivation & Goals',       desc: 'Clarity of purpose and direction for chosen field',        max: 5 },
    { id: 'char',    label: 'Character & Integrity',    desc: 'Honesty, responsibility, and personal values alignment',   max: 5 },
    { id: 'adapt',   label: 'Adaptability',             desc: 'Resilience and ability to handle change or pressure',      max: 5 },
  ],
  'College of Computing Studies': [
    { id: 'logic',   label: 'Logical & Analytical Thinking', desc: 'Problem decomposition, pattern recognition', max: 5 },
    { id: 'techint', label: 'Technology Interest',           desc: 'Curiosity and enthusiasm for computing',     max: 5 },
  ],
  'College of Engineering': [
    { id: 'mathap',  label: 'Mathematical Aptitude',     desc: 'Comfort with quantitative and spatial reasoning', max: 5 },
    { id: 'techap',  label: 'Technical Problem Solving', desc: 'Applied engineering thinking and design',         max: 5 },
  ],
  'College of Nursing': [
    { id: 'empathy', label: 'Empathy & Compassion',      desc: 'Sensitivity to patient needs and emotional intelligence', max: 5 },
    { id: 'stress',  label: 'Stress Resilience',         desc: 'Composure under pressure and high-stakes scenarios',      max: 5 },
  ],
  'College of Business Administration': [
    { id: 'lead',    label: 'Leadership Potential',      desc: 'Initiative, decisiveness, and team orientation', max: 5 },
    { id: 'bizmind', label: 'Business Mindset',          desc: 'Understanding of commerce, markets, economics',  max: 5 },
  ],
  'College of Arts and Sciences': [
    { id: 'crit',    label: 'Critical & Creative Thinking', desc: 'Depth of thought, originality, intellectual curiosity', max: 5 },
    { id: 'research', label: 'Research Orientation',        desc: 'Systematic inquiry and scientific mindset',              max: 5 },
  ],
  'College of Education': [
    { id: 'teach',    label: 'Teaching Aptitude',    desc: 'Ability to explain concepts and engage learners',   max: 5 },
    { id: 'patience', label: 'Patience & Dedication', desc: 'Commitment to student growth and development',     max: 5 },
  ],
  'College of Agriculture': [
    { id: 'enviro',   label: 'Environmental Awareness', desc: 'Understanding of agri-ecosystems and sustainability', max: 5 },
    { id: 'practical', label: 'Practical Mindset',      desc: 'Hands-on orientation and field readiness',             max: 5 },
  ],
  'College of Criminology': [
    { id: 'ethics',  label: 'Ethics & Sense of Justice', desc: 'Appreciation of law, order, and fairness',      max: 5 },
    { id: 'observe', label: 'Observational Skills',      desc: 'Attention to detail and situational awareness',  max: 5 },
  ],
  'College of Islamic and Arabic Studies': [
    { id: 'cultural', label: 'Cultural Appreciation', desc: 'Understanding of Islamic culture, history, values', max: 5 },
    { id: 'lang',    label: 'Language Aptitude',      desc: 'Potential and enthusiasm for Arabic language',      max: 5 },
  ],
};

function getCriteria(dept) {
  return [
    ...(INTERVIEW_CRITERIA._base || []),
    ...(INTERVIEW_CRITERIA[dept] || []),
  ];
}

// ── Schedule Storage ──────────────────────────────
const SCHED_KEY = dept =>
  `wmsu_isched_${btoa(unescape(encodeURIComponent(dept))).replace(/=/g, '')}`;

function getScheduleConfig(dept) {
  try { return JSON.parse(localStorage.getItem(SCHED_KEY(dept))); }
  catch(e) { return null; }
}
function saveScheduleConfig(dept, cfg) {
  localStorage.setItem(SCHED_KEY(dept), JSON.stringify(cfg));
}

// Returns { "YYYY-MM-DD_AM": count, "YYYY-MM-DD_PM": count, … }
function getSlotOccupancy(dept) {
  const occ = {};
  getDeptApps(dept)
    .filter(a => a.interviewSlot)
    .forEach(a => {
      const k = `${a.interviewSlot.date}_${a.interviewSlot.session}`;
      occ[k] = (occ[k] || 0) + 1;
    });
  return occ;
}

// Returns the next available { date, session, time } or null if all full
function getNextAvailableSlot(dept) {
  const cfg = getScheduleConfig(dept);
  if (!cfg || !cfg.days?.length) return null;
  const occ = getSlotOccupancy(dept);
  for (const day of cfg.days) {
    const amKey = `${day.date}_AM`;
    const pmKey = `${day.date}_PM`;
    if ((occ[amKey] || 0) < cfg.amCapacity)
      return { date: day.date, session: 'AM', time: cfg.amStart };
    if ((occ[pmKey] || 0) < cfg.pmCapacity)
      return { date: day.date, session: 'PM', time: cfg.pmStart };
  }
  return null;
}

// ── Auto-assign interview slots for a dept ────────
// Called when dept head first loads a department.
// Sorts pending applicants by submission date and fills slots in order.
function autoAssignInterviewSlots(dept) {
  const cfg = getScheduleConfig(dept);
  if (!cfg || !cfg.days?.length) return;

  const allApps = getApps();
  let changed = false;

  // Only auto-assign apps that are valid, not yet scheduled, and not already decided
  const toSchedule = allApps
    .filter(a =>
      a.department === dept &&
      a.admissionStatus !== 'flagged' &&
      !a.interviewSlot &&
      a.deptStatus !== 'accepted' &&
      a.deptStatus !== 'rejected'
    )
    .sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));

  if (!toSchedule.length) return;

  // Build a slot queue from schedule config
  const slotQueue = [];
  for (const day of cfg.days) {
    for (let i = 0; i < cfg.amCapacity; i++) slotQueue.push({ date: day.date, session: 'AM', time: cfg.amStart });
    for (let i = 0; i < cfg.pmCapacity; i++) slotQueue.push({ date: day.date, session: 'PM', time: cfg.pmStart });
  }

  // Count already-occupied slots
  const occ = getSlotOccupancy(dept);
  let slotUsed = Object.values(occ).reduce((s, n) => s + n, 0);

  toSchedule.forEach(a => {
    if (slotUsed >= slotQueue.length) return; // no more slots
    const slot = slotQueue[slotUsed];
    const idx  = allApps.findIndex(x => x.appNo === a.appNo);
    if (idx === -1) return;
    allApps[idx].interviewSlot  = slot;
    allApps[idx].deptStatus     = 'for_interview';
    allApps[idx].status         = 'interviewed';
    allApps[idx].interviewNotes = allApps[idx].interviewNotes || '';
    slotUsed++;
    changed = true;
  });

  if (changed) {
    saveApps(allApps);
  }
}

// ── Score state ────────────────────────────────────
const _scores = {};

// ── Data helpers ──────────────────────────────────
function getApps() {
  try { return JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); }
  catch(e) { return []; }
}
function saveApps(arr) {
  localStorage.setItem('wmsu_applications', JSON.stringify(arr));
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
function getComposite(a) {
  if (!window.WMSU_calcComposite) return null;
  return window.WMSU_calcComposite(a.course, a.cet?.oapr || 0, a.natScore, a.eatScore);
}

// ── Schedule Card ─────────────────────────────────
function renderScheduleCard() {
  const card = document.getElementById('scheduleCard');
  if (!card || !currentDept) return;

  const cfg = getScheduleConfig(currentDept);

  if (!cfg) {
    card.innerHTML = `
      <div class="sched-card-empty">
        <div class="sched-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8"  y1="2" x2="8"  y2="6"/>
            <line x1="3"  y1="10" x2="21" y2="10"/>
            <line x1="12" y1="14" x2="12" y2="18"/>
            <line x1="10" y1="16" x2="14" y2="16"/>
          </svg>
        </div>
        <div class="sched-card-empty-txt">
          <div class="sched-card-title">Interview Schedule Not Configured</div>
          <div class="sched-card-sub">Set up interview days and slot capacity to enable automatic scheduling for this department.</div>
        </div>
        <button class="btn-setup-sched" onclick="openScheduleSetup()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
          Configure Schedule
        </button>
      </div>`;
    return;
  }

  const occ           = getSlotOccupancy(currentDept);
  const totalSlots    = cfg.days.length * (cfg.amCapacity + cfg.pmCapacity);
  const totalAssigned = Object.values(occ).reduce((s, n) => s + n, 0);
  const nextSlot      = getNextAvailableSlot(currentDept);

  const dayRows = cfg.days.map((day, i) => {
    const label  = new Date(day.date + 'T12:00').toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
    const amFill = occ[`${day.date}_AM`] || 0;
    const pmFill = occ[`${day.date}_PM`] || 0;
    const amPct  = Math.round(amFill / cfg.amCapacity * 100);
    const pmPct  = Math.round(pmFill / cfg.pmCapacity * 100);
    const amFull = amFill >= cfg.amCapacity;
    const pmFull = pmFill >= cfg.pmCapacity;

    return `
      <div class="sched-day-row">
        <div class="sched-day-label">
          <span class="sched-day-num">Day ${i + 1}</span>
          <span class="sched-day-date">${label}</span>
        </div>
        <div class="sched-sessions">
          <div class="sched-session-item">
            <div class="sched-session-meta">
              <span class="sched-tag am">AM</span>
              <span class="sched-time-range">${cfg.amStart}–${cfg.amEnd}</span>
              <span class="sched-slot-count ${amFull ? 'full' : ''}">${amFill}/${cfg.amCapacity}</span>
            </div>
            <div class="sched-mini-bar"><div class="sched-mini-fill ${amFull ? 'full' : ''}" style="width:${amPct}%"></div></div>
          </div>
          <div class="sched-session-item">
            <div class="sched-session-meta">
              <span class="sched-tag pm">PM</span>
              <span class="sched-time-range">${cfg.pmStart}–${cfg.pmEnd}</span>
              <span class="sched-slot-count ${pmFull ? 'full' : ''}">${pmFill}/${cfg.pmCapacity}</span>
            </div>
            <div class="sched-mini-bar"><div class="sched-mini-fill ${pmFull ? 'full' : ''}" style="width:${pmPct}%"></div></div>
          </div>
        </div>
      </div>`;
  }).join('');

  const nextHtml = nextSlot
    ? `<span class="sched-next-slot">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><polyline points="9 18 15 12 9 6"/></svg>
         Next: ${new Date(nextSlot.date + 'T12:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · ${nextSlot.session} · ${nextSlot.time}
       </span>`
    : `<span class="sched-next-slot full">All slots filled</span>`;

  card.innerHTML = `
    <div class="sched-card-hd">
      <div class="sched-card-icon sched-icon-active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="sched-card-hd-txt">
        <div class="sched-card-title">Interview Schedule · ${cfg.days.length}-Day Program</div>
        <div class="sched-card-sub">
          ${totalAssigned} / ${totalSlots} slots assigned
          ${nextHtml}
        </div>
      </div>
      <button class="btn-setup-sched btn-setup-sched-sm" onclick="openScheduleSetup()">Edit</button>
    </div>
    <div class="sched-days-grid">${dayRows}</div>`;
}

// ── Schedule Setup Modal ──────────────────────────
function openScheduleSetup() {
  const cfg = getScheduleConfig(currentDept) || {
    days:       [{ date: '' }],
    amStart:    '08:00', amEnd: '12:00', amCapacity: 40,
    pmStart:    '13:00', pmEnd: '17:00', pmCapacity: 40,
  };

  const daysHtml = cfg.days.map((d, i) => buildDayRow(i, d.date)).join('');

  document.getElementById('schedSetupBody').innerHTML = `
    <div class="form-field">
      <label>Department</label>
      <div class="sched-dept-display">${currentDept}</div>
    </div>
    <div class="form-field">
      <label>Interview Days</label>
      <div id="daysList" class="days-list">${daysHtml}</div>
      <button type="button" class="btn-add-day" onclick="addDayRow()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Day
      </button>
    </div>
    <div class="sched-sessions-grid">
      <div class="sched-session-col">
        <div class="sched-session-col-hd"><span class="sched-tag am">AM Session</span></div>
        <div class="sched-time-pair">
          <div class="form-field">
            <label>Start</label>
            <input type="time" id="amStart" value="${cfg.amStart}" oninput="updateSchedPreview()">
          </div>
          <div class="sched-time-dash">–</div>
          <div class="form-field">
            <label>End</label>
            <input type="time" id="amEnd" value="${cfg.amEnd}" oninput="updateSchedPreview()">
          </div>
        </div>
        <div class="form-field">
          <label>Capacity (students)</label>
          <input type="number" id="amCapacity" value="${cfg.amCapacity}" min="1" max="500" oninput="updateSchedPreview()">
        </div>
      </div>
      <div class="sched-session-col">
        <div class="sched-session-col-hd"><span class="sched-tag pm">PM Session</span></div>
        <div class="sched-time-pair">
          <div class="form-field">
            <label>Start</label>
            <input type="time" id="pmStart" value="${cfg.pmStart}" oninput="updateSchedPreview()">
          </div>
          <div class="sched-time-dash">–</div>
          <div class="form-field">
            <label>End</label>
            <input type="time" id="pmEnd" value="${cfg.pmEnd}" oninput="updateSchedPreview()">
          </div>
        </div>
        <div class="form-field">
          <label>Capacity (students)</label>
          <input type="number" id="pmCapacity" value="${cfg.pmCapacity}" min="1" max="500" oninput="updateSchedPreview()">
        </div>
      </div>
    </div>
    <div class="sched-capacity-preview" id="schedPreview"></div>
    <div class="modal-alert" id="schedAlert"></div>
    <div class="modal-footer">
      <button class="btn-cancel" onclick="closeScheduleSetup()">Cancel</button>
      <button class="btn-confirm-accept" onclick="saveScheduleSetup()">Save Schedule</button>
    </div>`;

  updateSchedPreview();
  document.getElementById('schedSetupModal').classList.add('open');
}

function buildDayRow(i, dateVal) {
  return `<div class="sched-day-input-row" id="dayRow${i}">
    <span class="sched-day-num-lbl">Day ${i + 1}</span>
    <input type="date" class="sched-day-date-input" id="dayDate${i}" value="${dateVal || ''}" oninput="updateSchedPreview()">
    <button type="button" class="sched-day-remove" onclick="removeDayRow(${i})" title="Remove">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>`;
}

function addDayRow() {
  const list  = document.getElementById('daysList');
  const count = list.querySelectorAll('.sched-day-input-row').length;
  list.insertAdjacentHTML('beforeend', buildDayRow(count, ''));
  renumberDayRows();
  updateSchedPreview();
}

function removeDayRow(idx) {
  document.getElementById(`dayRow${idx}`)?.remove();
  renumberDayRows();
  updateSchedPreview();
}

function renumberDayRows() {
  document.querySelectorAll('.sched-day-input-row').forEach((row, i) => {
    row.id = `dayRow${i}`;
    const lbl = row.querySelector('.sched-day-num-lbl');
    const inp = row.querySelector('.sched-day-date-input');
    const btn = row.querySelector('.sched-day-remove');
    if (lbl) lbl.textContent = `Day ${i + 1}`;
    if (inp) inp.id = `dayDate${i}`;
    if (btn) btn.setAttribute('onclick', `removeDayRow(${i})`);
  });
}

function updateSchedPreview() {
  const dateInputs = Array.from(document.querySelectorAll('.sched-day-date-input'));
  const days       = dateInputs.filter(inp => inp.value).length;
  const amCap      = parseInt(document.getElementById('amCapacity')?.value) || 0;
  const pmCap      = parseInt(document.getElementById('pmCapacity')?.value) || 0;
  const total      = days * (amCap + pmCap);
  const el         = document.getElementById('schedPreview');
  if (!el) return;
  if (!days) {
    el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" style="color:var(--blue);flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Please choose at least one interview day to calculate slot capacity.</span>`;
    return;
  }
  el.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" style="color:var(--blue);flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>${days} day${days !== 1 ? 's' : ''} × ${amCap + pmCap} students/day =
    <strong>${total} total interview slots</strong></span>`;
}

function closeScheduleSetup() {
  document.getElementById('schedSetupModal').classList.remove('open');
}

function saveScheduleSetup() {
  const alertEl    = document.getElementById('schedAlert');
  const dateInputs = Array.from(document.querySelectorAll('.sched-day-date-input'));
  const days       = [];

  alertEl.textContent = '';
  alertEl.className   = 'modal-alert';

  dateInputs.forEach(inp => {
    if (inp.value) days.push({ date: inp.value });
  });

  if (!days.length) {
    alertEl.textContent = 'Add at least one interview day before saving.';
    alertEl.className   = 'modal-alert show err';
    return;
  }

  const amCapacity = parseInt(document.getElementById('amCapacity').value);
  const pmCapacity = parseInt(document.getElementById('pmCapacity').value);
  if (!amCapacity || !pmCapacity || amCapacity < 1 || pmCapacity < 1) {
    alertEl.textContent = 'Please enter valid slot capacities (minimum 1).';
    alertEl.className   = 'modal-alert show err';
    return;
  }

  const cfg = {
    days,
    amStart:    document.getElementById('amStart').value,
    amEnd:      document.getElementById('amEnd').value,
    amCapacity,
    pmStart:    document.getElementById('pmStart').value,
    pmEnd:      document.getElementById('pmEnd').value,
    pmCapacity,
  };
  saveScheduleConfig(currentDept, cfg);

  // Re-run auto-assignment with the new schedule
  autoAssignInterviewSlots(currentDept);

  closeScheduleSetup();
  renderScheduleCard();
  renderKPIs();
  render();
  showToast('Interview schedule saved and slots auto-assigned.', 'success');
}

// ── Department change ─────────────────────────────
function onDeptChange() {
  setDept(document.getElementById('deptSelect').value);
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
    noState.style.display   = 'flex';
    mainCont.style.display  = 'none';
    sbEmpty.style.display   = 'flex';
    sbContent.style.display = 'none';
    return;
  }

  noState.style.display   = 'none';
  mainCont.style.display  = 'block';
  sbEmpty.style.display   = 'none';
  sbContent.style.display = 'block';

  const initials = dept.split(' ').filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 2);
  document.getElementById('deptAvatar').textContent    = initials || 'DH';
  document.getElementById('deptUserLabel').textContent = dept.replace('College of ', '');

  // Reset active sidebar link
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('nav-all')?.classList.add('active');

  // Auto-assign interview slots based on submission order
  autoAssignInterviewSlots(dept);

  buildCourseNav(dept);
  renderKPIs();
  renderScheduleCard();
  render();
}

// ── Build course nav ──────────────────────────────
function buildCourseNav(dept) {
  const apps   = getDeptApps(dept);
  const counts = {};
  apps.forEach(a => { if (a.course) counts[a.course] = (counts[a.course] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const html = sorted.map(([c, n]) => {
    const key   = btoa(unescape(encodeURIComponent(c))).replace(/=/g, '');
    const short = c.replace(/^BS |^BA |^Bachelor of |^Associate in /, '').slice(0, 28);
    return `<a class="sidebar-course-link" id="cnav-${key}"
                onclick="filterByCourse(${JSON.stringify(c)})" title="${c}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
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

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.sidebar-course-link').forEach(l => l.classList.remove('active'));

  const key = btoa(unescape(encodeURIComponent(course))).replace(/=/g, '');
  document.getElementById('cnav-' + key)?.classList.add('active');

  const req = window.WMSU_COURSE_REQUIREMENTS?.[course];
  document.getElementById('pageTitle').textContent = course;
  document.getElementById('pageDesc').textContent  =
    req ? `${req.note} · Min OAPR: ${req.oaprMin} PR` : 'Course applicants';

  render();
}

// ── KPI + badges ──────────────────────────────────
function renderKPIs() {
  if (!currentDept) return;
  const apps = getDeptApps(currentDept);

  const pending   = apps.filter(a => a.status === 'pending_review' && !a.deptStatus);
  const qualified = apps.filter(a => { const r = isQualified(a); return r && r.qualified; });
  const interview = apps.filter(a => a.deptStatus === 'for_interview');
  const accepted  = apps.filter(a => a.deptStatus === 'accepted');
  const rejected  = apps.filter(a => a.deptStatus === 'rejected');

  document.getElementById('kpi-total').textContent     = apps.length;
  document.getElementById('kpi-pending').textContent   = pending.length;
  document.getElementById('kpi-qualified').textContent = qualified.length;
  document.getElementById('kpi-interview').textContent = interview.length;
  document.getElementById('kpi-accepted').textContent  = accepted.length;
  document.getElementById('kpi-rejected').textContent  = rejected.length;

  document.getElementById('badge-all').textContent       = apps.length;
  document.getElementById('badge-pending').textContent   = pending.length;
  document.getElementById('badge-qualified').textContent = qualified.length;
  document.getElementById('badge-interview').textContent = interview.length;
  document.getElementById('badge-accepted').textContent  = accepted.length;
  document.getElementById('badge-rejected').textContent  = rejected.length;

  const slots = DEPT_SLOTS[currentDept] || 150;
  const pct   = Math.min(100, Math.round(accepted.length / slots * 100));
  document.getElementById('slotFill').style.width = pct + '%';
  document.getElementById('slotPct').textContent  = pct + '%';
  document.getElementById('slotSub').textContent  =
    `${accepted.length} accepted of ${slots} estimated slots — ${slots - accepted.length} remaining`;

  document.getElementById('syncLabel').textContent =
    'Last sync: ' + new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}

// ── Render table ──────────────────────────────────
function render() {
  if (!currentDept) return;
  let rows = getDeptApps(currentDept);

  if (currentCourse) rows = rows.filter(a => a.course === currentCourse);

  if (currentView === 'pending')   rows = rows.filter(a => a.status === 'pending_review' && !a.deptStatus);
  if (currentView === 'qualified') rows = rows.filter(a => { const r = isQualified(a); return r && r.qualified; });
  if (currentView === 'interview') rows = rows.filter(a => a.deptStatus === 'for_interview');
  if (currentView === 'accepted')  rows = rows.filter(a => a.deptStatus === 'accepted');
  if (currentView === 'rejected')  rows = rows.filter(a => a.deptStatus === 'rejected');

  if (currentFilter === 'qualified')   rows = rows.filter(a => { const r = isQualified(a); return r && r.qualified; });
  if (currentFilter === 'unqualified') rows = rows.filter(a => { const r = isQualified(a); return r && !r.qualified; });
  if (currentFilter === 'freshman')    rows = rows.filter(a => a.applicantType === 'freshman');
  if (currentFilter === 'transferee')  rows = rows.filter(a => a.applicantType === 'transferee');

  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  if (q) rows = rows.filter(a =>
    (a.name   || '').toLowerCase().includes(q) ||
    (a.appNo  || '').toLowerCase().includes(q) ||
    (a.course || '').toLowerCase().includes(q)
  );

  const sort = document.getElementById('sortSel')?.value || 'date-desc';
  if (sort === 'oapr-desc') rows.sort((a, b) => (b.cet?.oapr || 0) - (a.cet?.oapr || 0));
  if (sort === 'oapr-asc')  rows.sort((a, b) => (a.cet?.oapr || 0) - (b.cet?.oapr || 0));
  if (sort === 'date-desc') rows.sort((a, b) => new Date(b.submittedDate || 0) - new Date(a.submittedDate || 0));
  if (sort === 'date-asc')  rows.sort((a, b) => new Date(a.submittedDate || 0) - new Date(b.submittedDate || 0));
  if (sort === 'name-asc')  rows.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  if (sort === 'composite-desc') rows.sort((a, b) => {
    const ca = getComposite(a)?.composite || 0;
    const cb = getComposite(b)?.composite || 0;
    return cb - ca;
  });

  paginateAndRender(rows);
}

function paginateAndRender(rows) {
  const total = rows.length;
  const pages = Math.ceil(total / PAGE_SIZE) || 1;
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = rows.slice(start, start + PAGE_SIZE);

  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  const pagin = document.getElementById('pagination');

  if (!total) {
    tbody.innerHTML     = '';
    empty.style.display = 'block';
    pagin.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  pagin.style.display = 'flex';
  document.getElementById('paginInfo').textContent =
    `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total}`;
  document.getElementById('prevBtn').disabled = currentPage <= 1;
  document.getElementById('nextBtn').disabled = currentPage >= pages;

  tbody.innerHTML = paged.map(renderRow).join('');
}

function renderRow(a) {
  const oapr      = a.cet?.oapr || 0;
  const oaprClass = oapr >= 75 ? 'sp-high' : oapr >= 50 ? 'sp-mid' : 'sp-low';

  const qr       = isQualified(a);
  const comp     = getComposite(a);
  const qualHtml = qr
    ? `<span class="qual-tag ${qr.qualified ? 'qual-pass' : 'qual-fail'}">${qr.qualified ? '✓ Qualifies' : '✗ Below cutoff'}</span>`
    : '—';

  const ds = a.deptStatus;
  let statusHtml = '<span class="badge b-pending">Pending</span>';
  if (ds === 'for_interview') statusHtml = '<span class="badge b-interview">For Interview</span>';
  if (ds === 'accepted')      statusHtml = '<span class="badge b-accepted">Accepted</span>';
  if (ds === 'rejected')      statusHtml = '<span class="badge b-rejected">Rejected</span>';

  const slotHtml = a.interviewSlot
    ? `<div class="row-slot-tag">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="9" height="9"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
         ${new Date(a.interviewSlot.date + 'T12:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
         · ${a.interviewSlot.session} · ${a.interviewSlot.time}
       </div>`
    : '';

  const evalHtml = a.interviewEval
    ? `<div class="row-eval-tag">${a.interviewEval.totalScore}/${a.interviewEval.maxScore} pts · ${a.interviewEval.recommendation}</div>`
    : '';

  // Composite score tag for Nursing / Engineering
  const compHtml = comp
    ? `<div style="font-size:10px;color:var(--blue);margin-top:2px;">⊕ ${comp.composite} (${comp.formula})</div>`
    : '';

  const dateStr = a.submittedDate
    ? new Date(a.submittedDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  let actBtns = `<button class="btn-act btn-view" onclick="openPanel('${a.appNo}')">View</button>`;
  if (!ds || ds === 'for_interview') {
    actBtns += `<button class="btn-act btn-accept" onclick="openActionModal('${a.appNo}','accept')">Accept</button>`;
  }
  if (ds !== 'accepted' && ds !== 'rejected') {
    actBtns += `<button class="btn-act btn-reject" onclick="openActionModal('${a.appNo}','reject')">Reject</button>`;
  }
  // Manual override: reassign slot
  if (ds === 'for_interview') {
    actBtns += `<button class="btn-act btn-interview" onclick="openActionModal('${a.appNo}','interview')">Reschedule</button>`;
  }

  const courseShort = (a.course || '—').replace(/^BS |^BA |^Bachelor of /, '');

  return `<tr>
    <td>
      <div class="sname">${a.name || '—'}</div>
      <div class="sid">${a.appNo} · ${a.email || ''}</div>
    </td>
    <td>
      <span class="score-pill ${oaprClass}">${oapr || '—'}</span>
      ${a.natScore ? `<span style="font-size:10px;color:var(--muted);display:block;margin-top:2px;">NAT:${a.natScore}</span>` : ''}
      ${a.eatScore ? `<span style="font-size:10px;color:var(--muted);display:block;margin-top:2px;">EAT:${a.eatScore}</span>` : ''}
      ${compHtml}
    </td>
    <td>${qualHtml}</td>
    <td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px;" title="${a.course || ''}">${courseShort}</td>
    <td><span class="type-tag ${a.applicantType || 'freshman'}">${a.applicantType || 'freshman'}</span></td>
    <td>${statusHtml}${slotHtml}${evalHtml}</td>
    <td style="font-size:12px;color:var(--muted);">${dateStr}</td>
    <td><div class="act-row">${actBtns}</div></td>
  </tr>`;
}

function changePage(d) {
  currentPage += d;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── View / filter setters ─────────────────────────
function setView(v, el) {
  currentView   = v;
  currentCourse = '';
  currentPage   = 1;

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.sidebar-course-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');

  const titles = {
    all:       ['All Applicants',  'All applicants assigned to your department.'],
    pending:   ['For Review',      'New applications awaiting your decision.'],
    qualified: ['Qualified',       'Applicants who meet the minimum OAPR requirements.'],
    interview: ['For Interview',   'Applicants scheduled for interview.'],
    accepted:  ['Accepted',        'Applicants accepted into your program.'],
    rejected:  ['Rejected',        'Applications that did not meet requirements.'],
  };
  const t = titles[v] || titles.all;
  document.getElementById('pageTitle').textContent = t[0];
  document.getElementById('pageDesc').textContent  = t[1];
  render();
}

function setFilter(f) {
  currentFilter = f;
  currentPage   = 1;
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
  document.getElementById('fc-' + f)?.classList.add('active');
  render();
}

// ── Detail Panel ──────────────────────────────────
function openPanel(appNo) {
  const a = getApps().find(x => x.appNo === appNo);
  if (!a) return;

  document.getElementById('panelName').textContent = a.name || appNo;

  const oapr = a.cet?.oapr || 0;
  const qr   = isQualified(a);
  const comp = getComposite(a);
  const req  = window.WMSU_COURSE_REQUIREMENTS?.[a.course];

  const cetHtml = a.cet ? `
    <div class="oapr-box">
      <span class="oapr-lbl">OAPR</span>
      <span class="oapr-val">${oapr} PR</span>
    </div>
    ${[['ep','English Proficiency'],['rc','Reading Comprehension'],['sps','Science Process Skills'],['qs','Quantitative Skills'],['ats','Abstract Thinking Skills']].map(([k, lbl]) => `
    <div class="cet-sub-row">
      <div class="cet-sub-lbl"><span>${lbl}</span><span class="cet-sub-val">${a.cet[k]}</span></div>
      <div class="cet-bar"><div class="cet-fill" style="width:${a.cet[k]}%;background:${a.cet[k] >= 50 ? 'var(--green)' : 'var(--cr)'}"></div></div>
    </div>`).join('')}
  ` : '<p style="font-size:12px;color:var(--muted)">No CET scores on record.</p>';

  const qualHtml = qr ? `
    <div class="qual-result-box ${qr.qualified ? 'pass' : 'fail'}">
      <div class="qt">${qr.qualified ? '✓ Applicant Qualifies' : '✗ Does Not Meet Requirements'}</div>
      ${qr.reasons.length
        ? `<div class="qr">${qr.reasons.map(r => `• ${r}`).join('<br>')}</div>`
        : req ? `<div class="qr">Meets all requirements for ${a.course}.<br><em>${req.note}</em></div>` : ''
      }
    </div>` : '';

  // Composite score section
  const compHtml = comp ? `
    <div class="panel-section">
      <div class="panel-sec-title">Composite Score (${comp.formula})</div>
      <div class="panel-row">
        <span class="panel-key">CET Component</span>
        <span class="panel-val">${comp.cetComponent} pts</span>
      </div>
      ${comp.natNormalized !== undefined ? `
      <div class="panel-row">
        <span class="panel-key">NAT Score (raw)</span>
        <span class="panel-val">${a.natScore} → ${comp.natNormalized} normalized</span>
      </div>
      <div class="panel-row">
        <span class="panel-key">NAT Component</span>
        <span class="panel-val">${comp.extraComponent} pts</span>
      </div>` : ''}
      ${comp.eatNormalized !== undefined ? `
      <div class="panel-row">
        <span class="panel-key">EAT Score (raw)</span>
        <span class="panel-val">${a.eatScore} → ${comp.eatNormalized} normalized</span>
      </div>
      <div class="panel-row">
        <span class="panel-key">EAT Component</span>
        <span class="panel-val">${comp.extraComponent} pts</span>
      </div>` : ''}
      <div class="panel-row" style="border-top:1px solid var(--border);padding-top:8px;margin-top:4px;">
        <span class="panel-key" style="font-weight:600;">Composite Score</span>
        <span class="panel-val" style="font-weight:700;font-size:15px;color:var(--blue);">${comp.composite} / 100</span>
      </div>
    </div>` : '';

  const extraHtml = (a.natScore || a.eatScore) ? `
    <div class="panel-section">
      <div class="panel-sec-title">Special Exam Scores</div>
      ${a.natScore ? `<div class="panel-row"><span class="panel-key">NAT Score</span><span class="panel-val" style="color:${a.natScore >= (req?.natMin || 260) ? 'var(--green)' : 'var(--cr)'}">${a.natScore}</span></div>` : ''}
      ${a.eatScore ? `<div class="panel-row"><span class="panel-key">EAT Score</span><span class="panel-val" style="color:${a.eatScore >= (req?.eatMin || 250) ? 'var(--green)' : 'var(--cr)'}">${a.eatScore}</span></div>` : ''}
    </div>` : '';

  const slotHtml = a.interviewSlot ? `
    <div class="panel-section">
      <div class="panel-sec-title">Assigned Interview Slot</div>
      <div class="panel-row">
        <span class="panel-key">Date</span>
        <span class="panel-val">${new Date(a.interviewSlot.date + 'T12:00').toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div class="panel-row">
        <span class="panel-key">Session</span>
        <span class="panel-val"><span class="sched-tag ${a.interviewSlot.session.toLowerCase()}">${a.interviewSlot.session}</span></span>
      </div>
      <div class="panel-row">
        <span class="panel-key">Time</span>
        <span class="panel-val">${a.interviewSlot.time}</span>
      </div>
      ${a.interviewNotes ? `<div class="panel-row"><span class="panel-key">Notes</span><span class="panel-val">${a.interviewNotes}</span></div>` : ''}
    </div>` : '';

  const evalHtml = a.interviewEval ? (() => {
    const ev      = a.interviewEval;
    const pct     = ev.percentage || Math.round(ev.totalScore / ev.maxScore * 100);
    const recClass = ev.recommendation.toLowerCase().replace(/\s+/g, '-');
    return `
    <div class="panel-section">
      <div class="panel-sec-title">Interview Evaluation</div>
      <div class="panel-eval-summary">
        <div class="panel-eval-score">${ev.totalScore}<span>/${ev.maxScore}</span></div>
        <div class="panel-eval-meta">
          <span class="rec-badge ${recClass}">${ev.recommendation}</span>
          <span class="panel-eval-pct">${pct}%</span>
        </div>
      </div>
      <div class="panel-row"><span class="panel-key">Interviewed by</span><span class="panel-val">${ev.interviewer}</span></div>
      ${ev.criteria.map(c => `
      <div class="panel-row">
        <span class="panel-key">${c.label}</span>
        <span class="panel-val">
          <span class="eval-mini-dots">
            ${Array.from({ length: c.max }, (_, i) =>
              `<span class="eval-mini-dot ${i < c.score ? 'filled' : ''}"></span>`
            ).join('')}
          </span>
          <span class="eval-score-num">${c.score}/${c.max}</span>
        </span>
      </div>`).join('')}
      ${ev.remarks ? `<div class="panel-eval-remarks">"${ev.remarks}"</div>` : ''}
    </div>`;
  })() : '';

  const rejectHtml = a.deptStatus === 'rejected' && a.rejectionReason ? `
    <div class="panel-section">
      <div class="panel-sec-title">Rejection</div>
      <div style="background:var(--red-pale);border:1px solid #fecaca;border-radius:8px;padding:11px 13px;font-size:12.5px;">
        <strong style="color:var(--red);">${a.rejectionReason}</strong>
        ${a.rejectionNotes ? `<div style="color:var(--muted);margin-top:4px;font-size:12px;">${a.rejectionNotes}</div>` : ''}
      </div>
    </div>` : '';

  const ds      = a.deptStatus;
  const dateStr = a.submittedDate ? new Date(a.submittedDate).toLocaleString('en-PH') : '—';

  document.getElementById('panelBody').innerHTML = `
    <div class="panel-section">
      <div class="panel-sec-title">Personal Info</div>
      <div class="panel-row"><span class="panel-key">App No.</span><span class="panel-val">${a.appNo}</span></div>
      <div class="panel-row"><span class="panel-key">Full Name</span><span class="panel-val">${a.name}</span></div>
      <div class="panel-row"><span class="panel-key">Type</span><span class="panel-val"><span class="type-tag ${a.applicantType}">${a.applicantType}</span></span></div>
      <div class="panel-row"><span class="panel-key">Email</span><span class="panel-val">${a.email || '—'}</span></div>
      <div class="panel-row"><span class="panel-key">Contact</span><span class="panel-val">${a.contact || '—'}</span></div>
      <div class="panel-row"><span class="panel-key">Course</span><span class="panel-val">${a.course || '—'}</span></div>
      <div class="panel-row"><span class="panel-key">Submitted</span><span class="panel-val">${dateStr}</span></div>
    </div>
    <div class="panel-section">
      <div class="panel-sec-title">CET Scores</div>
      ${cetHtml}
      ${qualHtml}
    </div>
    ${extraHtml}
    ${compHtml}
    ${slotHtml}
    ${evalHtml}
    ${rejectHtml}
    <div class="panel-actions">
      ${(!ds || ds === 'for_interview') ? `<button class="btn-panel btn-panel-accept" onclick="openActionModal('${a.appNo}','accept');closePanel()">Accept</button>` : ''}
      ${(ds !== 'rejected' && ds !== 'accepted') ? `<button class="btn-panel btn-panel-reject" onclick="openActionModal('${a.appNo}','reject');closePanel()">Reject</button>` : ''}
      ${ds === 'for_interview' ? `<button class="btn-panel btn-panel-interview" onclick="openActionModal('${a.appNo}','interview');closePanel()">Reschedule</button>` : ''}
    </div>`;

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

  const modalHd    = document.getElementById('modalHd');
  const modalTitle = document.getElementById('modalTitle');
  const body       = document.getElementById('modalBodyContent');

  const studentBox = `
    <div class="modal-student-box">
      <strong>${a.name}</strong>
      <span>${a.appNo} · ${a.course || '—'} · OAPR: ${a.cet?.oapr || '—'}</span>
    </div>`;

  // ── ACCEPT ───────────────────────────────────
  if (action === 'accept') {
    modalHd.className      = 'modal-hd accept-hd';
    modalTitle.textContent = 'Accept Applicant';

    const ev   = a.interviewEval;
    const comp = getComposite(a);

    const compDisplay = comp ? `
      <div class="eval-readonly-summary" style="margin-bottom:10px;padding:10px 12px;background:var(--blue-pale,#eff6ff);border-radius:8px;border:1px solid #bfdbfe;">
        <span style="font-size:12px;font-weight:600;color:var(--blue);">⊕ Composite Score: ${comp.composite} / 100</span>
        <span style="font-size:11px;color:var(--muted);margin-left:8px;">(${comp.formula})</span>
      </div>` : '';

    const slotInfo = a.interviewSlot ? `
      <div class="eval-slot-info">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Interviewed: ${new Date(a.interviewSlot.date + 'T12:00').toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })} · ${a.interviewSlot.session} · ${a.interviewSlot.time}
      </div>` : '';

    const evalDisplay = ev ? (() => {
      const pct      = ev.percentage || Math.round(ev.totalScore / ev.maxScore * 100);
      const recClass = ev.recommendation.toLowerCase().replace(/\s+/g, '-');
      return `
      <div class="eval-wrap">
        <div class="eval-wrap-hd">
          <span class="eval-wrap-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Interview Evaluation
          </span>
          <span class="eval-total">${ev.totalScore} / ${ev.maxScore} pts</span>
        </div>
        <div class="eval-readonly-summary">
          <span class="rec-badge ${recClass}">${ev.recommendation}</span>
          <span style="font-size:12px;color:var(--muted);margin-left:8px;">${pct}%</span>
          <span style="font-size:12px;color:var(--muted);margin-left:8px;">by ${ev.interviewer}</span>
        </div>
        <div class="eval-criteria-list">
          ${ev.criteria.map(c => `
          <div class="eval-row">
            <div class="eval-row-info">
              <span class="eval-row-label">${c.label}</span>
            </div>
            <div class="eval-dots" style="pointer-events:none;">
              ${Array.from({ length: c.max }, (_, i) => `
                <button type="button" class="eval-dot ${i < c.score ? 'filled' : ''}" disabled></button>
              `).join('')}
            </div>
            <span class="eval-dot-num ${c.score >= c.max * 0.7 ? 'high' : c.score >= c.max * 0.4 ? 'mid' : 'low'}">${c.score}/${c.max}</span>
          </div>`).join('')}
        </div>
        ${ev.remarks ? `<div class="eval-readonly-remarks">"${ev.remarks}"</div>` : ''}
      </div>`;
    })() : `
      <div class="sched-gate" style="padding:18px 16px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" style="color:var(--muted-lt)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="sched-gate-title" style="font-size:13px;">No Interview Evaluation Yet</div>
        <div class="sched-gate-sub">The interviewer hasn't submitted an evaluation for this applicant. You can still accept without one.</div>
      </div>`;

    body.innerHTML = `
      ${studentBox}
      ${compDisplay}
      ${slotInfo}
      ${evalDisplay}
      <div class="form-field" style="margin-top:12px;">
        <label>Acceptance Remarks <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
        <textarea id="acceptRemarks" rows="2" placeholder="e.g. Highly recommended — strong communication and clear motivation.">${a.acceptRemarks || ''}</textarea>
      </div>
      <div class="modal-alert" id="modalAlert"></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal()">Cancel</button>
        <button class="btn-confirm-accept" onclick="confirmAction()">Confirm Acceptance</button>
      </div>`;
  }

  // ── INTERVIEW (Reschedule) ─────────────────────
  if (action === 'interview') {
    modalHd.className      = 'modal-hd interview-hd';
    modalTitle.textContent = a.interviewSlot ? 'Reschedule Interview' : 'Schedule Interview';

    const cfg  = getScheduleConfig(currentDept);
    const slot = getNextAvailableSlot(currentDept);

    if (!cfg) {
      body.innerHTML = `
        ${studentBox}
        <div class="sched-gate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" style="color:var(--muted-lt)"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>
          <div class="sched-gate-title">Schedule Not Configured</div>
          <div class="sched-gate-sub">Configure your interview schedule first to enable automatic slot assignment.</div>
          <button class="btn-setup-sched" onclick="closeModal();openScheduleSetup()">Configure Schedule</button>
        </div>
        <div class="modal-footer"><button class="btn-cancel" onclick="closeModal()">Cancel</button></div>`;
    } else if (!slot) {
      const occ         = getSlotOccupancy(currentDept);
      const totalSlots  = cfg.days.length * (cfg.amCapacity + cfg.pmCapacity);
      const totalFilled = Object.values(occ).reduce((s, n) => s + n, 0);
      body.innerHTML = `
        ${studentBox}
        <div class="sched-gate sched-gate-warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" style="color:var(--amber)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="sched-gate-title" style="color:var(--amber)">All Interview Slots Filled</div>
          <div class="sched-gate-sub">${totalFilled} of ${totalSlots} slots are taken. Add more days or increase capacity.</div>
          <button class="btn-setup-sched" onclick="closeModal();openScheduleSetup()">Extend Schedule</button>
        </div>
        <div class="modal-footer"><button class="btn-cancel" onclick="closeModal()">Cancel</button></div>`;
    } else {
      const occ      = getSlotOccupancy(currentDept);
      const slotKey  = `${slot.date}_${slot.session}`;
      const filled   = occ[slotKey] || 0;
      const cap      = slot.session === 'AM' ? cfg.amCapacity : cfg.pmCapacity;
      const endTime  = slot.session === 'AM' ? cfg.amEnd : cfg.pmEnd;
      const dayIndex = cfg.days.findIndex(d => d.date === slot.date) + 1;
      const dateLabel = new Date(slot.date + 'T12:00').toLocaleDateString('en-PH', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      });
      const slotPct = Math.round((filled + 1) / cap * 100);

      const currentSlotNote = a.interviewSlot ? `
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;padding:8px 12px;background:var(--bg-alt,#f8fafc);border-radius:6px;">
          Current slot: ${new Date(a.interviewSlot.date + 'T12:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · ${a.interviewSlot.session} · ${a.interviewSlot.time}
        </div>` : '';

      body.innerHTML = `
        ${studentBox}
        ${currentSlotNote}
        <div class="auto-slot-card">
          <div class="auto-slot-top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Next Available Slot · Day ${dayIndex}</span>
            <span class="sched-tag ${slot.session.toLowerCase()}">${slot.session}</span>
          </div>
          <div class="auto-slot-date">${dateLabel}</div>
          <div class="auto-slot-time">${slot.time} – ${endTime}</div>
          <div class="auto-slot-bar-wrap">
            <div class="auto-slot-bar-track">
              <div class="auto-slot-bar-fill" style="width:${slotPct}%"></div>
            </div>
            <span class="auto-slot-count">${filled + 1} / ${cap} students</span>
          </div>
        </div>
        <p class="auto-slot-note">Slot assigned to the next available position in your configured schedule.</p>
        <div class="form-field">
          <label>Notes to Applicant <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
          <textarea id="interviewNotes" rows="2" placeholder="e.g. Bring original documents. Wear semi-formal attire.">${a.interviewNotes || ''}</textarea>
        </div>
        <div class="modal-alert" id="modalAlert"></div>
        <div class="modal-footer">
          <button class="btn-cancel" onclick="closeModal()">Cancel</button>
          <button class="btn-confirm-interview" onclick="confirmAction()">Confirm Schedule</button>
        </div>`;
      body.setAttribute('data-slot', JSON.stringify(slot));
    }
  }

  // ── REJECT ────────────────────────────────────
  if (action === 'reject') {
    modalHd.className      = 'modal-hd reject-hd';
    modalTitle.textContent = 'Reject Application';
    body.innerHTML = `
      ${studentBox}
      <div class="form-field">
        <label>Reason for Rejection</label>
        <select id="rejectionReason">
          <option value="">Select a reason…</option>
          <option value="OAPR does not meet the minimum requirement for this course">OAPR below minimum requirement</option>
          <option value="NAT score does not meet the minimum requirement">NAT score below minimum (Nursing)</option>
          <option value="EAT score does not meet the minimum requirement">EAT score below minimum (Engineering)</option>
          <option value="Composite score does not meet the cutoff">Composite score below cutoff</option>
          <option value="No available slots for this program">No available slots for this program</option>
          <option value="Incomplete or invalid application documents">Incomplete or invalid documents</option>
          <option value="Did not appear for scheduled interview">Did not appear for interview</option>
          <option value="Failed interview evaluation">Failed interview evaluation</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-field">
        <label>Additional Notes <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
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

// ── Close / confirm modal ─────────────────────────
function closeModal() {
  document.getElementById('actionModal').classList.remove('open');
  activeAppNo  = null;
  activeAction = null;
  Object.keys(_scores).forEach(k => delete _scores[k]);
}

function confirmAction() {
  const alertEl = document.getElementById('modalAlert');
  const apps    = getApps();
  const idx     = apps.findIndex(a => a.appNo === activeAppNo);
  if (idx === -1) { closeModal(); return; }
  const a = apps[idx];

  // ── ACCEPT ───────────────────────────────────
  if (activeAction === 'accept') {
    apps[idx].deptStatus    = 'accepted';
    apps[idx].status        = 'reviewed';
    apps[idx].acceptedDate  = new Date().toISOString();
    apps[idx].courseLocked  = true;
    apps[idx].acceptRemarks = document.getElementById('acceptRemarks')?.value.trim() || '';
    saveApps(apps);
    closeModal(); renderKPIs(); render();
    showToast(`${a.name} has been accepted.`, 'success');
    return;
  }

  // ── INTERVIEW (Reschedule) ────────────────────
  if (activeAction === 'interview') {
    const body     = document.getElementById('modalBodyContent');
    const slotData = body?.getAttribute('data-slot');
    if (!slotData) { closeModal(); return; }
    const slot               = JSON.parse(slotData);
    apps[idx].deptStatus     = 'for_interview';
    apps[idx].interviewSlot  = slot;
    apps[idx].interviewNotes = document.getElementById('interviewNotes')?.value.trim() || '';
    saveApps(apps);
    closeModal(); renderKPIs(); renderScheduleCard(); render();
    const dateLabel = new Date(slot.date + 'T12:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
    showToast(`${a.name} rescheduled → ${dateLabel} · ${slot.session} · ${slot.time}`, 'info');
    return;
  }

  // ── REJECT ────────────────────────────────────
  if (activeAction === 'reject') {
    const reason = document.getElementById('rejectionReason')?.value;
    if (!reason) {
      alertEl.textContent = 'Please select a rejection reason.';
      alertEl.className   = 'modal-alert show err';
      return;
    }
    apps[idx].deptStatus      = 'rejected';
    apps[idx].rejectionReason = reason;
    apps[idx].rejectionNotes  = document.getElementById('rejectionNotes')?.value.trim() || '';
    apps[idx].rejectedDate    = new Date().toISOString();
    saveApps(apps);
    closeModal(); renderKPIs(); render();
    showToast(`Application of ${a.name} rejected.`, 'error');
    return;
  }
}

// ── Toast ─────────────────────────────────────────
function showToast(msg, type = '') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'toast' + (type ? ' ' + type : '');
  d.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>${msg}`;
  c.appendChild(d);
  setTimeout(() => d.remove(), 3800);
}

// ── Overlay close listeners ───────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('actionModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('actionModal')) closeModal();
  });
  document.getElementById('schedSetupModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('schedSetupModal')) closeScheduleSetup();
  });
  document.getElementById('detailPanel')?.addEventListener('click', e => {
    if (e.target === document.getElementById('detailPanel')) closePanel();
  });
});

// ── Init ──────────────────────────────────────────
function init() {
  const lastDept = sessionStorage.getItem('wmsu_dept_head_dept');
  if (lastDept) {
    const sel = document.getElementById('deptSelect');
    if (sel) sel.value = lastDept;
    setDept(lastDept);
  }
  setInterval(() => {
    if (currentDept) {
      renderKPIs();
      render();
      renderScheduleCard();
    }
  }, 15000);
}

function waitAndInit() {
  if (window.WMSU_CET_DB && window.WMSU_COURSE_REQUIREMENTS) {
    setTimeout(init, 350);
  } else {
    setTimeout(waitAndInit, 100);
  }
}

const deptSelectEl = document.getElementById('deptSelect');
if (deptSelectEl) {
  deptSelectEl.addEventListener('change', () => {
    const v = deptSelectEl.value;
    if (v) sessionStorage.setItem('wmsu_dept_head_dept', v);
    setDept(v);
  });
}

waitAndInit();