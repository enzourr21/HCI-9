(function () {

  function doSeed() {
    if (!window.WMSU_CET_DB || !window.WMSU_COURSE_REQUIREMENTS) {
      setTimeout(doSeed, 120);
      return;
    }

    const stored = JSON.parse(localStorage.getItem('wmsu_applications') || '[]');
    if (stored.length >= 950) return;

    const REQ = window.WMSU_COURSE_REQUIREMENTS;

    /* ── Target distribution per department ──────────────────
       Total = 950
    ─────────────────────────────────────────────────────── */
    const DEPT_DISTRIBUTION = {
      'College of Computing Studies':          114,
      'College of Engineering':                190,
      'College of Nursing':                     76,
      'College of Business Administration':    162,
      'College of Arts and Sciences':          152,
      'College of Education':                   86,
      'College of Agriculture':                 81,
      'College of Criminology':                 52,
      'College of Islamic and Arabic Studies':  37,
    };
    // Total = 950 ✓

    /* ── Course weights ── */
    const COURSE_WEIGHTS = {
      'College of Computing Studies': {
        'BS Computer Science':        0.48,
        'BS Information Technology':  0.40,
        'Associate in Computer Technology major in Networking Application Development': 0.12,
      },
      'College of Engineering': {
        'BS Civil Engineering':                     0.22,
        'BS Mechanical Engineering':                0.20,
        'BS Electrical Engineering':                0.14,
        'BS Sanitary Engineering':                  0.10,
        'BS Computer Engineering':                  0.10,
        'BS Industrial Engineering':                0.08,
        'BS Geodetic Engineering':                  0.07,
        'BS Electronics Communication Engineering': 0.05,
        'BS Environmental Engineering':             0.03,
        'BS Agricultural Biosystem Engineering':    0.01,
      },
      'College of Nursing': {
        'BS Nursing': 1.00,
      },
      'College of Business Administration': {
        'BS Business Administration':  0.30,
        'BS Accountancy':              0.28,
        'BS Economics':                0.42,
      },
      'College of Arts and Sciences': {
        'BA Psychology':                       0.24,
        'BA Political Science':                0.14,
        'BS Journalism':                       0.12,
        'BA Broadcasting':                     0.14,
        'BA English Language Studies (BAELS)': 0.12,
        'BS Asian Studies':                    0.24,
      },
      'College of Education': {
        'Bachelor of Elementary Education': 0.35,
        'Bachelor of Secondary Education':  0.46,
        'Bachelor of Physical Education':   0.19,
      },
      'College of Agriculture': {
        'BS Agriculture':             0.18,
        'BS Agri Business':           0.15,
        'BS Food Technology':         0.14,
        'BS Forestry':                0.10,
        'BS Nutrition and Dietetics': 0.14,
        'BS Environmental Science':   0.11,
        'BS Agro-Forestry':           0.09,
        'BS Home Economics':          0.09,
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

    /* ── Weighted random course picker ── */
    function pickCourse(dept, rng) {
      const weights = COURSE_WEIGHTS[dept];
      if (!weights) return null;
      const roll = rng();
      let cumulative = 0;
      for (const [course, w] of Object.entries(weights)) {
        cumulative += w;
        if (roll < cumulative) return course;
      }
      return Object.keys(weights)[0];
    }

    /* ── Seeded RNG ── */
    function rng(seed) {
      let s = seed;
      return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967295;
      };
    }

    /* ── Build all applications first (no status assignment yet) ── */
    const rawApps = [];
    const usedAppNos = new Set(stored.map(a => a.appNo));
    let appCounter = 1;

    function nextAppNo() {
      while (usedAppNos.has(`2526-${String(appCounter).padStart(5, '0')}`)) appCounter++;
      const no = `2526-${String(appCounter).padStart(5, '0')}`;
      usedAppNos.add(no);
      appCounter++;
      return no;
    }

    let globalIdx = 0;
    for (const [dept, targetCount] of Object.entries(DEPT_DISTRIBUTION)) {
      for (let i = 0; i < targetCount; i++) {
        globalIdx++;
        const r     = rng(globalIdx * 137 + 29);
        const appNo = nextAppNo();
        const rec   = window.WMSU_lookupApplicant(appNo);
        if (!rec) continue;

        const course = pickCourse(dept, r);
        if (!course) continue;

        const req     = REQ[course];
        // Spread submissions over last 60 days — earlier applicants submitted first
        const daysAgo = Math.floor(r() * 60) + 1;
        const submitted = new Date(Date.now() - daysAgo * 86400000).toISOString();

        const natScore = req?.extra === 'nat'
          ? Math.floor(240 + r() * 130)
          : null;
        const eatScore = req?.extra === 'eat'
          ? Math.floor(230 + r() * 140)
          : null;

        const oapr = rec.cet.oapr;

        const emailFirst = rec.firstname.toLowerCase().replace(/[^a-z]/g, '');
        const emailLast  = rec.surname.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');

        rawApps.push({
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
          _rngState:       globalIdx, // for later use
        });
      }
    }

    /* ── Sort all apps by submission date (earliest first) ── */
    rawApps.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));

    /* ── Auto-schedule interview slots based on submission order ──
       Each department gets auto-generated interview days.
       40 AM + 40 PM per day = 80/day.
       Schedule starts 7 days from now.
    ── */
    function buildDeptAutoSchedule(dept, deptApps) {
      const totalApps = deptApps.length;
      const perDay    = 80; // 40 AM + 40 PM
      const daysNeeded = Math.ceil(totalApps / perDay);

      const days = [];
      for (let d = 0; d < daysNeeded; d++) {
        const dt = new Date(Date.now() + (7 + d) * 86400000);
        // Skip weekends
        while (dt.getDay() === 0 || dt.getDay() === 6) {
          dt.setDate(dt.getDate() + 1);
        }
        days.push(dt.toISOString().slice(0, 10));
      }

      return {
        days:       days.map(date => ({ date })),
        amStart:    '08:00',
        amEnd:      '12:00',
        amCapacity: 40,
        pmStart:    '13:00',
        pmEnd:      '17:00',
        pmCapacity: 40,
      };
    }

    /* ── Group apps by dept and assign interview slots in order ── */
    const deptAppsMap = {};
    for (const a of rawApps) {
      if (!deptAppsMap[a.department]) deptAppsMap[a.department] = [];
      deptAppsMap[a.department].push(a);
    }

    // Save auto-schedule configs per dept (only if not already configured)
    for (const [dept, apps] of Object.entries(deptAppsMap)) {
      const schedKey = `wmsu_isched_${btoa(unescape(encodeURIComponent(dept))).replace(/=/g, '')}`;
      if (!localStorage.getItem(schedKey)) {
        const cfg = buildDeptAutoSchedule(dept, apps);
        localStorage.setItem(schedKey, JSON.stringify(cfg));
      }
    }

    /* ── Assign interview slots to all applicants in submission order ── */
    function assignSlots(dept, apps) {
      const schedKey = `wmsu_isched_${btoa(unescape(encodeURIComponent(dept))).replace(/=/g, '')}`;
      let cfg;
      try { cfg = JSON.parse(localStorage.getItem(schedKey)); } catch(e) { cfg = null; }
      if (!cfg) return apps; // no schedule, leave as-is

      let slotIdx = 0; // global slot index across all days/sessions

      return apps.map((a, i) => {
        // Determine which day/session this applicant falls in
        const amCap = cfg.amCapacity || 40;
        const pmCap = cfg.pmCapacity || 40;
        const perDay = amCap + pmCap;

        const dayIdx     = Math.floor(slotIdx / perDay);
        const withinDay  = slotIdx % perDay;
        const isAM       = withinDay < amCap;
        const session    = isAM ? 'AM' : 'PM';
        const time       = isAM ? cfg.amStart : cfg.pmStart;
        const dayEntry   = cfg.days[dayIdx];

        slotIdx++;

        if (!dayEntry) return { ...a, interviewSlot: null };

        return {
          ...a,
          interviewSlot: {
            date: dayEntry.date,
            session,
            time,
          },
        };
      });
    }

    /* ── Status distribution ── */
    const REJECTION_REASONS = [
      'OAPR does not meet the minimum requirement for this course',
      'No available slots for this program',
      'Incomplete or invalid application documents',
      'Did not appear for scheduled interview',
    ];

    function pickStatus(seed, course, oapr, natScore, eatScore) {
      const r = rng(seed * 7 + 13);
      const roll = r();

      const qr = window.WMSU_checkQualification
        ? window.WMSU_checkQualification(course, oapr, natScore, eatScore)
        : { qualified: true };

      // Most are pending_review (awaiting decision by dept head)
      if (roll < 0.55) return { status: 'pending_review', deptStatus: null, admissionStatus: 'valid_applicant' };
      if (roll < 0.70) return { status: 'reviewed',       deptStatus: 'accepted', admissionStatus: 'valid_applicant' };
      if (roll < 0.78) return { status: 'pending_review', deptStatus: 'rejected', admissionStatus: 'valid_applicant' };
      if (roll < 0.83) {
        return {
          status: 'pending_review', deptStatus: null, admissionStatus: 'flagged',
          flagReason: !qr.qualified
            ? 'OAPR does not meet course minimum requirement'
            : 'Suspicious or inconsistent data',
        };
      }
      return { status: 'pending_review', deptStatus: null, admissionStatus: 'valid_applicant' };
    }

    /* ── Combine: assign slots, then assign statuses ── */
    const finalApps = [];

    for (const [dept, apps] of Object.entries(deptAppsMap)) {
      const withSlots = assignSlots(dept, apps);

      withSlots.forEach((a, i) => {
        const seed    = a._rngState || (i + 1);
        const r       = rng(seed * 137 + 29);
        const statObj = pickStatus(seed, a.course, a.cet?.oapr || 0, a.natScore, a.eatScore);

        const acceptedDate = statObj.deptStatus === 'accepted'
          ? new Date(Date.now() - Math.floor(r() * 5) * 86400000).toISOString()
          : null;

        const rejectedDate = statObj.deptStatus === 'rejected'
          ? new Date(Date.now() - Math.floor(r() * 7) * 86400000).toISOString()
          : null;

        const rejectionReason = statObj.deptStatus === 'rejected'
          ? REJECTION_REASONS[Math.floor(r() * REJECTION_REASONS.length)]
          : null;

        // Remove internal _rngState
        const { _rngState, ...cleanApp } = a;

        finalApps.push({
          ...cleanApp,
          status:          statObj.status,
          admissionStatus: statObj.admissionStatus,
          deptStatus:      statObj.deptStatus,
          flagReason:      statObj.flagReason  || null,
          flagNotes:       null,
          courseLocked:    statObj.deptStatus === 'accepted',
          acceptedDate,
          rejectedDate,
          rejectionReason,
          rejectionNotes:  null,
          interviewNotes:  null,
          acceptRemarks:   statObj.deptStatus === 'accepted'
            ? 'Congratulations! Please prepare your enrollment documents.'
            : null,
        });
      });
    }

    /* ── Persist ── */
    localStorage.setItem('wmsu_applications', JSON.stringify([...stored, ...finalApps]));

    console.log(
      `[WMSU-Ease] Seeded ${finalApps.length} applications across ${Object.keys(DEPT_DISTRIBUTION).length} departments with auto-interview slots.`
    );
  }

  doSeed();

})();