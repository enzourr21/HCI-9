/**
 * shiftee.js
 * Handles all logic for the Shiftee Portal.
 *
 * Responsibilities:
 *  - Populate navbar chip, profile header, and info grid
 *  - Render the program transfer section
 *  - Apply the correct status banner state
 *  - Drive the progress track highlight (step states)
 */

// ─── SHIFTEE DATA ─────────────────────────────────────────────
// TODO: Replace with a real API call / session data
const SHIFTEE = {
    firstName:      'Maria',
    lastName:       'Santos',
    middleName:     'Reyes',
    studentId:      '2023-005678',
    yearLevel:      '2nd Year',
    dob:            'March 22, 2004',
    sex:            'Female',
    contact:        '09187654321',
    email:          '2023005678@wmsu.edu.ph',

    // Current program
    fromCode:       'BSIT',
    fromName:       'Bachelor of Science in Information Technology',
    fromCollege:    'College of Computing Studies',

    // Target program
    toCode:         'BSCS',
    toName:         'Bachelor of Science in Computer Science',
    toCollege:      'College of Computing Studies',

    // Application details
    // Statuses: 'submitted' | 'under_review' | 'dept_approved' | 'dean_approved' | 'confirmed' | 'rejected'
    status:         'under_review',
    dateFiled:      'April 28, 2025',
    lastUpdated:    'April 29, 2025',
    remarks:        'Documents are under review by the Department Head. Please ensure all required documents are complete and properly signed before proceeding to the next stage.',
};

// ─── STATUS CONFIG ────────────────────────────────────────────
const STATUS_CONFIG = {
    submitted: {
        label:      'Application Submitted',
        desc:       'Your shifting application has been received. Pending document review.',
        bannerClass: '',
        badgeClass:  'yellow',
        badgeLabel:  'Submitted',
        step:       1,
    },
    under_review: {
        label:      'Application Under Review',
        desc:       'Filed on {date}. Currently at Document Review stage.',
        bannerClass: '',
        badgeClass:  'yellow',
        badgeLabel:  'Under Review',
        step:       2,
    },
    dept_approved: {
        label:      'Approved by Department Head',
        desc:       'Forwarded to the Dean\'s Office for endorsement.',
        bannerClass: '',
        badgeClass:  'yellow',
        badgeLabel:  'Dept. Approved',
        step:       3,
    },
    dean_approved: {
        label:      'Approved by Dean',
        desc:       'Endorsement received. Awaiting Registrar final confirmation.',
        bannerClass: 'status-approved',
        badgeClass:  'yellow',
        badgeLabel:  'Dean Approved',
        step:       4,
    },
    confirmed: {
        label:      'Shift Confirmed',
        desc:       'Your program shift has been officially confirmed by the Registrar.',
        bannerClass: 'status-approved',
        badgeClass:  'green',
        badgeLabel:  'Confirmed',
        step:       5,
    },
    rejected: {
        label:      'Application Rejected',
        desc:       'Your shifting application was not approved. Please see the remarks below.',
        bannerClass: 'status-rejected',
        badgeClass:  'red',
        badgeLabel:  'Rejected',
        step:       0,
    },
};

// ─── HELPERS ──────────────────────────────────────────────────
function getInitials(first, last) {
    return ((first[0] || '') + (last[0] || '')).toUpperCase();
}

function getEl(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const el = getEl(id);
    if (el) el.textContent = value;
}

// ─── POPULATE NAVBAR CHIP ─────────────────────────────────────
function populateChip() {
    const initials = getInitials(SHIFTEE.firstName, SHIFTEE.lastName);
    setText('chipAvatar', initials);
    setText('chipName', SHIFTEE.firstName + ' ' + SHIFTEE.lastName);
    // chipMeta is already "Shiftee" in the HTML; no change needed
}

