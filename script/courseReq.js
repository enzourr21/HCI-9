/**
 * WMSU-Ease — Course Requirements
 * Defines OAPR minimums, extra requirements, department mapping, and icons.
 * Used by both Admission Office and Department Head dashboards.
 */

(function () {

  window.WMSU_COURSE_REQUIREMENTS = {

    /* ── College of Computing Studies ─────────────────────── */
    'BS Computer Science': {
      dept: 'College of Computing Studies',
      oaprMin: 60,
      extra: null,
      note: 'Strong analytical and logical skills required.',
      icon: '💻',
    },
    'BS Information Technology': {
      dept: 'College of Computing Studies',
      oaprMin: 55,
      extra: null,
      note: 'Emphasis on systems and network administration.',
      icon: '🖥️',
    },
    'BS Information Systems': {
      dept: 'College of Computing Studies',
      oaprMin: 55,
      extra: null,
      note: 'Focus on business and technology integration.',
      icon: '📊',
    },

    /* ── College of Engineering ────────────────────────────── */
    'BS Civil Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      note: 'EAT score ≥250 required. Strong math and physics background needed.',
      icon: '🏗️',
    },
    'BS Electrical Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      note: 'EAT score ≥250 required. Emphasis on circuits and power systems.',
      icon: '⚡',
    },
    'BS Mechanical Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      note: 'EAT score ≥250 required. Focus on thermodynamics and machine design.',
      icon: '⚙️',
    },
    'BS Computer Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      note: 'EAT score ≥250 required. Combines hardware and software engineering.',
      icon: '🔌',
    },
    'BS Electronics Engineering': {
      dept: 'College of Engineering',
      oaprMin: 60,
      extra: 'eat',
      note: 'EAT score ≥250 required. Focus on electronic systems and communications.',
      icon: '📡',
    },
    'BS Chemical Engineering': {
      dept: 'College of Engineering',
      oaprMin: 65,
      extra: 'eat',
      note: 'EAT score ≥250 required. Strong chemistry and process design background.',
      icon: '🧪',
    },
    'BS Industrial Engineering': {
      dept: 'College of Engineering',
      oaprMin: 60,
      extra: 'eat',
      note: 'EAT score ≥250 required. Focus on systems optimization.',
      icon: '🏭',
    },

    /* ── College of Nursing ────────────────────────────────── */
    'BS Nursing': {
      dept: 'College of Nursing',
      oaprMin: 70,
      extra: 'nat',
      note: 'NAT score ≥260 required. High academic and clinical standards.',
      icon: '🩺',
    },

    /* ── College of Business Administration ────────────────── */
    'BS Business Administration': {
      dept: 'College of Business Administration',
      oaprMin: 50,
      extra: null,
      note: 'Open to all qualified applicants. Focus on management and entrepreneurship.',
      icon: '💼',
    },
    'BS Accountancy': {
      dept: 'College of Business Administration',
      oaprMin: 60,
      extra: null,
      note: 'Strong quantitative skills required for CPA board exam preparation.',
      icon: '🧾',
    },
    'BS Management Accounting': {
      dept: 'College of Business Administration',
      oaprMin: 55,
      extra: null,
      note: 'Focus on managerial decision-making and financial reporting.',
      icon: '📈',
    },
    'BS Marketing Management': {
      dept: 'College of Business Administration',
      oaprMin: 50,
      extra: null,
      note: 'Focus on consumer behavior, branding, and digital marketing.',
      icon: '📣',
    },
    'BS Hospitality Management': {
      dept: 'College of Business Administration',
      oaprMin: 48,
      extra: null,
      note: 'Focus on hotel, restaurant, and tourism industry management.',
      icon: '🏨',
    },
    'BS Tourism Management': {
      dept: 'College of Business Administration',
      oaprMin: 48,
      extra: null,
      note: 'Focus on travel, tourism planning, and cultural heritage.',
      icon: '✈️',
    },

    /* ── College of Arts and Sciences ──────────────────────── */
    'BA Psychology': {
      dept: 'College of Arts and Sciences',
      oaprMin: 55,
      extra: null,
      note: 'Focus on human behavior, mental processes, and research methods.',
      icon: '🧠',
    },
    'BA Communication': {
      dept: 'College of Arts and Sciences',
      oaprMin: 50,
      extra: null,
      note: 'Emphasis on media, journalism, and public relations.',
      icon: '🎙️',
    },
    'BS Journalism': {
      dept: 'College of Arts and Sciences',
      oaprMin: 50,
      extra: null,
      note: 'Training in print, broadcast, and digital media.',
      icon: '📰',
    },
    'BS Biology': {
      dept: 'College of Arts and Sciences',
      oaprMin: 60,
      extra: null,
      note: 'Strong science background required for pre-medicine or research track.',
      icon: '🔬',
    },
    'BS Chemistry': {
      dept: 'College of Arts and Sciences',
      oaprMin: 60,
      extra: null,
      note: 'Strong analytical chemistry and laboratory skills required.',
      icon: '⚗️',
    },
    'BS Mathematics': {
      dept: 'College of Arts and Sciences',
      oaprMin: 60,
      extra: null,
      note: 'High quantitative skills required. Prepares for research and teaching.',
      icon: '📐',
    },
    'BS Statistics': {
      dept: 'College of Arts and Sciences',
      oaprMin: 58,
      extra: null,
      note: 'Strong math background. Focus on data analysis and research.',
      icon: '📉',
    },
    'BS Social Work': {
      dept: 'College of Arts and Sciences',
      oaprMin: 48,
      extra: null,
      note: 'Focus on community development and welfare services.',
      icon: '🤝',
    },
    'AB Political Science': {
      dept: 'College of Arts and Sciences',
      oaprMin: 50,
      extra: null,
      note: 'Focus on governance, public policy, and political theory.',
      icon: '🏛️',
    },

    /* ── College of Education ───────────────────────────────── */
    'Bachelor of Elementary Education': {
      dept: 'College of Education',
      oaprMin: 50,
      extra: null,
      note: 'Prepares graduates for Licensure Examination for Teachers (LET).',
      icon: '📚',
    },
    'Bachelor of Secondary Education': {
      dept: 'College of Education',
      oaprMin: 50,
      extra: null,
      note: 'Prepares graduates for LET with major in chosen discipline.',
      icon: '🎓',
    },
    'Bachelor of Physical Education': {
      dept: 'College of Education',
      oaprMin: 45,
      extra: null,
      note: 'Focus on physical fitness, sports science, and health education.',
      icon: '🏃',
    },

    /* ── College of Agriculture ─────────────────────────────── */
    'BS Agriculture': {
      dept: 'College of Agriculture',
      oaprMin: 45,
      extra: null,
      note: 'Focus on crop science, animal husbandry, and sustainable farming.',
      icon: '🌾',
    },
    'BS Agricultural Engineering': {
      dept: 'College of Agriculture',
      oaprMin: 55,
      extra: 'eat',
      note: 'EAT score ≥240 required. Combines farming knowledge with engineering.',
      icon: '🚜',
    },
    'BS Agribusiness Management': {
      dept: 'College of Agriculture',
      oaprMin: 48,
      extra: null,
      note: 'Focus on farm enterprise management and agricultural economics.',
      icon: '🌱',
    },
    'BS Food Technology': {
      dept: 'College of Agriculture',
      oaprMin: 55,
      extra: null,
      note: 'Focus on food science, processing, and quality control.',
      icon: '🍱',
    },
    'BS Nutrition and Dietetics': {
      dept: 'College of Agriculture',
      oaprMin: 55,
      extra: null,
      note: 'Focus on clinical nutrition, food science, and public health dietetics.',
      icon: '🥗',
    },

    /* ── College of Criminology ─────────────────────────────── */
    'BS Criminology': {
      dept: 'College of Criminology',
      oaprMin: 50,
      extra: null,
      note: 'Prepares graduates for the Criminologist Licensure Examination.',
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
      const natMin = 260;
      if (!natScore || natScore < natMin) {
        reasons.push(`NAT score ${natScore || 'not provided'} is below the required ${natMin}.`);
      }
    }

    if (req.extra === 'eat') {
      const eatMin = 250;
      if (course === 'BS Agricultural Engineering') {
        // Lower threshold for agri engineering
        const agriEatMin = 240;
        if (!eatScore || eatScore < agriEatMin) {
          reasons.push(`EAT score ${eatScore || 'not provided'} is below the required ${agriEatMin}.`);
        }
      } else {
        if (!eatScore || eatScore < eatMin) {
          reasons.push(`EAT score ${eatScore || 'not provided'} is below the required ${eatMin}.`);
        }
      }
    }

    return {
      qualified: reasons.length === 0,
      reasons,
      req,
    };
  };

})();