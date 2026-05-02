/**
 * WMSU-Ease Unified Login
 * Detects role from email/ID and routes accordingly.
 *
 * Role Detection Rules:
 *  - registrar@wmsu.edu.ph   → Registrar (Super Admin)
 *  - adviser@wmsu.edu.ph     → Adviser
 *  - depthead@wmsu.edu.ph    → Department Head
 *  - admission@wmsu.edu.ph   → Admission
 *  - assessment@wmsu.edu.ph  → Assessment
 *  - misto@wmsu.edu.ph       → MIS-TO
 *  - dean@wmsu.edu.ph        → Dean
 *  - secretary@wmsu.edu.ph   → Secretary
 *  - shiftee@wmsu.edu.ph     → Shiftee
 *  - Numeric ID or any other @wmsu.edu.ph → Student
 */

// ─── SVG ICON STRINGS ────────────────────────────────────────
// Each returns an inline SVG string used by applyRole()
const ICONS = {
  // Graduation cap — Student / default
  STUDENT: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>`,

  // Building / landmark — Registrar
  REGISTRAR: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>`,

  // Book-open — Adviser
  ADVISER: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`,

  // Layers — Department Head
  DEPTHEAD: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>`,

  // Clipboard — Admission
  ADMISSION: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
    <line x1="9" y1="16" x2="13" y2="16"/>
  </svg>`,

  // Calculator — Assessment
  ASSESSMENT: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="8" y2="10"/>
    <line x1="12" y1="10" x2="12" y2="10"/>
    <line x1="16" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="8" y2="14"/>
    <line x1="12" y1="14" x2="12" y2="14"/>
    <line x1="16" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="12" y2="18"/>
    <line x1="16" y1="18" x2="16" y2="18"/>
  </svg>`,

  // Monitor — MIS-TO
  MISTO: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>`,

  // Award — Dean
  DEAN: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>`,

  // File-text — Secretary
  SECRETARY: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>`,

  // Shuffle/transfer arrows — Shiftee
  SHIFTEE: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>`,

  // Same as student for UNKNOWN default
  UNKNOWN: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>`,
};

// Small icons for the role indicator pill (16px)
const ICONS_SM = {
  STUDENT:    `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  REGISTRAR:  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><polygon points="12 2 20 7 4 7"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/></svg>`,
  ADVISER:    `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  DEPTHEAD:   `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  ADMISSION:  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  ASSESSMENT: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
  MISTO:      `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  DEAN:       `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  SECRETARY:  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  SHIFTEE:    `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
};

// ─── EMAIL → ROLE MAP ─────────────────────────────────────────
const EMAIL_ROLE_MAP = {
  registrar:  'REGISTRAR',
  adviser:    'ADVISER',
  depthead:   'DEPTHEAD',
  admission:  'ADMISSION',
  assessment: 'ASSESSMENT',
  misto:      'MISTO',
  dean:       'DEAN',
  secretary:  'SECRETARY',
  shiftee:    'SHIFTEE',
};

// ─── ROLE CONFIG ──────────────────────────────────────────────
const ROLES = {
  REGISTRAR:  { label: 'Registrar / Super Admin', title: 'Registrar Portal',      sub: 'Super Admin access.',             badge: 'Super Admin',    redirect: '../users/registrar/registrar.html' },
  ADVISER:    { label: 'Adviser',                 title: 'Adviser Portal',         sub: 'Advisory & student records.',     badge: 'Adviser',        redirect: '../users/adviser/adviser.html' },
  DEPTHEAD:   { label: 'Department Head',         title: 'Department Head Portal', sub: 'Department management.',          badge: 'Dept. Head',     redirect: '../users/depthead/dept-head.html' },
  ADMISSION:  { label: 'Admission Office',        title: 'Admission Portal',       sub: 'Applicant & admission records.',  badge: 'Admission',      redirect: '../users/admission/admission.html' },
  ASSESSMENT: { label: 'Assessment Office',       title: 'Assessment Portal',      sub: 'Fees & assessment records.',      badge: 'Assessment',     redirect: '../users/assessment/assessment.html' },
  MISTO:      { label: 'MIS-TO',                  title: 'MIS-TO Portal',          sub: 'System & technical operations.',  badge: 'MIS-TO',         redirect: '../users/misto/misto.html' },
  DEAN:       { label: 'Dean',                    title: 'Dean Portal',            sub: 'College administration.',         badge: 'Dean',           redirect: '../users/dean/dean.html' },
  SECRETARY:  { label: 'Secretary',               title: 'Secretary Portal',       sub: 'Records & correspondence.',       badge: 'Secretary',      redirect: '../users/secretary/secretary.html' },
  SHIFTEE:    { label: 'Shiftee',                 title: 'Shiftee Portal',         sub: 'Program shifting & transfer records.', badge: 'Shiftee',   redirect: '../users/shiftee/shiftee.html' },
  STUDENT:    { label: 'Student',                 title: 'Student Portal',         sub: 'Enrollment & records.',           badge: 'Student Portal', redirect: '../users/old student/old-student.html' },
  UNKNOWN:    { label: '',                        title: 'Sign In',                sub: 'Enter your WMSU credentials to continue.', badge: 'WMSU Portal', redirect: null },
};

