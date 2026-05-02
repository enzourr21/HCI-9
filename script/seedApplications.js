/**
 * WMSU-Ease — Seed Applications (v3)
 * Generates exactly 1000 applicants distributed across ALL courses/departments.
 * Each student gets a realistic status and is properly tied to their department.
 * Only runs if fewer than 1000 applications already exist.
 */
(function () {

  function doSeed() {
    if (!window.WMSU_CET_DB || !window.WMSU_COURSE_REQUIREMENTS) {
      setTimeout(doSeed, 120);
      return;
    }

    const stored = JSON.parse(localStorage.getItem('wmsu_applications') || '[]');
    if (stored.length >= 1000) return;

    const REQ         = window.WMSU_COURSE_REQUIREMENTS;
    const COURSE_KEYS = Object.keys(REQ);

    /* ── Target distribution per department ──────────────────
       Total = 1000, spread realistically across 9 colleges.
    ─────────────────────────────────────────────────────── */
    const DEPT_DISTRIBUTION = {
      'College of Computing Studies':          120,
      'College of Engineering':                200,
      'College of Nursing':                     80,
      'College of Business Administration':    170,
      'College of Arts and Sciences':          160,
      'College of Education':                   90,
      'College of Agriculture':                 85,
      'College of Criminology':                 55,
      'College of Islamic and Arabic Studies':  40,
    };
    // Total = 1000 ✓

    /* ── Course weights within each dept ─────────────────────
       Reflects realistic enrollment preferences at WMSU.
    ─────────────────────────────────────────────────────── */
    const COURSE_WEIGHTS = {
      'College of Computing Studies': {
        'BS Computer Science':        0.45,
        'BS Information Technology':  0.38,
        'BS Information Systems':     0.17,
      },
      'College of Engineering': {
        'BS Civil Engineering':                    0.20,
        'BS Electrical Engineering':               0.17,
        'BS Mechanical Engineering':               0.16,
        'BS Computer Engineering':                 0.15,
        'BS Electronics Engineering':              0.09,
        'BS Chemical Engineering':                 0.07,
        'BS Industrial Engineering':               0.06,
        'BS Geodetic Engineering':                 0.05,
        'BS Environmental Engineering':            0.03,
        'BS Sanitary Engineering':                 0.02,
      },
      'College of Nursing': {
        'BS Nursing': 1.00,
      },
      'College of Business Administration': {
        'BS Business Administration':  0.28,
        'BS Accountancy':              0.26,
        'BS Management Accounting':    0.14,
        'BS Marketing Management':     0.17,
        'BS Hospitality Management':   0.09,
        'BS Tourism Management':       0.06,
      },
      'College of Arts and Sciences': {
        'BA Psychology':           0.22,
        'BA Communication':        0.12,
        'BS Journalism':           0.09,
        'BS Biology':              0.14,
        'BS Chemistry':            0.07,
        'BS Mathematics':          0.09,
        'BS Statistics':           0.07,
        'BS Social Work':          0.08,
        'AB Political Science':    0.07,
        'BA English Language Studies (BAELS)': 0.05,
      },
      'College of Education': {
        'Bachelor of Elementary Education': 0.35,
        'Bachelor of Secondary Education':  0.46,
        'Bachelor of Physical Education':   0.19,
      },
      'College of Agriculture': {
        'BS Agriculture':               0.22,
        'BS Agricultural Engineering':  0.12,
        'BS Agribusiness Management':   0.18,
        'BS Food Technology':           0.15,
        'BS Nutrition and Dietetics':   0.15,
        'BS Environmental Science':     0.08,
        'BS Forestry':                  0.06,
        'BS Agro-Forestry':             0.04,
      },
      'College of Criminology': {
        'BS Criminology': 1.00,
      },
      'College of Islamic and Arabic Studies': {
        'BS Islamic Studies':                    0.42,
        'AB Arabic Language':                    0.33,
        'Bachelor of Islamic Teacher Education': 0.25,
      },
    };

    /* ── Status distribution ────────────────────────────────── */
    function pickStatus(rng, course, oapr, natScore, eatScore) {
      const r = rng();
      const qr = window.WMSU_checkQualification
        ? window.WMSU_checkQualification(course, oapr, natScore, eatScore)
        : { qualified: true };

      if (r < 0.48) return { status: 'pending_review',   deptStatus: null,            admissionStatus: 'valid_applicant' };
      if (r < 0.58) return { status: 'interviewed',      deptStatus: 'for_interview', admissionStatus: 'valid_applicant' };
      if (r < 0.72) return { status: 'reviewed',         deptStatus: 'accepted',      admissionStatus: 'valid_applicant' };
      if (r < 0.80) return { status: 'pending_review',   deptStatus: 'rejected',      admissionStatus: 'valid_applicant' };
      if (r < 0.85) {
        return { status: 'pending_review', deptStatus: null, admissionStatus: 'flagged',
          flagReason: !qr.qualified
            ? 'OAPR does not meet course minimum requirement'
            : 'Suspicious or inconsistent data' };
      }
      return { status: 'pending_review', deptStatus: null, admissionStatus: 'valid_applicant' };
    }

    /* ── Weighted random course picker ───────────────────────── */
    function pickCourse(dept, rng) {
      const weights = COURSE_WEIGHTS[dept];
      if (!weights) return COURSE_KEYS[0];
      const roll = rng();
      let cumulative = 0;
      for (const [course, w] of Object.entries(weights)) {
        cumulative += w;
        if (roll < cumulative) return course;
      }
      return Object.keys(weights)[0];
    }

    /* ── Seeded RNG ──────────────────────────────────────────── */
    function rng(seed) {
      let s = seed;
      return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967295;
      };
    }

    /* ── Build the 1000 applications ─────────────────────────── */
    const apps       = [];
    const usedAppNos = new Set(stored.map(a => a.appNo));
    let   appCounter = 1;

    function nextAppNo() {
      while (usedAppNos.has(`2526-${String(appCounter).padStart(5,'0')}`)) appCounter++;
      const no = `2526-${String(appCounter).padStart(5,'0')}`;
      usedAppNos.add(no);
      appCounter++;
      return no;
    }

    const REJECTION_REASONS = [
      'OAPR does not meet the minimum requirement for this course',
      'No available slots for this program',
      'Incomplete or invalid application documents',
      'Did not appear for scheduled interview',
    ];

    /* Build per-dept batches */
    let globalIdx = 0;
    for (const [dept, targetCount] of Object.entries(DEPT_DISTRIBUTION)) {
      for (let i = 0; i < targetCount; i++) {
        globalIdx++;
        const r      = rng(globalIdx * 137 + 29);
        const appNo  = nextAppNo();
        const rec    = window.WMSU_lookupApplicant(appNo);
        if (!rec) continue;

        const course   = pickCourse(dept, r);
        const req      = REQ[course];
        const daysAgo  = Math.floor(r() * 45) + 1;
        const submitted = new Date(Date.now() - daysAgo * 86400000).toISOString();

        const natScore = req?.extra === 'nat'
          ? Math.floor(240 + r() * 130)
          : null;
        const eatScore = req?.extra === 'eat'
          ? Math.floor(230 + r() * 140)
          : null;

        const oapr    = rec.cet.oapr;
        const statObj = pickStatus(r, course, oapr, natScore, eatScore);

        const acceptedDate = statObj.deptStatus === 'accepted'
          ? new Date(Date.now() - Math.floor(r() * 5) * 86400000).toISOString()
          : null;

        const rejectedDate = statObj.deptStatus === 'rejected'
          ? new Date(Date.now() - Math.floor(r() * 7) * 86400000).toISOString()
          : null;

        let interviewDate = null, interviewMode = null;
        if (statObj.deptStatus === 'for_interview') {
          const futureDays = Math.floor(r() * 14) + 1;
          const d = new Date(Date.now() + futureDays * 86400000);
          d.setHours(8 + Math.floor(r() * 4), r() < 0.5 ? 0 : 30, 0, 0);
          interviewDate = d.toISOString();
          interviewMode = r() < 0.7 ? 'Face-to-face' : (r() < 0.5 ? 'Online (Zoom)' : 'Online (Google Meet)');
        }

        const rejectionReason = statObj.deptStatus === 'rejected'
          ? REJECTION_REASONS[Math.floor(r() * REJECTION_REASONS.length)]
          : null;

        const emailFirst = rec.firstname.toLowerCase().replace(/[^a-z]/g, '');
        const emailLast  = rec.surname.toLowerCase().replace(/\s+/g,'').replace(/[^a-z]/g,'');

        apps.push({
          appNo,
          surname:         rec.surname,
          firstname:       rec.firstname,
          middleinitial:   rec.middleinitial,
          name:            rec.name,
          email:           `${emailFirst}.${emailLast}@email.com`,
          contact:         `09${String(Math.floor(100000000 + r() * 899999999))}`,
          course,
          department:      dept,
          applicantType:   rec.type,
          cet:             rec.cet,
          natScore,
          eatScore,
          submittedDate:   submitted,
          status:          statObj.status,
          admissionStatus: statObj.admissionStatus,
          deptStatus:      statObj.deptStatus,
          flagReason:      statObj.flagReason   || null,
          flagNotes:       null,
          courseLocked:    statObj.deptStatus === 'accepted',
          acceptedDate,
          rejectedDate,
          rejectionReason,
          rejectionNotes:  null,
          interviewDate,
          interviewMode,
          interviewNotes:  null,
          acceptRemarks:   statObj.deptStatus === 'accepted'
            ? 'Congratulations! Please prepare your enrollment documents.'
            : null,
        });
      }
    }

    /* ── Persist ─────────────────────────────────────────────── */
    localStorage.setItem('wmsu_applications', JSON.stringify([...stored, ...apps]));

    console.log(
      `[WMSU-Ease] Seeded ${apps.length} applications across ${Object.keys(DEPT_DISTRIBUTION).length} departments.`
    );
  }

  doSeed();

})();