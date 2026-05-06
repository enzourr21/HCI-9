// ─────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────

function escHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;");
}

function getInitials(name) {
    return (name || '??').split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className   = "correction-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("visible"));
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ─────────────────────────────────────────────────────────────
// LOCALSTORAGE HELPERS
// ─────────────────────────────────────────────────────────────

function getApps() {
    try { return JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); }
    catch(e) { return []; }
}

function saveApps(arr) {
    localStorage.setItem('wmsu_applications', JSON.stringify(arr));
}

// ─────────────────────────────────────────────────────────────
// ADVISER CONFIG
// This adviser handles BSCS freshmen under CCS only.
// ─────────────────────────────────────────────────────────────
const ADVISER_DEPT    = 'College of Computing Studies';
const ADVISER_PROGRAM = 'BS Computer Science';   // ← BSCS only, not BSIT
const ADVISER_NAME    = 'Dr. Ana Dizon';

/**
 * Returns students this adviser is responsible for:
 * - department === CCS
 * - course === BS Computer Science  (not BSIT, not ACT)
 * - deptStatus === 'accepted' (dept head already approved)
 * - not yet recalled by adviser
 */
function getAcceptedStudents() {
    return getApps().filter(a =>
        a.department === ADVISER_DEPT &&
        a.course     === ADVISER_PROGRAM &&
        a.deptStatus === 'accepted' &&
        a.adviserStatus !== 'recalled'
    );
}

function getSubmittedToAssessment() {
    return getApps().filter(a =>
        a.department    === ADVISER_DEPT &&
        a.course        === ADVISER_PROGRAM &&
        a.adviserStatus === 'submitted'
    );
}

function getCorrectionStudents() {
    return getApps().filter(a =>
        a.department    === ADVISER_DEPT &&
        a.course        === ADVISER_PROGRAM &&
        a.adviserStatus === 'for_correction'
    );
}


// =============================================================
// SECTION 1 — ADVISER DASHBOARD
// Shows BSCS-accepted students; adviser assigns subjects then
// forwards to Assessment Office
// =============================================================

