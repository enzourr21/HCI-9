/**
 * WMSU-Ease — Seed Applications
 * Populates localStorage with 20 demo applicants for the Admission Office dashboard.
 * Only runs if fewer than 10 applications already exist.
 */
(function () {
  function doSeed() {
    if (!window.WMSU_CET_DB || !window.WMSU_COURSE_REQUIREMENTS) {
      setTimeout(doSeed, 120);
      return;
    }

    const stored = JSON.parse(localStorage.getItem('wmsu_applications') || '[]');
    if (stored.length >= 10) return; // already seeded

    const REQ = window.WMSU_COURSE_REQUIREMENTS;

    /* prettier-ignore */
    const SEEDS = [
      { appNo:'2526-00001', course:'BS Computer Science',                        status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00002', course:'BS Nursing',                                 status:'reviewed',        type:'freshman',   deptStatus:'accepted', natScore:295 },
      { appNo:'2526-00003', course:'BS Civil Engineering',                       status:'pending_review',  type:'freshman',   eatScore:268 },
      { appNo:'2526-00004', course:'BS Information Technology',                  status:'reviewed',        type:'transferee' },
      { appNo:'2526-00005', course:'BS Business Administration',                 status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00006', course:'BS Nursing',                                 status:'interviewed',     type:'freshman',   natScore:272 },
      { appNo:'2526-00007', course:'BS Accountancy',                             status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00008', course:'BS Computer Engineering',                    status:'pending_review',  type:'freshman',   eatScore:258 },
      { appNo:'2526-00009', course:'BA Psychology',                              status:'reviewed',        type:'transferee' },
      { appNo:'2526-00010', course:'BS Criminology',                             status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00011', course:'BS Mechanical Engineering',                  status:'reviewed',        type:'freshman',   deptStatus:'accepted', eatScore:271 },
      { appNo:'2526-00012', course:'BS Food Technology',                         status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00013', course:'BS Journalism',                              status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00014', course:'Bachelor of Secondary Education',            status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00015', course:'BS Agriculture',                             status:'reviewed',        type:'transferee' },
      { appNo:'2526-00016', course:'BS Electrical Engineering',                  status:'pending_review',  type:'freshman',   eatScore:238,
        admissionStatus:'flagged', flagReason:'OAPR does not meet course minimum requirement' },
      { appNo:'2526-00017', course:'BS Computer Science',                        status:'interviewed',     type:'freshman'  },
      { appNo:'2526-00018', course:'BS Hospitality Management',                  status:'pending_review',  type:'transferee' },
      { appNo:'2526-00019', course:'BS Nutrition and Dietetics',                 status:'pending_review',  type:'freshman'  },
      { appNo:'2526-00020', course:'BS Islamic Studies',                         status:'reviewed',        type:'freshman',   deptStatus:'accepted' },
    ];

    const rng = (seed) => {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967295; };
    };

    const existingNos = new Set(stored.map(a => a.appNo));
    const apps = [];

    SEEDS.forEach((s, idx) => {
      if (existingNos.has(s.appNo)) return;
      const rec = window.WMSU_lookupApplicant(s.appNo);
      if (!rec) return;

      const r   = rng(idx * 97 + 7);
      const req = REQ[s.course];

      const daysAgo  = Math.floor(r() * 12) + 1;
      const submitted = new Date(Date.now() - daysAgo * 86400000).toISOString();

      apps.push({
        appNo:          s.appNo,
        surname:        rec.surname,
        firstname:      rec.firstname,
        middleinitial:  rec.middleinitial,
        name:           rec.name,
        email:          `${rec.firstname.toLowerCase()}.${rec.surname.toLowerCase().replace(/\s+/g,'').replace(/[^a-z]/g,'')}@email.com`,
        contact:        `09${String(Math.floor(100000000 + r() * 899999999))}`,
        course:         s.course,
        department:     req?.dept || 'Other',
        applicantType:  s.type || rec.type,
        cet:            rec.cet,
        natScore:       s.natScore  || null,
        eatScore:       s.eatScore  || null,
        submittedDate:  submitted,
        status:         s.status         || 'pending_review',
        admissionStatus:s.admissionStatus || 'valid_applicant',
        deptStatus:     s.deptStatus     || null,
        flagReason:     s.flagReason     || null,
        flagNotes:      null,
        acceptedDate:   s.deptStatus === 'accepted'
                          ? new Date(Date.now() - Math.floor(r() * 2) * 86400000).toISOString()
                          : null,
      });
    });

    localStorage.setItem('wmsu_applications', JSON.stringify([...stored, ...apps]));
  }

  doSeed();
})();