(function () {

  function doSeed() {
    if (!window.WMSU_CET_DB || !window.WMSU_COURSE_REQUIREMENTS) {
      setTimeout(doSeed, 120);
      return;
    }

    const stored = JSON.parse(localStorage.getItem('wmsu_applications') || '[]');
    if (stored.length >= 950) return;

    const REQ = window.WMSU_COURSE_REQUIREMENTS;

    /* ── Target distribution per department (Total = 950) ── */
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

    /* ── Course weights per department ── */
    const COURSE_WEIGHTS = {
      'College of Computing Studies': {
        'BS Computer Science':       0.48,
        'BS Information Technology': 0.40,
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
        'BS Business Administration': 0.30,
        'BS Accountancy':             0.28,
        'BS Economics':               0.42,
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

    /* ── Seeded RNG ── */
    function makeRng(seed) {
      let s = seed;
      return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967295;
      };
    }

    /* ── Weighted course picker ── */
    function pickCourse(dept, r) {
      const weights = COURSE_WEIGHTS[dept];
      if (!weights) return null;
      const roll = r();
      let acc = 0;
      for (const [course, w] of Object.entries(weights)) {
        acc += w;
        if (roll < acc) return course;
      }
      return Object.keys(weights)[0];
    }

    /* ── Build raw app list ── */
    const rawApps = [];
    const usedNos = new Set(stored.map(a => a.appNo));
    let counter   = 1;

    function nextAppNo() {
      let no;
      do {
        no = `2526-${String(counter).padStart(5, '0')}`;
        counter++;
      } while (usedNos.has(no));
      usedNos.add(no);
      return no;
    }

    let globalIdx = 0;

    for (const [dept, count] of Object.entries(DEPT_DISTRIBUTION)) {
      for (let i = 0; i < count; i++) {
        globalIdx++;
        const r     = makeRng(globalIdx * 137 + 29);
        const appNo = nextAppNo();

        // CET DB is the source of truth for all personal info and scores
        const rec = window.WMSU_lookupApplicant(appNo);
        if (!rec) continue;

        const course = pickCourse(dept, r);
        if (!course) continue;

        const req = REQ[course];

        // Only attach nat/eat scores if the course actually requires them
        // Pull directly from CET DB record (already generated there)
        const natScore = req && req.extra === 'nat' ? rec.natScore : null;
        const eatScore = req && req.extra === 'eat' ? rec.eatScore : null;

        // Submission spread: last 60 days, earlier = lower daysAgo
        const daysAgo   = Math.floor(r() * 60) + 1;
        const submitted = new Date(Date.now() - daysAgo * 86400000).toISOString();

        const emailFirst = rec.firstname.toLowerCase().replace(/[^a-z]/g, '');
        const emailLast  = rec.surname.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');

        rawApps.push({
          appNo,
          surname:       rec.surname,
          firstname:     rec.firstname,
          middleinitial: rec.middleinitial,
          name:          rec.name,
          email:         `${emailFirst}.${emailLast}@email.com`,
          contact:       `09${String(Math.floor(100000000 + r() * 899999999))}`,
          course,
          department:    dept,
          applicantType: rec.type,
          cet:           rec.cet,
          natScore,
          eatScore,
          submittedDate: submitted,
          _idx:          globalIdx,
        });
      }
    }

    /* ── Sort by submission date ascending ── */
    rawApps.sort((a, b) => new Date(a.submittedDate) - new Date(b.submittedDate));

    /* ── Group by department ── */
    const byDept = {};
    for (const a of rawApps) {
      if (!byDept[a.department]) byDept[a.department] = [];
      byDept[a.department].push(a);
    }

    /* ── Build auto-schedule (skip if dept already has one) ── */
    function buildSchedule(apps) {
      const perDay     = 80;
      const daysNeeded = Math.ceil(apps.length / perDay);
      const days       = [];
      const dt         = new Date(Date.now() + 7 * 86400000);
      while (days.length < daysNeeded) {
        const dow = dt.getDay();
        if (dow !== 0 && dow !== 6) days.push(dt.toISOString().slice(0, 10));
        dt.setDate(dt.getDate() + 1);
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

    function getSchedKey(dept) {
      return `wmsu_isched_${btoa(unescape(encodeURIComponent(dept))).replace(/=/g, '')}`;
    }

    for (const [dept, apps] of Object.entries(byDept)) {
      const key = getSchedKey(dept);
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(buildSchedule(apps)));
      }
    }

    /* ── Assign interview slots in submission order ── */
    function assignSlots(dept, apps) {
      let cfg;
      try { cfg = JSON.parse(localStorage.getItem(getSchedKey(dept))); }
      catch (e) { cfg = null; }
      if (!cfg) return apps.map(a => ({ ...a, interviewSlot: null }));

      const amCap  = cfg.amCapacity || 40;
      const pmCap  = cfg.pmCapacity || 40;
      const perDay = amCap + pmCap;

      return apps.map((a, i) => {
        const dayIdx   = Math.floor(i / perDay);
        const within   = i % perDay;
        const isAM     = within < amCap;
        const dayEntry = cfg.days[dayIdx];
        return {
          ...a,
          interviewSlot: dayEntry
            ? { date: dayEntry.date, session: isAM ? 'AM' : 'PM', time: isAM ? cfg.amStart : cfg.pmStart }
            : null,
        };
      });
    }

    /* ── Rejection reasons pool ── */
    const REJECTION_REASONS = [
      'OAPR does not meet the minimum requirement for this course',
      'No available slots for this program',
      'Incomplete or invalid application documents',
      'Did not appear for scheduled interview',
    ];

    /* ── Assign statuses and finalize ── */
    const finalApps = [];

    for (const [dept, apps] of Object.entries(byDept)) {
      const withSlots = assignSlots(dept, apps);

      withSlots.forEach(a => {
        const r = makeRng(a._idx * 53 + 7);

        const { _idx, ...clean } = a;

        // ~5% flagged
        if (r() < 0.05) {
          finalApps.push({
            ...clean,
            status:          'pending_review',
            admissionStatus: 'flagged',
            deptStatus:      null,
            flagReason:      'Suspicious or inconsistent application data',
            flagNotes:       null,
            courseLocked:    false,
            acceptedDate:    null,
            rejectedDate:    null,
            rejectionReason: null,
            rejectionNotes:  null,
            interviewNotes:  null,
            acceptRemarks:   null,
            interviewEval:   null,
          });
          return;
        }

        // Status roll for remaining 95%
        const roll          = r();
        let status          = 'pending_review';
        let deptStatus      = 'for_interview';
        let acceptedDate    = null;
        let rejectedDate    = null;
        let rejectionReason = null;
        let acceptRemarks   = null;
        let courseLocked    = false;

        if (roll < 0.15) {
          // ~15% already accepted
          deptStatus    = 'accepted';
          status        = 'reviewed';
          acceptedDate  = new Date(Date.now() - (Math.floor(r() * 5) + 1) * 86400000).toISOString();
          acceptRemarks = 'Congratulations! Please prepare your enrollment documents.';
          courseLocked  = true;
        } else if (roll < 0.22) {
          // ~7% rejected
          deptStatus      = 'rejected';
          status          = 'pending_review';
          rejectedDate    = new Date(Date.now() - (Math.floor(r() * 7) + 1) * 86400000).toISOString();
          rejectionReason = REJECTION_REASONS[Math.floor(r() * REJECTION_REASONS.length)];
        }
        // ~73% stay as for_interview — waiting for seedInterviewEvals.js

        finalApps.push({
          ...clean,
          status,
          admissionStatus: 'valid_applicant',
          deptStatus,
          flagReason:      null,
          flagNotes:       null,
          courseLocked,
          acceptedDate,
          rejectedDate,
          rejectionReason,
          rejectionNotes:  null,
          interviewNotes:  null,
          acceptRemarks,
          interviewEval:   null,
        });
      });
    }

    /* ── Persist ── */
    localStorage.setItem('wmsu_applications', JSON.stringify([...stored, ...finalApps]));
    console.log(
      `[WMSU-Ease] ✅ Seeded ${finalApps.length} applications across ${Object.keys(DEPT_DISTRIBUTION).length} departments.` +
      `\n➡ Now run seedInterviewEvals.js to mark ~50% as interviewed with evaluation scores.`
    );
  }

  doSeed();

})();