function initAdviserDashboard() {
    if (!document.getElementById("student-list")) return;

    let activeFilter  = 'all';
    let proceedTarget = null;

    // ── RENDER STUDENT CARDS ──────────────────────────────────
    function renderStudentList() {
        const students   = getAcceptedStudents();
        const container  = document.getElementById("student-list");
        const emptyState = document.getElementById("dashEmptyState");

        let filtered = students;
        if (activeFilter === 'form_submitted') {
            filtered = students.filter(s => s.enrolledSubjects && s.enrolledSubjects.length > 0);
        } else if (activeFilter === 'awaiting_form') {
            filtered = students.filter(s => !s.enrolledSubjects || s.enrolledSubjects.length === 0);
        }

        updateQuickStats(students);

        if (filtered.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = filtered.map(s => buildStudentCard(s)).join('');

        // View Application → read-only modal
        container.querySelectorAll('.btn-view-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = getApps().find(a => a.appNo === btn.dataset.appno);
                if (s) openFormViewModal(s);
            });
        });

        // Submit to Assessment
        container.querySelectorAll('.btn-proceed-student').forEach(btn => {
            btn.addEventListener('click', () => {
                proceedTarget = btn.dataset.appno;
                const s = getApps().find(a => a.appNo === proceedTarget);
                if (!s) return;
                document.getElementById('proceedStudentName').textContent = s.name || s.appNo;
                document.getElementById('proceedModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // ── STUDENT CARD HTML ─────────────────────────────────────
    function buildStudentCard(s) {
        const initials    = getInitials(s.name || '??');
        const hasSubjects = s.enrolledSubjects && s.enrolledSubjects.length > 0;
        const totalUnits  = hasSubjects
            ? s.enrolledSubjects.reduce((sum, sub) => sum + (Number(sub.units) || 0), 0)
            : 0;
        const statusLabel = hasSubjects ? 'Subjects Assigned' : 'Awaiting Assignment';
        const cetOapr     = s.cet?.oapr
            ? `<span style="font-size:11px;color:#777;margin-left:6px;">OAPR: <strong>${s.cet.oapr}</strong></span>`
            : '';

        const previewRows = hasSubjects
            ? s.enrolledSubjects.slice(0, 3).map(sub => `
                <tr>
                    <td style="padding:5px 10px;font-weight:600;font-size:12px;white-space:nowrap;">${escHtml(sub.code)}</td>
                    <td style="padding:5px 10px;font-size:12px;">${escHtml(sub.title || sub.description || '')}</td>
                    <td style="padding:5px 10px;font-size:12px;text-align:center;">${sub.units}</td>
                </tr>`).join('') +
              (s.enrolledSubjects.length > 3
                ? `<tr><td colspan="3" style="padding:5px 10px;font-size:11px;color:#999;text-align:center;">+${s.enrolledSubjects.length - 3} more subject(s)</td></tr>`
                : '')
            : `<tr><td colspan="3" style="padding:16px;text-align:center;color:#bbb;font-size:12px;">
                   No subjects assigned yet.<br>
                   <span style="font-size:11px;">Use Bulk Enlist or assign manually.</span>
               </td></tr>`;

        return `
        <div class="student-card" data-appno="${escHtml(s.appNo)}"
            style="margin-bottom:18px;border:1px solid #e8e8e8;border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);">

            <!-- Header -->
            <div style="padding:16px 20px;display:flex;align-items:center;gap:14px;border-bottom:1px solid #f0f0f0;">
                <div style="width:44px;height:44px;border-radius:50%;background:#c0192b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0;">${escHtml(initials)}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:.95rem;color:#1a1a1a;">${escHtml(s.name || '—')}</div>
                    <div style="font-size:.78rem;color:#777;margin-top:2px;">
                        ${escHtml(s.appNo)} &bull;
                        <span style="text-transform:capitalize;">${escHtml(s.applicantType || 'freshman')}</span>
                        ${cetOapr}
                    </div>
                </div>
                <span style="font-size:.7rem;font-weight:700;padding:4px 11px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em;
                    ${hasSubjects ? 'background:#e8f5e9;color:#2e7d32;' : 'background:#fff8e1;color:#e65100;'}">
                    ${statusLabel}
                </span>
            </div>

            <!-- Subject preview table -->
            <div style="padding:14px 20px 0;">
                <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#999;margin-bottom:8px;">
                    ${hasSubjects ? `Assigned Subjects (${totalUnits} units)` : 'Subjects to Assign'}
                </div>
                <div style="overflow:hidden;border:1px solid #f0f0f0;border-radius:8px;">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#fafafa;">
                                <th style="padding:6px 10px;text-align:left;font-size:11px;color:#999;font-weight:600;border-bottom:1px solid #f0f0f0;">Code</th>
                                <th style="padding:6px 10px;text-align:left;font-size:11px;color:#999;font-weight:600;border-bottom:1px solid #f0f0f0;">Subject</th>
                                <th style="padding:6px 10px;text-align:center;font-size:11px;color:#999;font-weight:600;border-bottom:1px solid #f0f0f0;">Units</th>
                            </tr>
                        </thead>
                        <tbody>${previewRows}</tbody>
                    </table>
                </div>
            </div>

            <!-- Action buttons -->
            <div style="padding:14px 20px;display:flex;gap:10px;justify-content:flex-end;">
                <button class="btn-view-form" data-appno="${escHtml(s.appNo)}"
                    style="font-size:.82rem;padding:8px 16px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;display:flex;align-items:center;gap:6px;">
                    <i class="fas fa-eye"></i> View Application
                </button>
                ${hasSubjects
                    ? `<button class="btn-proceed-student" data-appno="${escHtml(s.appNo)}"
                            style="font-size:.82rem;padding:8px 16px;border-radius:8px;background:#c0192b;color:#fff;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;">
                            <i class="fas fa-paper-plane"></i> Submit to Assessment
                       </button>`
                    : `<button disabled
                            style="font-size:.82rem;padding:8px 16px;border-radius:8px;background:#f5f5f5;color:#bbb;border:1px solid #eee;cursor:not-allowed;display:flex;align-items:center;gap:6px;"
                            title="Assign subjects first">
                            <i class="fas fa-lock"></i> Assign Subjects First
                       </button>`}
            </div>
        </div>`;
    }

    // ── QUICK STATS ───────────────────────────────────────────
    function updateQuickStats(students) {
        const total     = students.length;
        const assigned  = students.filter(s => s.enrolledSubjects && s.enrolledSubjects.length > 0).length;
        const awaiting  = total - assigned;
        const processed = getSubmittedToAssessment().length;

        const el = id => document.getElementById(id);
        if (el('stat-total'))          el('stat-total').textContent          = total;
        if (el('stat-form-submitted')) el('stat-form-submitted').textContent = assigned;
        if (el('stat-awaiting'))       el('stat-awaiting').textContent       = awaiting;
        if (el('stat-processed'))      el('stat-processed').textContent      = processed;
    }

    // ── FILTER PILLS ──────────────────────────────────────────
    window.applyDashboardFilter = function(filter) {
        activeFilter = filter;
        renderStudentList();
    };

    // ── PROCEED MODAL ─────────────────────────────────────────
    document.getElementById('confirmProceedBtn')?.addEventListener('click', () => {
        if (!proceedTarget) return;
        const apps = getApps();
        const idx  = apps.findIndex(a => a.appNo === proceedTarget);
        if (idx === -1) return;

        apps[idx].adviserStatus = 'submitted';
        apps[idx].adviserName   = ADVISER_NAME;
        apps[idx].dateForwarded = new Date().toISOString();
        apps[idx].status        = 'Pending Final Approval';

        const s = apps[idx];
        submittedStudents.push({
            id:            s.appNo,
            name:          s.name  || '—',
            course:        s.course || '—',
            dateSubmitted: new Date().toLocaleDateString("en-PH", { month:"long", day:"numeric", year:"numeric" }),
            status:        'submitted'
        });

        saveApps(apps);
        closeProceedModal();
        showToast(`✓ ${s.name} forwarded to Assessment Office.`, 'success');
        renderStudentList();
    });

    document.getElementById('cancelProceedBtn')?.addEventListener('click', closeProceedModal);
    document.getElementById('proceedModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('proceedModal')) closeProceedModal();
    });

    function closeProceedModal() {
        proceedTarget = null;
        document.getElementById('proceedModal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ── BULK ENLIST  — BSCS Year 1 Sem 1 subjects ────────────
    window.bulkEnlistFreshmen = function() {
        const students = getAcceptedStudents().filter(s =>
            !s.enrolledSubjects || s.enrolledSubjects.length === 0
        );
        if (students.length === 0) {
            alert("All BSCS students already have subjects assigned."); return;
        }
        if (!confirm(`Assign default BSCS Year 1, Sem 1 subjects to ${students.length} student(s)?`)) return;

        // Pulled from subject.js  BSCS Year 1 Sem 1
        const defaultSubjects = [
            { code:"CS 111",   title:"Introduction to Computing",                units:3 },
            { code:"CS 112",   title:"Computer Programming 1",                   units:2 },
            { code:"CS 112L",  title:"Computer Programming 1 (Lab)",             units:1 },
            { code:"MATH 111", title:"Discrete Structures 1",                    units:3 },
            { code:"US 101",   title:"Understanding the Self",                   units:3 },
            { code:"CAS 101",  title:"Purposive Communication",                  units:3 },
            { code:"PE 101",   title:"PathFit 1 – Movement Competency Training", units:2 },
            { code:"NSTP 1",   title:"National Service Training Program 1",      units:3 },
        ];

        const apps = getApps();
        students.forEach(s => {
            const idx = apps.findIndex(a => a.appNo === s.appNo);
            if (idx !== -1) {
                apps[idx].enrolledSubjects = defaultSubjects;
                apps[idx].totalUnits       = defaultSubjects.reduce((sum, sub) => sum + sub.units, 0);
            }
        });
        saveApps(apps);
        showToast(`✓ ${students.length} BSCS students assigned default Year 1 subjects.`, 'success');
        renderStudentList();
    };

    // ── DOWNLOAD MASTER LIST ──────────────────────────────────
    window.downloadMasterList = function() {
        const students = getAcceptedStudents();
        if (students.length === 0) { alert("No BSCS students to export."); return; }
        const formatted = students.map(s => ({
            name:     s.name || '—',
            lrn:      s.appNo,
            status:   s.adviserStatus || 'pending',
            subjects: s.enrolledSubjects || [],
            verified: !!(s.enrolledSubjects && s.enrolledSubjects.length)
        }));
        if (typeof exportStudentList === 'function') {
            exportStudentList('CCS_BSCS_Freshmen', formatted);
        } else {
            alert('Export utility not loaded (csv_export.js missing).');
        }
    };

    // ── INIT + POLL ───────────────────────────────────────────
    renderStudentList();
    setInterval(renderStudentList, 10000); // auto-refresh if dept-head accepts more
}


// =============================================================
// FORM VIEW MODAL
// Read-only view of what the student submitted on forms.html
// ─────────────────────────────────────────────────────────────
// RULES:
//  • Show application + personal info + CET scores + interview eval
//  • Subjects section: show if already assigned, else show "not yet"
//    notice — adviser is the one who assigns, not the student
//  • NO COR — that's only after full Assessment + Registrar processing
// =============================================================

function openFormViewModal(s) {
    const initials = getInitials(s.name || '??');

    // Header elements
    const avatarEl = document.getElementById('fvmAvatar');
    if (avatarEl) avatarEl.textContent = initials;

    const nameEl = document.getElementById('fvmName');
    if (nameEl) nameEl.textContent = s.name || s.appNo || '—';

    const metaEl = document.getElementById('fvmMeta');
    if (metaEl) metaEl.textContent =
        `${s.appNo || '—'}  ·  BS Computer Science  ·  OAPR: ${s.cet?.oapr || '—'}`;

    // Status badge
    const badge = document.getElementById('fvmStatusBadge');
    if (badge) {
        badge.textContent      = 'Accepted';
        badge.style.background = '#e8f5e9';
        badge.style.color      = '#2e7d32';
    }

    // Acceptance remark banner
    const banner = document.getElementById('fvmBanner');
    if (banner) {
        if (s.acceptRemarks) {
            banner.style.cssText = 'display:flex;padding:10px 20px;font-size:.82rem;align-items:center;gap:8px;background:#e8f5e9;color:#2e7d32;';
            banner.innerHTML     = `<i class="fas fa-check-circle"></i>&nbsp;${escHtml(s.acceptRemarks)}`;
        } else {
            banner.style.display = 'none';
        }
    }

    // ── Helpers ───────────────────────────────────────────────
    const v   = val  => escHtml(val || '—');
    const row = (label, value) => `
        <div style="display:flex;flex-direction:column;gap:2px;padding:9px 0;border-bottom:1px solid #f5f5f5;">
            <span style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#bbb;">${label}</span>
            <span style="font-size:13px;color:#1a1a1a;line-height:1.4;">${value}</span>
        </div>`;
    const sectionBlock = (title, inner) => `
        <div style="margin-bottom:22px;">
            <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#c0192b;padding-bottom:6px;margin-bottom:2px;border-bottom:2px solid #fdecea;">${title}</div>
            ${inner}
        </div>`;

    // ── Application info ──────────────────────────────────────
    const submittedDate = s.submittedDate
        ? new Date(s.submittedDate).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })
        : '—';

    const appInfo = sectionBlock('Application Details', `
        ${row('Application No.',  `<strong>${v(s.appNo)}</strong>`)}
        ${row('Date Submitted',   submittedDate)}
        ${row('Applicant Type',   `<span style="text-transform:capitalize;">${v(s.applicantType)}</span>`)}
        ${row('Applied Program',  '<strong>BS Computer Science</strong>')}
        ${row('Department',       'College of Computing Studies')}
    `);

    // ── Personal info ─────────────────────────────────────────
    const personalInfo = sectionBlock('Personal Information', `
        ${row('Full Name',    `${v(s.surname)}, ${v(s.firstname)} ${v(s.middleinitial)}`)}
        ${row('Email',        v(s.email))}
        ${row('Contact No.', v(s.contact))}
    `);

    // ── CET scores ────────────────────────────────────────────
    const cet = s.cet || {};
    const cetInner = cet.oapr
        ? `${row('OAPR (Overall Percentile)', `<strong style="font-size:15px;color:#c0192b;">${cet.oapr} PR</strong>`)}
           ${cet.ep  ? row('English Proficiency',    `${cet.ep} PR`)  : ''}
           ${cet.rc  ? row('Reading Comprehension',  `${cet.rc} PR`)  : ''}
           ${cet.sps ? row('Science Process Skills', `${cet.sps} PR`) : ''}
           ${cet.qs  ? row('Quantitative Skills',    `${cet.qs} PR`)  : ''}
           ${cet.ats ? row('Abstract Thinking',      `${cet.ats} PR`) : ''}`
        : `<p style="font-size:12px;color:#ccc;padding:8px 0;">No CET data recorded.</p>`;
    const cetSection = sectionBlock('CET Scores', cetInner);

    // ── Interview eval ────────────────────────────────────────
    const evalSection = s.interviewEval ? (() => {
        const ev  = s.interviewEval;
        const pct = ev.percentage || Math.round(ev.totalScore / ev.maxScore * 100);
        return sectionBlock('Interview Evaluation', `
            <div style="background:#f0f4ff;border:1px solid #c7d7fc;border-radius:8px;padding:12px 14px;margin-top:4px;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
                    <span style="font-size:20px;font-weight:800;color:#1a56db;">${ev.totalScore}<span style="font-size:12px;font-weight:400;color:#999;">/${ev.maxScore}</span></span>
                    <span style="font-size:11.5px;background:#dbeafe;color:#1e40af;padding:3px 10px;border-radius:20px;font-weight:700;">${escHtml(ev.recommendation)}</span>
                    <span style="font-size:12px;color:#777;">${pct}%</span>
                    <span style="font-size:11px;color:#aaa;margin-left:auto;">by ${escHtml(ev.interviewer)}</span>
                </div>
                ${ev.criteria ? ev.criteria.map(c => `
                <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid #e8eef8;font-size:12px;">
                    <span style="flex:1;color:#444;">${escHtml(c.label)}</span>
                    <span style="display:flex;gap:3px;">
                        ${Array.from({length: c.max}, (_, i) =>
                            `<span style="width:8px;height:8px;border-radius:50%;background:${i < c.score ? '#1a56db' : '#e2e8f0'};display:inline-block;"></span>`
                        ).join('')}
                    </span>
                    <span style="font-size:11px;color:#777;min-width:28px;text-align:right;">${c.score}/${c.max}</span>
                </div>`).join('') : ''}
                ${ev.remarks ? `<div style="margin-top:8px;font-size:12px;color:#555;font-style:italic;border-top:1px solid #e8eef8;padding-top:8px;">"${escHtml(ev.remarks)}"</div>` : ''}
            </div>`);
    })() : '';

    // ── Interview slot ────────────────────────────────────────
    const slotSection = s.interviewSlot ? sectionBlock('Interview Slot', `
        ${row('Date',    new Date((s.interviewSlot.date || '') + 'T12:00')
            .toLocaleDateString('en-PH', { weekday:'long', month:'long', day:'numeric', year:'numeric' }))}
        ${row('Session', v(s.interviewSlot.session))}
        ${row('Time',    v(s.interviewSlot.time))}
    `) : '';

    // ── Subjects ──────────────────────────────────────────────
    // Adviser assigns these — student does NOT fill this section
    const hasSubjects   = s.enrolledSubjects && s.enrolledSubjects.length > 0;
    const totalUnits    = hasSubjects
        ? s.enrolledSubjects.reduce((sum, sub) => sum + (Number(sub.units) || 0), 0)
        : 0;

    const subjectsInner = hasSubjects
        ? `<div style="overflow:hidden;border:1px solid #f0f0f0;border-radius:8px;margin-top:6px;">
               <table style="width:100%;border-collapse:collapse;">
                   <thead>
                       <tr style="background:#fafafa;">
                           <th style="padding:7px 10px;text-align:left;font-size:11px;color:#999;font-weight:700;border-bottom:1px solid #f0f0f0;">Code</th>
                           <th style="padding:7px 10px;text-align:left;font-size:11px;color:#999;font-weight:700;border-bottom:1px solid #f0f0f0;">Subject</th>
                           <th style="padding:7px 10px;text-align:center;font-size:11px;color:#999;font-weight:700;border-bottom:1px solid #f0f0f0;">Units</th>
                       </tr>
                   </thead>
                   <tbody>
                       ${s.enrolledSubjects.map((sub, i) => `
                       <tr style="border-bottom:1px solid ${i % 2 === 0 ? '#f9f9f9' : '#fff'};">
                           <td style="padding:8px 10px;font-weight:700;font-size:12px;">${escHtml(sub.code)}</td>
                           <td style="padding:8px 10px;font-size:12px;">${escHtml(sub.title || sub.description || '')}</td>
                           <td style="padding:8px 10px;text-align:center;font-size:12px;">${sub.units}</td>
                       </tr>`).join('')}
                       <tr style="background:#fafafa;border-top:2px solid #f0f0f0;">
                           <td colspan="2" style="padding:8px 10px;font-weight:700;font-size:12px;">Total</td>
                           <td style="padding:8px 10px;text-align:center;font-weight:800;font-size:13px;color:#c0192b;">${totalUnits}</td>
                       </tr>
                   </tbody>
               </table>
           </div>`
        : `<div style="background:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:14px 16px;margin-top:6px;display:flex;align-items:flex-start;gap:10px;">
               <i class="fas fa-pencil-ruler" style="color:#e65100;margin-top:2px;flex-shrink:0;font-size:14px;"></i>
               <div>
                   <div style="font-size:12.5px;font-weight:700;color:#e65100;margin-bottom:4px;">No subjects assigned yet</div>
                   <div style="font-size:12px;color:#795548;line-height:1.65;">
                       As the adviser, <strong>you</strong> will assign this student's subjects.
                       The student does not choose their own subjects at this stage.<br>
                       Use <strong>Bulk Enlist</strong> (assigns all BSCS Year 1 default subjects at once)
                       or assign individually. Once done, click <strong>Submit to Assessment</strong>.
                   </div>
               </div>
           </div>`;

    const subjectsSection = sectionBlock('Enrolled Subjects (Assigned by Adviser)', subjectsInner);

    // ── COR notice ────────────────────────────────────────────
    const corSection = sectionBlock('Certificate of Registration (COR)',
        `<div style="background:#f8f8f8;border:1px dashed #ddd;border-radius:8px;padding:14px 16px;margin-top:6px;display:flex;align-items:flex-start;gap:10px;">
            <i class="fas fa-lock" style="color:#ccc;margin-top:2px;flex-shrink:0;"></i>
            <div style="font-size:12px;color:#aaa;line-height:1.7;">
                The COR is issued <strong>only after</strong> the student is fully assessed by the
                <strong>Assessment &amp; Cashier Office</strong> and confirmed by the <strong>Registrar</strong>.
                It is not available at this stage of enrollment.
            </div>
         </div>`
    );

    // ── Adviser note at bottom ────────────────────────────────
    const adviserNote = `
        <div style="background:#f0f4ff;border:1px solid #c7d7fc;border-radius:8px;padding:12px 14px;font-size:12px;color:#1e40af;line-height:1.7;margin-top:6px;">
            <i class="fas fa-info-circle" style="margin-right:6px;"></i>
            <strong>Adviser View — Read Only.</strong>
            This page shows the student's submitted application details.
            To assign or change subjects, close this modal and use
            <strong>Bulk Enlist</strong> or a manual subject assignment tool.
            After subjects are assigned, click <strong>Submit to Assessment</strong> on the student card.
        </div>`;

    // ── Inject into modal body ────────────────────────────────
    const bodyEl = document.getElementById('fvmBody');
    if (bodyEl) {
        bodyEl.innerHTML =
            appInfo +
            personalInfo +
            cetSection +
            evalSection +
            slotSection +
            subjectsSection +
            corSection +
            adviserNote;
    }

    document.getElementById('formViewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}


// =============================================================
// SECTION 2 — SUBMITTED HISTORY
// =============================================================

const submittedStudents = [];

function initSubmittedPage() {
    if (!document.getElementById("tableBody")) return;

    // Pre-load from localStorage on page open
    const fromStorage = getSubmittedToAssessment();
    fromStorage.forEach(s => {
        if (!submittedStudents.find(x => x.id === s.appNo)) {
            submittedStudents.push({
                id:            s.appNo,
                name:          s.name  || '—',
                course:        s.course || '—',
                dateSubmitted: s.dateForwarded
                    ? new Date(s.dateForwarded).toLocaleDateString("en-PH",
                        { month:"long", day:"numeric", year:"numeric" })
                    : '—',
                status: 'submitted'
            });
        }
    });

    let recallTarget = null;

    function statusBadge(status) {
        const map = {
            submitted:  ['Submitted',  '#e3f2fd', '#1565c0'],
            processing: ['Processing', '#fff8e1', '#e65100'],
            recalled:   ['Recalled',   '#fce8e8', '#c62828'],
            flagged:    ['Flagged',    '#fce8e8', '#c62828'],
        };
        const [label, bg, color] = map[status] || ['Submitted', '#e3f2fd', '#1565c0'];
        return `<span style="font-size:.7rem;font-weight:700;padding:3px 10px;border-radius:20px;background:${bg};color:${color};">${label}</span>`;
    }

    function renderTable(data) {
        const tbody      = document.getElementById("tableBody");
        const emptyState = document.getElementById("emptyState");
        tbody.innerHTML  = '';
        if (data.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        data.forEach((s, idx) => {
            const origIdx  = submittedStudents.indexOf(s);
            const recalled = s.status === 'recalled';
            const tr       = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="row-num">${idx + 1}</span></td>
                <td>
                    <div class="student-cell">
                        <div class="table-avatar">${getInitials(s.name)}</div>
                        <span class="student-full-name">${escHtml(s.name)}</span>
                    </div>
                </td>
                <td>${escHtml(s.id)}</td>
                <td>${escHtml(s.course || '—')}</td>
                <td>${escHtml(s.dateSubmitted)}</td>
                <td>${statusBadge(s.status)}</td>
                <td>
                    <button class="btn-recall" data-index="${origIdx}"
                        ${recalled ? 'disabled' : ''}
                        title="${recalled ? 'Already recalled' : 'Recall this student'}">
                        <i class="fas fa-undo"></i> Recall
                    </button>
                </td>`;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-recall:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => openRecallModal(parseInt(btn.dataset.index)));
        });
    }

    function updateStats(data) {
        const el = id => document.getElementById(id);
        if (el('statTotal'))     el('statTotal').textContent     = data.length;
        if (el('statRegular'))   el('statRegular').textContent   =
            data.filter(s => (s.course || '').includes('Computer Science')).length;
        if (el('statIrregular')) el('statIrregular').textContent =
            data.filter(s => !(s.course || '').includes('Computer Science')).length;
        if (el('statRecalled'))  el('statRecalled').textContent  =
            data.filter(s => s.status === 'recalled').length;
    }

    function applyFilters() {
        const query  = (document.getElementById("searchInput")?.value  || '').toLowerCase().trim();
        const course = (document.getElementById("sectionFilter")?.value || '');
        const filtered = submittedStudents.filter(s => {
            const matchSearch = !query  || s.name.toLowerCase().includes(query) || s.id.includes(query);
            const matchCourse = !course || (s.course || '').includes(course);
            return matchSearch && matchCourse;
        });
        renderTable(filtered);
        updateStats(filtered);
    }

    function openRecallModal(idx) {
        recallTarget = idx;
        const nameEl = document.getElementById('recallStudentName');
        if (nameEl) nameEl.textContent = submittedStudents[idx]?.name || '';
        document.getElementById('recallModal')?.classList.add('active');
    }

    function closeRecallModal() {
        recallTarget = null;
        document.getElementById('recallModal')?.classList.remove('active');
    }

    function confirmRecall() {
        if (recallTarget === null) return;
        const s = submittedStudents[recallTarget];
        if (!s) return;
        s.status = 'recalled';
        const apps = getApps();
        const idx  = apps.findIndex(a => a.appNo === s.id);
        if (idx !== -1) { apps[idx].adviserStatus = 'recalled'; saveApps(apps); }
        closeRecallModal();
        applyFilters();
        showToast(`${s.name} recalled from Assessment Office.`);
    }

    applyFilters();
    document.getElementById("searchInput")
        ?.addEventListener("input",  applyFilters);
    document.getElementById("sectionFilter")
        ?.addEventListener("change", applyFilters);
    document.getElementById("closeRecallModal")
        ?.addEventListener("click", closeRecallModal);
    document.getElementById("cancelRecall")
        ?.addEventListener("click", closeRecallModal);
    document.getElementById("confirmRecall")
        ?.addEventListener("click", confirmRecall);
    document.getElementById("recallModal")
        ?.addEventListener("click", e => {
            if (e.target === document.getElementById("recallModal")) closeRecallModal();
        });
}


// =============================================================
// SECTION 3 — FOR CORRECTION
// =============================================================

const flaggedReturns = [];

function loadCorrectionFromStorage() {
    const fromStorage = getCorrectionStudents();
    fromStorage.forEach(s => {
        if (!flaggedReturns.find(f => f.id === s.appNo)) {
            flaggedReturns.push({
                id:         s.appNo,
                name:       s.name || '—',
                initials:   getInitials(s.name || '??'),
                program:    'BSCS',
                year:       '1st Year',
                section:    '—',
                type:       s.applicantType || 'freshman',
                reasons:    s.correctionReasons || ['other'],
                note:       s.correctionNote   || 'Please review and resubmit.',
                returnedAt: s.correctionDate
                    ? new Date(s.correctionDate).toLocaleString('en-PH') : '—',
                subjects:   s.enrolledSubjects || [],
            });
        }
    });

    // Demo record if localStorage has nothing yet
    if (flaggedReturns.length === 0) {
        flaggedReturns.push({
            id:         "2526-00042",
            name:       "Juan Dela Cruz",
            initials:   "JD",
            program:    "BSCS",
            year:       "1st Year",
            section:    "—",
            type:       "freshman",
            reasons:    ["unit_mismatch"],
            note:       "CS 112L shows 2 units in the submitted form but the BSCS prospectus lists it as 1 unit (laboratory). Please correct and resubmit.",
            returnedAt: "May 5, 2026 · 10:22 AM",
            subjects: [
                { code:"CS 111",  description:"Introduction to Computing",      day:"MWF", time:"8:00–9:00 AM",   room:"CCS-101", section:"BSCS-1A", units:3 },
                { code:"CS 112",  description:"Computer Programming 1",         day:"TTh", time:"10:00–11:30 AM", room:"CCS-102", section:"BSCS-1A", units:2 },
                { code:"CS 112L", description:"Computer Programming 1 (Lab)",   day:"TTh", time:"1:00–3:00 PM",   room:"CCS-LAB", section:"BSCS-1A", units:2 },
            ]
        });
    }
}

const REASON_LABELS = {
    missing_docs:      "Missing Documents",
    residency:         "Residency Issue",
    unit_mismatch:     "Unit Count Mismatch",
    shiftee_credits:   "Shiftee Credit Review",
    schedule_conflict: "Schedule Conflict",
    other:             "Other"
};

function initCorrectionPage() {
    if (!document.getElementById("correction-list")) return;

    loadCorrectionFromStorage();

    let activeStudentIdx = null;

    const getReasonLabel = id => REASON_LABELS[id] ?? id;
    const totalUnits     = subs => subs.reduce((sum, s) => sum + Number(s.units || 0), 0);

    function updateSidebarBadge() {
        const badge = document.getElementById("sidebarBadge");
        if (!badge) return;
        const count = flaggedReturns.length;
        badge.textContent   = count > 0 ? count : '';
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    function renderCards(data) {
        const list  = document.getElementById("correction-list");
        const empty = document.getElementById("emptyCorrection");
        if (data.length === 0) {
            list.innerHTML = '';
            if (empty) empty.style.display = 'block';
            updateSidebarBadge();
            return;
        }
        if (empty) empty.style.display = 'none';

        list.innerHTML = data.map(s => {
            const origIdx    = flaggedReturns.indexOf(s);
            const reasonTags = s.reasons
                .map(r => `<span class="correction-reason-tag">${escHtml(getReasonLabel(r))}</span>`)
                .join('');
            return `
            <div class="student-card correction-card" data-idx="${origIdx}">
                <div class="card-header">
                    <div class="profile-row">
                        <div class="avatar">${escHtml(s.initials)}</div>
                        <div class="name-container">
                            <h3 class="student-name">
                                ${escHtml(s.name)}
                                <span class="badge ${s.type}">${s.type.charAt(0).toUpperCase() + s.type.slice(1)}</span>
                            </h3>
                            <p class="student-id">${escHtml(s.id)} &bull; ${escHtml(s.year)} &bull; ${escHtml(s.program)}</p>
                        </div>
                        <div class="status-pill correction">Returned</div>
                    </div>
                </div>
                <div class="correction-reasons-row">
                    ${reasonTags}
                    <span class="correction-meta">Returned: ${escHtml(s.returnedAt)}</span>
                </div>
                <div class="correction-note-toggle" onclick="corrToggleNote(${origIdx})">
                    <span class="toggle-label" id="toggle-label-${origIdx}">
                        <i class="fas fa-chevron-down toggle-icon" id="toggle-icon-${origIdx}"></i>
                        View note from Assessment Office
                    </span>
                </div>
                <div class="correction-note-body" id="note-body-${origIdx}">
                    <div class="correction-note-inner">
                        <div class="correction-note-label"><i class="fas fa-triangle-exclamation"></i> Note from Assessment Office</div>
                        <p class="correction-note-text">${escHtml(s.note)}</p>
                    </div>
                </div>
                <div class="card-btns" style="padding:0 20px 18px;">
                    <button class="btn btn-review" onclick="corrOpenResubmitModal(${origIdx})">
                        <i class="fas fa-pen"></i> Correct &amp; Resubmit
                    </button>
                </div>
            </div>`;
        }).join('');

        updateSidebarBadge();
    }

    window.corrToggleNote = function(idx) {
        const body  = document.getElementById(`note-body-${idx}`);
        const icon  = document.getElementById(`toggle-icon-${idx}`);
        const label = document.getElementById(`toggle-label-${idx}`);
        if (!body) return;
        const isOpen = body.classList.toggle('open');
        icon?.classList.toggle('fa-chevron-down', !isOpen);
        icon?.classList.toggle('fa-chevron-up',    isOpen);
        if (label?.childNodes[1])
            label.childNodes[1].textContent = isOpen
                ? ' Hide note from Assessment Office'
                : ' View note from Assessment Office';
    };

    function applySearch() {
        const q = (document.getElementById('correctionSearch')?.value || '').toLowerCase().trim();
        renderCards(flaggedReturns.filter(s =>
            !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        ));
    }

    window.corrOpenResubmitModal = function(idx) {
        activeStudentIdx = idx;
        const s = flaggedReturns[idx];
        const titleEl = document.getElementById('resubmitModalTitle');
        if (titleEl) titleEl.textContent = `Correct & Resubmit — ${s.name}`;
        const noteEl = document.getElementById('modalNoteText');
        if (noteEl)  noteEl.textContent  = s.note;
        renderResubmitTable(s.subjects);
        document.getElementById('resubmitModal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function renderResubmitTable(subjects) {
        const tbody = document.getElementById('resubmitTableBody');
        if (!tbody) return;
        tbody.innerHTML = subjects.map((sub, i) => buildSubjectRow(sub, i)).join('');
        recalcUnits();
    }

    function buildSubjectRow(sub, i) {
        return `
        <tr id="subject-row-${i}">
            <td class="action-cell">
                <button class="icon-btn delete" title="Delete" onclick="corrDeleteRow(${i})"><i class="fas fa-trash"></i></button>
                <button class="icon-btn edit"   title="Edit"   onclick="corrToggleEditRow(${i})"><i class="fas fa-edit"></i></button>
            </td>
            <td class="cell-code"    data-field="code">${escHtml(sub.code)}</td>
            <td class="cell-desc"    data-field="description">${escHtml(sub.description || sub.title || '')}</td>
            <td class="cell-day"     data-field="day">${escHtml(sub.day || '')}</td>
            <td class="cell-time"    data-field="time">${escHtml(sub.time || '')}</td>
            <td class="cell-room"    data-field="room">${escHtml(sub.room || '')}</td>
            <td class="cell-section" data-field="section">${escHtml(sub.section || '')}</td>
            <td class="cell-units"   data-field="units">${escHtml(String(sub.units))}</td>
        </tr>`;
    }

    window.corrToggleEditRow = function(rowIdx) {
        const row = document.getElementById(`subject-row-${rowIdx}`);
        if (!row) return;
        const cells     = row.querySelectorAll('td[data-field]');
        const isEditing = row.classList.toggle('editing');
        cells.forEach(cell => {
            const field = cell.dataset.field;
            if (isEditing) {
                const val = cell.textContent.trim();
                cell.innerHTML = `<input class="id-edit" type="text" value="${escHtml(val)}" data-field="${field}" style="width:100%;">`;
            } else {
                const input  = cell.querySelector('input');
                const newVal = input ? input.value.trim() : cell.textContent.trim();
                cell.textContent = newVal;
                if (activeStudentIdx !== null && flaggedReturns[activeStudentIdx]?.subjects[rowIdx]) {
                    flaggedReturns[activeStudentIdx].subjects[rowIdx][field] =
                        field === 'units' ? parseFloat(newVal) || 0 : newVal;
                }
            }
        });
        const editBtn = row.querySelector('.icon-btn.edit, .icon-btn.save');
        if (editBtn) {
            if (isEditing) {
                editBtn.className = 'icon-btn save'; editBtn.title = 'Save';
                editBtn.innerHTML = '<i class="fas fa-check"></i>';
                editBtn.setAttribute('onclick', `corrToggleEditRow(${rowIdx})`);
            } else {
                editBtn.className = 'icon-btn edit'; editBtn.title = 'Edit';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                recalcUnits();
            }
        }
    };

    window.corrDeleteRow = function(rowIdx) {
        if (activeStudentIdx === null) return;
        flaggedReturns[activeStudentIdx].subjects.splice(rowIdx, 1);
        renderResubmitTable(flaggedReturns[activeStudentIdx].subjects);
    };

    function addSubjectRow() {
        if (activeStudentIdx === null) return;
        const s = flaggedReturns[activeStudentIdx];
        s.subjects.push({ code:'', description:'', day:'', time:'', room:'', section:'', units:0 });
        renderResubmitTable(s.subjects);
        const newIdx = s.subjects.length - 1;
        window.corrToggleEditRow(newIdx);
        document.getElementById(`subject-row-${newIdx}`)?.scrollIntoView({ behavior:'smooth', block:'center' });
    }

    function recalcUnits() {
        if (activeStudentIdx === null) return;
        const el = document.getElementById('modalTotalUnits');
        if (el) el.textContent = totalUnits(flaggedReturns[activeStudentIdx].subjects);
    }

    function closeResubmitModal() {
        activeStudentIdx = null;
        document.getElementById('resubmitModal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openConfirmModal() {
        if (activeStudentIdx === null) return;
        const s = flaggedReturns[activeStudentIdx];
        if (document.querySelectorAll('#resubmitTableBody tr.editing').length > 0) {
            alert('Please save all edits first.'); return;
        }
        if (!s.subjects.length) { alert('Cannot resubmit with no subjects.'); return; }
        const nameEl = document.getElementById('confirmStudentName');
        if (nameEl) nameEl.textContent = s.name;
        document.getElementById('confirmModal')?.classList.add('active');
    }

    function closeConfirmModal() {
        document.getElementById('confirmModal')?.classList.remove('active');
    }

    function finalResubmit() {
        if (activeStudentIdx === null) return;
        const s    = flaggedReturns[activeStudentIdx];
        const apps = getApps();
        const idx  = apps.findIndex(a => a.appNo === s.id);
        if (idx !== -1) {
            apps[idx].adviserStatus    = 'submitted';
            apps[idx].enrolledSubjects = s.subjects.map(sub => ({
                code:  sub.code,
                title: sub.description || sub.title || '',
                units: sub.units,
            }));
            apps[idx].resubmittedDate = new Date().toISOString();
            saveApps(apps);
        }
        const studentName = s.name;
        flaggedReturns.splice(activeStudentIdx, 1);
        closeConfirmModal();
        closeResubmitModal();
        applySearch();
        showToast(`✓ ${studentName} resubmitted to Assessment Office.`);
    }

    renderCards(flaggedReturns);

    document.getElementById('correctionSearch')?.addEventListener('input',  applySearch);
    document.getElementById('addSubjectBtn')   ?.addEventListener('click',  addSubjectRow);
    document.getElementById('closeResubmitModal')?.addEventListener('click', closeResubmitModal);
    document.getElementById('cancelResubmitBtn') ?.addEventListener('click', closeResubmitModal);
    document.getElementById('confirmResubmitBtn') ?.addEventListener('click', openConfirmModal);
    document.getElementById('cancelConfirmBtn')   ?.addEventListener('click', closeConfirmModal);
    document.getElementById('finalResubmitBtn')   ?.addEventListener('click', finalResubmit);
    document.getElementById('resubmitModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('resubmitModal')) closeResubmitModal();
    });
    document.getElementById('confirmModal')?.addEventListener('click', e => {
        if (e.target === document.getElementById('confirmModal')) closeConfirmModal();
    });
}


// =============================================================
// BOOT
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
    initAdviserDashboard();
    initSubmittedPage();
    initCorrectionPage();
});