// ─── ROLE DETECTION ───────────────────────────────────────────
function detectRole(value) {
  const v = value.trim().toLowerCase();
  if (!v) return 'UNKNOWN';
  if (/^\d{4}-?\d{4,6}$/.test(v)) return 'STUDENT';
  if (!v.endsWith('@wmsu.edu.ph')) return 'UNKNOWN';
  const local = v.split('@')[0];
  if (EMAIL_ROLE_MAP[local]) return EMAIL_ROLE_MAP[local];
  return 'STUDENT';
}

// ─── DOM REFS ─────────────────────────────────────────────────
const loginId       = document.getElementById('loginId');
const loginPassword = document.getElementById('loginPassword');
const loginForm     = document.getElementById('loginForm');
const loginAlert    = document.getElementById('loginAlert');
const roleIndicator = document.getElementById('roleIndicator');
const roleLabel     = document.getElementById('roleLabel');
const roleIconEl    = document.getElementById('roleIcon');
const roleBadge     = document.getElementById('roleBadge');
const cardIcon      = document.getElementById('cardIcon');
const cardTitle     = document.getElementById('cardTitle');
const cardSub       = document.getElementById('cardSub');
const idHint        = document.getElementById('idHint');
const togglePw      = document.getElementById('togglePw');
const eyeOpen       = document.getElementById('eyeOpen');
const eyeOff        = document.getElementById('eyeOff');
const rememberMe    = document.getElementById('rememberMe');

// ─── UI UPDATE ────────────────────────────────────────────────
function applyRole(roleKey) {
  const role = ROLES[roleKey];

  // Swap card header icon
  cardIcon.innerHTML = ICONS[roleKey] || ICONS.UNKNOWN;
  cardTitle.textContent = role.title;
  cardSub.textContent   = role.sub;
  roleBadge.textContent = role.badge;

  if (roleKey === 'UNKNOWN') {
    roleIndicator.style.display = 'none';
    idHint.textContent = '';
  } else {
    roleIndicator.style.display = 'flex';
    roleIndicator.className = 'role-indicator role-' + roleKey.toLowerCase();
    roleIconEl.innerHTML = ICONS_SM[roleKey] || '';
    roleLabel.textContent = 'Detected: ' + role.label;
    idHint.textContent = roleKey === 'STUDENT'
      ? 'Student ID or @wmsu.edu.ph email accepted.'
      : '';
  }
}

// ─── LIVE DETECTION ───────────────────────────────────────────
loginId.addEventListener('input', () => {
  applyRole(detectRole(loginId.value));
  hideAlert();
});

// ─── ALERT ────────────────────────────────────────────────────
function showAlert(msg) {
  loginAlert.textContent = msg;
  loginAlert.style.display = 'block';
}
function hideAlert() {
  loginAlert.style.display = 'none';
  loginAlert.textContent = '';
}

// ─── PASSWORD TOGGLE ──────────────────────────────────────────
togglePw.addEventListener('click', () => {
  const isPassword = loginPassword.type === 'password';
  loginPassword.type = isPassword ? 'text' : 'password';
  eyeOpen.style.display = isPassword ? 'none'  : 'block';
  eyeOff.style.display  = isPassword ? 'block' : 'none';
  togglePw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

// ─── FORM SUBMIT ──────────────────────────────────────────────
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideAlert();

  const id  = loginId.value.trim();
  const pwd = loginPassword.value;

  if (!id)  { showAlert('Please enter your Student ID or WMSU email.'); loginId.focus(); return; }
  if (!pwd) { showAlert('Please enter your password.'); loginPassword.focus(); return; }

  const roleKey = detectRole(id);

  if (roleKey === 'UNKNOWN') {
    showAlert('Enter a valid WMSU email (@wmsu.edu.ph) or Student ID (e.g. 2021-00001).');
    loginId.focus();
    return;
  }

  // Remember Me
  if (rememberMe.checked) {
    localStorage.setItem('wmsu_remember_id', id);
  } else {
    localStorage.removeItem('wmsu_remember_id');
  }

  // ── TODO: Replace with real auth API call ─────────────────
  const redirect = ROLES[roleKey].redirect;
  if (redirect) window.location.href = redirect;
});

// ─── RESTORE REMEMBERED ID ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('wmsu_remember_id');
  if (saved) {
    loginId.value      = saved;
    rememberMe.checked = true;
    applyRole(detectRole(saved));
  }
});