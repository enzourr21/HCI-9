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
 *  - Numeric ID (e.g. 2021-00001) or any other @wmsu.edu.ph → Student
 */

// ─── EMAIL → ROLE MAP ─────────────────────────────────────────
// Key: exact local part (before @wmsu.edu.ph), lowercased
const EMAIL_ROLE_MAP = {
  registrar:  'REGISTRAR',
  adviser:    'ADVISER',
  depthead:   'DEPTHEAD',
  admission:  'ADMISSION',
  assessment: 'ASSESSMENT',
  misto:      'MISTO',
  dean:       'DEAN',
  secretary:  'SECRETARY',
};

// ─── ROLE CONFIG ──────────────────────────────────────────────
const ROLES = {
  REGISTRAR: {
    label:    'Registrar / Super Admin',
    emoji:    '🏛️',
    title:    'Registrar Portal',
    sub:      'Super Admin access.',
    badge:    'Super Admin',
    redirect: '../users/registrar/registrar.html',
  },
  ADVISER: {
    label:    'Adviser',
    emoji:    '👨‍🏫',
    title:    'Adviser Portal',
    sub:      'Advisory & student records.',
    badge:    'Adviser',
    redirect: '../users/adviser/adviser.html',
  },
  DEPTHEAD: {
    label:    'Department Head',
    emoji:    '🏢',
    title:    'Department Head Portal',
    sub:      'Department management.',
    badge:    'Dept. Head',
    redirect: '../users/depthead/dept-head.html',
  },
  ADMISSION: {
    label:    'Admission Office',
    emoji:    '📋',
    title:    'Admission Portal',
    sub:      'Applicant & admission records.',
    badge:    'Admission',
    redirect: '../users/admission/admission.html',
  },
  ASSESSMENT: {
    label:    'Assessment Office',
    emoji:    '💰',
    title:    'Assessment Portal',
    sub:      'Fees & assessment records.',
    badge:    'Assessment',
    redirect: '../users/assessment/assessment.html',
  },
  MISTO: {
    label:    'MIS-TO',
    emoji:    '💻',
    title:    'MIS-TO Portal',
    sub:      'System & technical operations.',
    badge:    'MIS-TO',
    redirect: '../users/misto/misto.html',
  },
  DEAN: {
    label:    'Dean',
    emoji:    '🎩',
    title:    'Dean Portal',
    sub:      'College administration.',
    badge:    'Dean',
    redirect: '../users/dean/dean.html',
  },
  SECRETARY: {
    label:    'Secretary',
    emoji:    '📁',
    title:    'Secretary Portal',
    sub:      'Records & correspondence.',
    badge:    'Secretary',
    redirect: '../users/secretary/secretary.html',
  },
  STUDENT: {
    label:    'Student',
    emoji:    '🎓',
    title:    'Student Portal',
    sub:      'Enrollment & records.',
    badge:    'Student Portal',
    redirect: '../users/old student/old-student.html',
  },
  UNKNOWN: {
    label:    '',
    emoji:    '🎓',
    title:    'Sign In',
    sub:      'Enter your WMSU credentials to continue.',
    badge:    'WMSU Portal',
    redirect: null,
  },
};

// ─── ROLE DETECTION ───────────────────────────────────────────
function detectRole(value) {
  const v = value.trim().toLowerCase();

  if (!v) return 'UNKNOWN';

  // Numeric student ID: e.g. 2021-00001 or 202100001
  if (/^\d{4}-?\d{4,6}$/.test(v)) return 'STUDENT';

  // Must be a WMSU email from here on
  if (!v.endsWith('@wmsu.edu.ph')) return 'UNKNOWN';

  const local = v.split('@')[0]; // part before @

  // Exact match against the email-role map
  if (EMAIL_ROLE_MAP[local]) return EMAIL_ROLE_MAP[local];

  // Any other @wmsu.edu.ph email → Student
  return 'STUDENT';
}