// ─── POPULATE PROFILE HEADER ──────────────────────────────────
function populateProfileHeader() {
    const initials = getInitials(SHIFTEE.firstName, SHIFTEE.lastName);
    const cfg      = STATUS_CONFIG[SHIFTEE.status] || STATUS_CONFIG.submitted;

    setText('profileAvatar', initials);
    setText('profileName', SHIFTEE.lastName + ', ' + SHIFTEE.firstName + ' ' + SHIFTEE.middleName);
    setText('profileSub', SHIFTEE.studentId + ' \u2022 ' + SHIFTEE.yearLevel + ' \u2022 ' + SHIFTEE.fromCollege);

    // Update header badge dynamically
    const profileBadge = document.querySelector('.profile-header .badge');
    if (profileBadge) {
        profileBadge.className = 'badge ' + cfg.badgeClass;
        profileBadge.textContent = 'Shifting Application — ' + cfg.badgeLabel;
    }
}

// ─── POPULATE PROGRAM TRANSFER ────────────────────────────────
function populateProgramTransfer() {
    setText('fromCode',    SHIFTEE.fromCode);
    setText('fromName',    SHIFTEE.fromName);
    setText('fromCollege', SHIFTEE.fromCollege);
    setText('toCode',      SHIFTEE.toCode);
    setText('toName',      SHIFTEE.toName);
    setText('toCollege',   SHIFTEE.toCollege);
}

// ─── POPULATE INFO GRID ───────────────────────────────────────
function populateInfoGrid() {
    setText('viewStudentId', SHIFTEE.studentId);
    setText('viewYear',      SHIFTEE.yearLevel);
    setText('viewDateFiled', SHIFTEE.dateFiled);
    setText('viewContact',   SHIFTEE.contact);
    setText('viewEmail',     SHIFTEE.email);
    setText('viewStatus',    (STATUS_CONFIG[SHIFTEE.status] || {}).badgeLabel || SHIFTEE.status);
}

// ─── APPLY STATUS BANNER ─────────────────────────────────────
function applyStatusBanner() {
    const cfg    = STATUS_CONFIG[SHIFTEE.status] || STATUS_CONFIG.submitted;
    const banner = getEl('shiftStatusBanner');
    const title  = getEl('shiftStatusTitle');
    const desc   = getEl('shiftStatusDesc');

    if (!banner) return;

    // Reset modifier classes then apply the right one
    banner.className = 'shift-status-banner';
    if (cfg.bannerClass) banner.classList.add(cfg.bannerClass);

    if (title) title.textContent = cfg.label;

    if (desc) {
        const text = cfg.desc.replace('{date}', '<strong>' + SHIFTEE.dateFiled + '</strong>');
        desc.innerHTML = text;
    }
}

// ─── POPULATE REMARKS ─────────────────────────────────────────
function populateRemarks() {
    setText('remarksText', SHIFTEE.remarks);
    setText('remarksDate', 'Last updated: ' + SHIFTEE.lastUpdated);
}

// ─── DRIVE PROGRESS TRACK ────────────────────────────────────
/**
 * The progress track has 5 .progress-step elements in order.
 * Steps before activeStep  → keep crimson (done)
 * Step at activeStep       → keep crimson (active / current)
 * Steps after activeStep   → add .gray class to circle + line
 */
function applyProgressTrack() {
    const cfg        = STATUS_CONFIG[SHIFTEE.status] || STATUS_CONFIG.submitted;
    const activeStep = cfg.step; // 1-indexed; 0 = rejected (all gray)

    const steps   = document.querySelectorAll('.progress-track .progress-step');
    const circles = document.querySelectorAll('.progress-track .progress-circle');
    const lines   = document.querySelectorAll('.progress-track .step-line');

    circles.forEach((circle, i) => {
        const stepNum = i + 1; // 1-indexed
        if (activeStep === 0 || stepNum > activeStep) {
            circle.classList.add('gray');
            steps[i] && steps[i].classList.add('gray');
        } else {
            circle.classList.remove('gray');
            steps[i] && steps[i].classList.remove('gray');
        }
    });

    lines.forEach((line, i) => {
        const nextStep = i + 2; // line[0] connects step1→step2
        if (activeStep === 0 || nextStep > activeStep) {
            line.classList.add('gray');
        } else {
            line.classList.remove('gray');
        }
    });
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    populateChip();
    populateProfileHeader();
    populateProgramTransfer();
    populateInfoGrid();
    applyStatusBanner();
    populateRemarks();
    applyProgressTrack();
});