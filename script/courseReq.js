/**
 * WMSU-Ease — Course Requirements
 * Defines OAPR minimums, extra requirements, department mapping, and icons.
 * Used by both Admission Office and Department Head dashboards.
 *
 * Composite Score Formulas (based on WMSU official records):
 *   BS Nursing  → Composite = (OAPR × 0.40) + (NAT × 0.60)   [40% CET + 60% NAT]
 *   Engineering → Composite = (OAPR × 0.60) + (EAT × 0.40)   [60% CET + 40% EAT]
 */

(function () {

  window.WMSU_COURSE_REQUIREMENTS = {

    /* ── College of Computing Studies ─────────────────────── */
    'BS Computer Science': {
      dept: 'College of Computing Studies',
      oaprMin: 75,
      extra: null,
      note: 'Strong analytical and logical skills required.',
      icon: '💻',
    },
    'BS Information Technology': {
      dept: 'College of Computing Studies',
      oaprMin: 70,
      extra: null,
      note: 'Emphasis on systems and network administration.',
      icon: '🖥️',
    },
    'Associate in Computer Technology major in Networking Application Development': {
      dept: 'College of Computing Studies',
      oaprMin: 45,
      extra: null,
      note: 'OAPR ≥45 required for ACT applicants.',
      icon: '💻',
    },
    'Associate in Computer Technology major in App Development': {
      dept: 'College of Computing Studies',
      oaprMin: 45,
      extra: null,
      note: 'OAPR ≥45 required for ACT applicants.',
      icon: '💻',
    },

    /* ── College of Engineering ────────────────────────────── */
    'BS Civil Engineering': {
      dept: 'College of Engineering',
      oaprMin: 90,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Strong math and physics background needed.',
      icon: '🏗️',
    },
    'BS Electrical Engineering': {
      dept: 'College of Engineering',
      oaprMin: 85,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Emphasis on circuits and power systems.',
      icon: '⚡',
    },
    'BS Mechanical Engineering': {
      dept: 'College of Engineering',
      oaprMin: 85,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Focus on thermodynamics and machine design.',
      icon: '⚙️',
    },
    'BS Sanitary Engineering': {
      dept: 'College of Engineering',
      oaprMin: 85,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Focus on sanitation and environmental systems.',
      icon: '🚰',
    },
    'BS Computer Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Combines hardware and software engineering.',
      icon: '🔌',
    },
    'BS Electronics Communication Engineering': {
      dept: 'College of Engineering',
      oaprMin: 60,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Focus on electronic systems and communications.',
      icon: '📡',
    },
    'BS Environmental Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT.',
      icon: '🌿',
    },
    'BS Industrial Engineering': {
      dept: 'College of Engineering',
      oaprMin: 80,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Focus on systems optimization.',
      icon: '🏭',
    },
    'BS Geodetic Engineering': {
      dept: 'College of Engineering',
      oaprMin: 80,
      extra: 'eat',
      eatMin: 250,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥250 required. Composite = 60% CET + 40% EAT. Focus on surveying and geospatial engineering.',
      icon: '🛰️',
    },
    'BS Agricultural Biosystem Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      eatMin: 240,
      compositeFormula: '60% CET + 40% EAT',
      note: 'EAT score ≥240 required. Composite = 60% CET + 40% EAT. Combines farming knowledge with engineering.',
      icon: '🚜',
    },

    /* ── College of Nursing ────────────────────────────────── */
    'BS Nursing': {
      dept: 'College of Nursing',
      oaprMin: 90,
      extra: 'nat',
      natMin: 260,
      compositeFormula: '40% CET + 60% NAT',
      note: 'NAT score ≥260 required. Composite = 40% CET + 60% NAT. High academic and clinical standards.',
      icon: '🩺',
    },

    /* ── College of Business Administration ────────────────── */
    'BS Business Administration': {
      dept: 'College of Business Administration',
      oaprMin: 75,
      extra: null,
      note: 'Open to all qualified applicants. Focus on management and entrepreneurship.',
      icon: '💼',
    },
    'BS Accountancy': {
      dept: 'College of Business Administration',
      oaprMin: 90,
      extra: null,
      note: 'Strong quantitative skills required for CPA board exam preparation.',
      icon: '🧾',
    },
    'BS Economics': {
      dept: 'College of Business Administration',
      oaprMin: 75,
      extra: null,
      note: 'Focus on economic analysis, policy, and quantitative methods.',
      icon: '📈',
    },
    'BS Management Accounting': {
      dept: 'College of Business Administration',
      oaprMin: 70,
      extra: null,
      note: 'Focus on managerial decision-making and financial reporting.',
      icon: '📊',
    },
    'BS Marketing Management': {
      dept: 'College of Business Administration',
      oaprMin: 70,
      extra: null,
      note: 'Focus on consumer behavior, branding, and digital marketing.',
      icon: '📣',
    },
    'BS Hospitality Management': {
      dept: 'College of Business Administration',
      oaprMin: 70,
      extra: null,
      note: 'Focus on hotel, restaurant, and tourism industry management.',
      icon: '🏨',
    },
    'BS Tourism Management': {
      dept: 'College of Business Administration',
      oaprMin: 70,
      extra: null,
      note: 'Focus on travel, tourism planning, and cultural heritage.',
      icon: '✈️',
    },

    /* ── College of Arts and Sciences ──────────────────────── */
    'BA Psychology': {
      dept: 'College of Arts and Sciences',
      oaprMin: 85,
      extra: null,
      note: 'Focus on human behavior, mental processes, and research methods.',
      icon: '🧠',
    },
    'BA Political Science': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Focus on governance, public policy, and political theory.',
      icon: '🏛️',
    },
    'BS Journalism': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Training in print, broadcast, and digital media.',
      icon: '📰',
    },
    'BA Broadcasting': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Focus on broadcast media, production, and media communications.',
      icon: '📺',
    },
    'BA English Language Studies (BAELS)': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Focus on English linguistics, literature, and language instruction.',
      icon: '📝',
    },
    'BS Asian Studies': {
      dept: 'College of Arts and Sciences',
      oaprMin: 65,
      extra: null,
      note: 'Focus on Asian history, politics, and cultures.',
      icon: '🌏',
    },
    'BA Communication': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Emphasis on media, journalism, and public relations.',
      icon: '🎙️',
    },
    'BS Biology': {
      dept: 'College of Arts and Sciences',
      oaprMin: 85,
      extra: null,
      note: 'Strong science background required for pre-medicine or research track.',
      icon: '🔬',
    },
    'BS Chemistry': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Strong analytical chemistry and laboratory skills required.',
      icon: '⚗️',
    },
    'BS Mathematics': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'High quantitative skills required. Prepares for research and teaching.',
      icon: '📐',
    },
    'BS Statistics': {
      dept: 'College of Arts and Sciences',
      oaprMin: 70,
      extra: null,
      note: 'Strong math background. Focus on data analysis and research.',
      icon: '📉',
    },

    /* ── College of Education ───────────────────────────────── */
    'Bachelor of Elementary Education': {
      dept: 'College of Education',
      oaprMin: 70,
      extra: null,
      note: 'Prepares graduates for Licensure Examination for Teachers (LET).',
      icon: '📚',
    },
    'Bachelor of Secondary Education': {
      dept: 'College of Education',
      oaprMin: 75,
      extra: null,
      note: 'Prepares graduates for LET with major in chosen discipline.',
      icon: '🎓',
    },
    'Bachelor of Physical Education': {
      dept: 'College of Education',
      oaprMin: 70,
      extra: null,
      note: 'Focus on physical fitness, sports science, and health education.',
      icon: '🏃',
    },

    /* ── College of Agriculture ─────────────────────────────── */
    'BS Agriculture': {
      dept: 'College of Agriculture',
      oaprMin: 85,
      extra: null,
      note: 'Focus on crop science, animal husbandry, and sustainable farming.',
      icon: '🌾',
    },
    'BS Agri Business': {
      dept: 'College of Agriculture',
      oaprMin: 65,
      extra: null,
      note: 'Focus on farm enterprise management and agricultural economics.',
      icon: '🌱',
    },
    'BS Food Technology': {
      dept: 'College of Agriculture',
      oaprMin: 70,
      extra: null,
      note: 'Focus on food science, processing, and quality control.',
      icon: '🍱',
    },
    'BS Forestry': {
      dept: 'College of Agriculture',
      oaprMin: 60,
      extra: null,
      note: 'Focus on sustainable forestry and natural resource management.',
      icon: '🌲',
    },
    'BS Nutrition and Dietetics': {
      dept: 'College of Agriculture',
      oaprMin: 75,
      extra: null,
      note: 'Focus on clinical nutrition, food science, and public health dietetics.',
      icon: '🥗',
    },
    'BS Environmental Science': {
      dept: 'College of Agriculture',
      oaprMin: 65,
      extra: null,
      note: 'Focus on environmental management and ecological conservation.',
      icon: '🌍',
    },
    'BS Agro-Forestry': {
      dept: 'College of Agriculture',
      oaprMin: 60,
      extra: null,
      note: 'Integrated study of agriculture and forest management.',
      icon: '🌳',
    },
    'BS Home Economics': {
      dept: 'College of Agriculture',
      oaprMin: 60,
      extra: null,
      note: 'Focus on family and consumer sciences, nutrition, and household management.',
      icon: '🏠',
    },

    /* ── College of Criminology ─────────────────────────────── */
    'BS Criminology': {
      dept: 'College of Criminology',
      oaprMin: 85,
      extra: null,
      note: 'Prepares graduates for the Criminologist Licensure Examination; strict grade requirement with no line of 8 on SHS record.',
      icon: '🔍',
    },

    /* ── College of Islamic and Arabic Studies ──────────────── */
    'BS Islamic Studies': {
      dept: 'College of Islamic and Arabic Studies',
      oaprMin: 40,
      extra: null,
      note: 'Study of Islamic theology, jurisprudence, and Arabic language.',
      icon: '☪️',
    },
    'AB Arabic Language': {
      dept: 'College of Islamic and Arabic Studies',
      oaprMin: 40,
      extra: null,
      note: 'Focus on Arabic linguistics, translation, and literature.',
      icon: '🕌',
    },
    'Bachelor of Islamic Teacher Education': {
      dept: 'College of Islamic and Arabic Studies',
      oaprMin: 40,
      extra: null,
      note: 'Prepares Islamic educators for Madrasah schools.',
      icon: '📖',
    },
  };

  /**
   * Check if an applicant qualifies for a course.
   * Returns { qualified: bool, reasons: string[], req: object|null }
   */
  window.WMSU_checkQualification = function (course, oapr, natScore, eatScore) {
    const req = window.WMSU_COURSE_REQUIREMENTS[course];
    if (!req) return { qualified: false, reasons: ['Course not found in requirements list.'], req: null };

    const reasons = [];

    if (oapr < req.oaprMin) {
      reasons.push(`OAPR ${oapr} is below the minimum of ${req.oaprMin} PR for ${course}.`);
    }

    if (req.extra === 'nat') {
      const natMin = req.natMin || 260;
      if (!natScore || natScore < natMin) {
        reasons.push(`NAT score ${natScore || 'not provided'} is below the required ${natMin}.`);
      }
    }

    if (req.extra === 'eat') {
      const eatMin = req.eatMin || 250;
      if (!eatScore || eatScore < eatMin) {
        reasons.push(`EAT score ${eatScore || 'not provided'} is below the required ${eatMin}.`);
      }
    }

    return {
      qualified: reasons.length === 0,
      reasons,
      req,
    };
  };

  /**
   * Calculate composite score for courses with extra exams.
   * Returns { composite: number, formula: string } or null if no extra exam.
   *
   * BS Nursing:    40% CET (OAPR) + 60% NAT
   * Engineering:   60% CET (OAPR) + 40% EAT
   */
  window.WMSU_calcComposite = function (course, oapr, natScore, eatScore) {
    const req = window.WMSU_COURSE_REQUIREMENTS[course];
    if (!req) return null;

    if (req.extra === 'nat' && natScore) {
      // Normalize: OAPR is 1–99 percentile; NAT score is ~200–400 raw
      // Convert NAT to a 0–100 scale: (natScore - 200) / 200 * 100, capped at 100
      const natNorm = Math.min(100, Math.max(0, (natScore - 200) / 200 * 100));
      const composite = (oapr * 0.40) + (natNorm * 0.60);
      return {
        composite: Math.round(composite * 10) / 10,
        formula: '40% CET + 60% NAT',
        cetComponent: Math.round(oapr * 0.40 * 10) / 10,
        extraComponent: Math.round(natNorm * 0.60 * 10) / 10,
        natNormalized: Math.round(natNorm * 10) / 10,
      };
    }

    if (req.extra === 'eat' && eatScore) {
      // Normalize: EAT score ~200–400 → 0–100 scale
      const eatNorm = Math.min(100, Math.max(0, (eatScore - 200) / 200 * 100));
      const composite = (oapr * 0.60) + (eatNorm * 0.40);
      return {
        composite: Math.round(composite * 10) / 10,
        formula: '60% CET + 40% EAT',
        cetComponent: Math.round(oapr * 0.60 * 10) / 10,
        extraComponent: Math.round(eatNorm * 0.40 * 10) / 10,
        eatNormalized: Math.round(eatNorm * 10) / 10,
      };
    }

    return null;
  };

})();