// ─── DOM REFS ─────────────────────────────────────────────────
const loginId       = document.getElementById('loginId');
const loginPassword = document.getElementById('loginPassword');
const loginForm     = document.getElementById('loginForm');
const loginAlert    = document.getElementById('loginAlert');
const roleIndicator = document.getElementById('roleIndicator');
const roleLabel     = document.getElementById('roleLabel');
const roleBadge     = document.getElementById('roleBadge');
const cardEmoji     = document.getElementById('cardEmoji');
const cardTitle     = document.getElementById('cardTitle');
const cardSub       = document.getElementById('cardSub');
const idHint        = document.getElementById('idHint');
const togglePw      = document.getElementById('togglePw');

// ─── ROLE DETECTION ───────────────────────────────────────────

// ─── UI UPDATE ────────────────────────────────────────────────
function applyRole(roleKey) {
  const role = ROLES[roleKey];

  cardEmoji.textContent = role.emoji;
  cardTitle.textContent = role.title;
  cardSub.textContent   = role.sub;
  roleBadge.textContent = role.badge;

  if (roleKey === 'UNKNOWN') {
    roleIndicator.style.display = 'none';
    roleLabel.textContent = '';
    idHint.textContent = '';
  } else {
    roleIndicator.style.display = 'flex';
    roleLabel.textContent = 'Detected: ' + role.label;

    // Remove all role classes, add the current one
    roleIndicator.className = 'role-indicator role-' + roleKey.toLowerCase();

    if (roleKey === 'STUDENT') {
      idHint.textContent = 'Student ID or @wmsu.edu.ph email accepted.';
    } else {
      idHint.textContent = '';
    }
  }
}

// ─── LIVE DETECTION ON INPUT ──────────────────────────────────
loginId.addEventListener('input', () => {
  const role = detectRole(loginId.value);
  applyRole(role);
  hideAlert();
});

// ─── SHOW / HIDE ALERT ────────────────────────────────────────
function showAlert(msg) {
  loginAlert.textContent = msg;
  loginAlert.style.display = 'block';
}

function hideAlert() {
  loginAlert.style.display = 'none';
  loginAlert.textContent = '';
}

// ─── PASSWORD TOGGLE ─────────────────────────────────────────
togglePw.addEventListener('click', () => {
  const isPassword = loginPassword.type === 'password';
  loginPassword.type = isPassword ? 'text' : 'password';
  togglePw.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  // Swap icon fill to indicate state
  togglePw.style.opacity = isPassword ? '1' : '0.45';
});

// ─── FORM SUBMIT ─────────────────────────────────────────────
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideAlert();

  const id  = loginId.value.trim();
  const pwd = loginPassword.value;

  // Basic validation
  if (!id) {
    showAlert('Please enter your Student ID or WMSU email.');
    loginId.focus();
    return;
  }
  if (!pwd) {
    showAlert('Please enter your password.');
    loginPassword.focus();
    return;
  }

  const roleKey = detectRole(id);

  if (roleKey === 'UNKNOWN') {
    showAlert('Enter a valid WMSU email (@wmsu.edu.ph) or Student ID (e.g. 2021-00001).');
    loginId.focus();
    return;
  }

  // ── TODO: Replace with real authentication API call ──────────
  // Example:
  //   const res = await fetch('/api/login', { method:'POST', body: JSON.stringify({id, pwd}) });
  //   const data = await res.json();
  //   if (!data.ok) { showAlert(data.message); return; }
  //
  // For now, redirect directly (mock):
  const redirect = ROLES[roleKey].redirect;
  if (redirect) {
    window.location.href = redirect;
  }
});

// ─── REMEMBER ME ─────────────────────────────────────────────
const rememberMe = document.getElementById('rememberMe');

// Restore remembered ID on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('wmsu_remember_id');
  if (saved) {
    loginId.value = saved;
    rememberMe.checked = true;
    applyRole(detectRole(saved));
  }
});

loginForm.addEventListener('submit', () => {
  if (rememberMe.checked) {
    localStorage.setItem('wmsu_remember_id', loginId.value.trim());
  } else {
    localStorage.removeItem('wmsu_remember_id');
  }
});