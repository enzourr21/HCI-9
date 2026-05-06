(function () {

  function doSeedEvals() {
    if (!window.WMSU_CET_DB || !window.WMSU_COURSE_REQUIREMENTS) {
      setTimeout(doSeedEvals, 120);
      return;
    }

    let apps;
    try { apps = JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); }
    catch (e) { console.error('[seedInterviewEvals] Could not parse wmsu_applications.'); return; }

    if (!apps.length) {
      console.warn('[seedInterviewEvals] No applications found. Run seedApplications.js first.');
      return;
    }

    // Already seeded guard: if any app already has interviewEval, skip
    const alreadySeeded = apps.some(a => a.interviewEval != null);
    if (alreadySeeded) {
      console.log('[seedInterviewEvals] Interview evals already seeded. Skipping.');
      return;
    }

    /* ── Evaluators per college ── */
    const EVALUATORS = {
      'College of Computing Studies':          ['Prof. Ariel Bautista', 'Dr. Josephine Reyes', 'Assoc. Prof. Mark Villanueva'],
      'College of Engineering':                ['Dr. Rodrigo Lim', 'Prof. Carmela Santos', 'Engr. Eduardo Uy'],
      'College of Nursing':                    ['Dr. Maricel Gonzalez', 'Prof. Lourdes Aquino', 'RN Bernardo Dela Cruz'],
      'College of Business Administration':    ['Prof. Patricia Mendoza', 'Dr. Francisco Tan', 'MBA Cristina Ocampo'],
      'College of Arts and Sciences':          ['Dr. Helena Castro', 'Prof. Roberto Sicat', 'Dr. Marilou Ferrer'],
      'College of Education':                  ['Prof. Analiza Domingo', 'Dr. Emmanuel Ramos', 'Prof. Rosario Pascual'],
      'College of Agriculture':                ['Dr. Vicente Magno', 'Prof. Teresita Corpuz', 'Agr. Renato Macapagal'],
      'College of Criminology':                ['Insp. Danilo Salazar', 'Dr. Elvira Perez', 'Prof. Alberto Natividad'],
      'College of Islamic and Arabic Studies': ['Prof. Fatima Al-Rashid', 'Dr. Ahmad Guiamalon', 'Sheikh Hamid Macacuna'],
    };

    /* ── Interview criteria (mirrors dept-head.js) ── */
    const BASE_CRITERIA = [
      { id: 'comm',  label: 'Communication Skills', max: 5 },
      { id: 'motiv', label: 'Motivation & Goals',    max: 5 },
      { id: 'char',  label: 'Character & Integrity', max: 5 },
      { id: 'adapt', label: 'Adaptability',          max: 5 },
    ];
    const EXTRA_CRITERIA = {
      'College of Computing Studies':          [{ id: 'logic',    label: 'Logical & Analytical Thinking', max: 5 }, { id: 'techint',  label: 'Technology Interest',          max: 5 }],
      'College of Engineering':                [{ id: 'mathap',   label: 'Mathematical Aptitude',         max: 5 }, { id: 'techap',   label: 'Technical Problem Solving',    max: 5 }],
      'College of Nursing':                    [{ id: 'empathy',  label: 'Empathy & Compassion',          max: 5 }, { id: 'stress',   label: 'Stress Resilience',            max: 5 }],
      'College of Business Administration':    [{ id: 'lead',     label: 'Leadership Potential',         max: 5 }, { id: 'bizmind',  label: 'Business Mindset',             max: 5 }],
      'College of Arts and Sciences':          [{ id: 'crit',     label: 'Critical & Creative Thinking', max: 5 }, { id: 'research', label: 'Research Orientation',         max: 5 }],
      'College of Education':                  [{ id: 'teach',    label: 'Teaching Aptitude',            max: 5 }, { id: 'patience', label: 'Patience & Dedication',        max: 5 }],
      'College of Agriculture':                [{ id: 'enviro',   label: 'Environmental Awareness',      max: 5 }, { id: 'practical',label: 'Practical Mindset',             max: 5 }],
      'College of Criminology':                [{ id: 'ethics',   label: 'Ethics & Sense of Justice',    max: 5 }, { id: 'observe',  label: 'Observational Skills',         max: 5 }],
      'College of Islamic and Arabic Studies': [{ id: 'cultural', label: 'Cultural Appreciation',        max: 5 }, { id: 'lang',     label: 'Language Aptitude',            max: 5 }],
    };

    function getCriteria(dept) {
      return [...BASE_CRITERIA, ...(EXTRA_CRITERIA[dept] || [])];
    }

    /* ── Remarks pools ── */
    const REMARKS = {
      high: [
        'Highly impressive candidate — articulate, driven, and clearly passionate about the field.',
        'Outstanding performance. Strong communicator with very clear academic and career goals.',
        'Excellent overall. Demonstrated maturity and excellent critical thinking throughout.',
        'One of the best interviews this cycle. Recommend strongly for immediate acceptance.',
        'Remarkable composure and depth of answers. A standout applicant.',
      ],
      mid: [
        'Solid candidate. Shows genuine interest though could benefit from more clarity on goals.',
        'Good communication, slightly hesitant on technical questions. Acceptable overall.',
        'Average performance but positive attitude. Worth considering given qualifications.',
        'Meets basic expectations. Recommend conditional acceptance pending slot availability.',
        'Decent interview. Some areas need improvement but fundamentally a capable applicant.',
      ],
      low: [
        'Struggled with core questions. Motivation appears unclear at this stage.',
        'Below-average performance. Applicant was unprepared for most interview questions.',
        'Communication was very limited. Difficult to assess true capability.',
        'Did not meet interview standards. Recommend re-evaluation or rejection.',
        'Significant gaps in knowledge and preparedness. Does not meet department expectations.',
      ],
    };

    function getRemark(pct, r) {
      const pool = pct >= 70 ? REMARKS.high : pct >= 45 ? REMARKS.mid : REMARKS.low;
      return pool[Math.floor(r() * pool.length)];
    }

    function getRecommendation(pct) {
      if (pct >= 80) return 'Highly Recommended';
      if (pct >= 60) return 'Recommended';
      if (pct >= 40) return 'For Consideration';
      return 'Not Recommended';
    }

    /* ── Seeded RNG ── */
    function makeRng(seed) {
      let s = seed;
      return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967295;
      };
    }

    /* ── Weighted score (realistic bell curve, avoids all 1s or all 5s) ── */
    function randScore(max, r) {
      // Probability weights for scores 0..5
      const weights = [0, 0.05, 0.18, 0.34, 0.29, 0.14];
      const roll = r();
      let acc = 0;
      for (let i = 0; i <= max; i++) {
        acc += (weights[i] || 0);
        if (roll < acc) return i;
      }
      return max;
    }

    /* ── Group eligible apps by dept, pick first 50% of for_interview ── */
    const byDept = {};
    apps.forEach((a, i) => {
      if (!a.department || a.admissionStatus === 'flagged') return;
      if (a.deptStatus !== 'for_interview') return; // only seed those awaiting interview
      if (!byDept[a.department]) byDept[a.department] = [];
      byDept[a.department].push(i); // store original array index
    });

    let totalSeeded = 0;

    for (const [dept, indices] of Object.entries(byDept)) {
      const criteria   = getCriteria(dept);
      const maxTotal   = criteria.reduce((s, c) => s + c.max, 0);
      const evaluators = EVALUATORS[dept] || ['Prof. Anonymous'];

      // Take first 50% (already sorted by submission date from seedApplications)
      const halfCount = Math.ceil(indices.length / 2);
      const toEval    = indices.slice(0, halfCount);

      toEval.forEach(origIdx => {
        const a   = apps[origIdx];
        const r   = makeRng(origIdx * 97 + 3);

        const criteriaScores = criteria.map(c => ({
          id:    c.id,
          label: c.label,
          score: randScore(c.max, r),
          max:   c.max,
        }));

        const totalScore = criteriaScores.reduce((s, c) => s + c.score, 0);
        const percentage = Math.round(totalScore / maxTotal * 100);
        const evaluator  = evaluators[Math.floor(r() * evaluators.length)];

        // Eval happened 1–14 days ago (before today)
        const daysAgo = Math.floor(r() * 14) + 1;
        const evalDate = new Date(Date.now() - daysAgo * 86400000).toISOString();

        apps[origIdx].interviewEval = {
          interviewer:    evaluator,
          recommendation: getRecommendation(percentage),
          remarks:        getRemark(percentage, r),
          totalScore,
          maxScore:       maxTotal,
          percentage,
          criteria:       criteriaScores,
          evaluatedAt:    evalDate,
        };

        // Move to "interviewed" → shows up as "For Review" in the dept-head dashboard
        apps[origIdx].deptStatus = 'interviewed';
        apps[origIdx].status     = 'reviewed';

        totalSeeded++;
      });

      console.log(`[seedInterviewEvals] ${dept}: ${toEval.length}/${indices.length} marked as interviewed.`);
    }

    /* ── Save ── */
    try {
      localStorage.setItem('wmsu_applications', JSON.stringify(apps));
      console.log(
        `\n[seedInterviewEvals] ✅ Done! ${totalSeeded} applicants marked as interviewed across ${Object.keys(byDept).length} colleges.` +
        `\nRefresh the dept-head page and select a department — they will appear under "For Review".`
      );
    } catch (e) {
      console.error('[seedInterviewEvals] Failed to save to localStorage:', e);
    }
  }

  doSeedEvals();

})();