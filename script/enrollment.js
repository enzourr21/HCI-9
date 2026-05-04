/**
 * WMSU Course Requirements Config
 * OAPR cutoffs based on WMSU admission standards (PH state university norms)
 * NAT = Nursing Aptitude Test (required for BS Nursing)
 * EAT = Engineering Aptitude Test (required for Engineering programs)
 */

window.WMSU_COURSE_REQUIREMENTS = {

  /* ── College of Computing Studies ─────────────────────────────── */
  "BS Computer Science": {
    dept: "College of Computing Studies",
    oaprMin: 75,
    icon: "💻",
    extra: null,
    note: "Strong Quantitative Skills (QS) preferred (≥75 PR)"
  },
  "BS Information Technology": {
    dept: "College of Computing Studies",
    oaprMin: 70,
    icon: "💻",
    extra: null,
    note: "OAPR ≥70 PR required"
  },
  "Associate in Computer Technology major in Networking Application Development": {
    dept: "College of Computing Studies",
    oaprMin: 45,
    icon: "💻",
    extra: null,
    note: "OAPR ≥45 PR required"
  },

  /* ── College of Engineering ────────────────────────────────────── */
  "BS Civil Engineering": {
    dept: "College of Engineering",
    oaprMin: 90,
    icon: "⚙️",
    extra: "eat",
    eatMin: 250,
    note: "EAT ≥250 and QS ≥90 PR required"
  },
  "BS Mechanical Engineering": {
    dept: "College of Engineering",
    oaprMin: 85,
    icon: "⚙️",
    extra: "eat",
    eatMin: 250,
    note: "EAT ≥250 and QS ≥85 PR required"
  },
  "BS Electrical Engineering": {
    dept: "College of Engineering",
    oaprMin: 85,
    icon: "⚙️",
    extra: "eat",
    eatMin: 250,
    note: "EAT ≥250 and QS ≥85 PR required"
  },
  "BS Computer Engineering": {
    dept: "College of Engineering",
    oaprMin: 65,
    icon: "⚙️",
    extra: "eat",
    eatMin: 250,
    note: "EAT ≥250 and QS ≥65 PR required"
  },
  "BS Electronics Communication Engineering": {
    dept: "College of Engineering",
    oaprMin: 65,
    icon: "⚙️",
    extra: "eat",
    eatMin: 250,
    note: "EAT ≥250 required"
  },
  "BS Industrial Engineering": {
    dept: "College of Engineering",
    oaprMin: 80,
    icon: "⚙️",
    extra: "eat",
    eatMin: 240,
    note: "EAT ≥240 required"
  },
  "BS Geodetic Engineering": {
    dept: "College of Engineering",
    oaprMin: 80,
    icon: "⚙️",
    extra: "eat",
    eatMin: 240,
    note: "EAT ≥240 required"
  },
  "BS Environmental Engineering": {
    dept: "College of Engineering",
    oaprMin: 60,
    icon: "⚙️",
    extra: "eat",
    eatMin: 240,
    note: "EAT ≥240 required"
  },
  "BS Sanitary Engineering": {
    dept: "College of Engineering",
    oaprMin: 85,
    icon: "⚙️",
    extra: "eat",
    eatMin: 230,
    note: "EAT ≥230 required"
  },
  "BS Agricultural Biosystem Engineering": {
    dept: "College of Engineering",
    oaprMin: 55,
    icon: "⚙️",
    extra: "eat",
    eatMin: 230,
    note: "EAT ≥230 required"
  },

  /* ── College of Nursing ────────────────────────────────────────── */
  "BS Nursing": {
    dept: "College of Nursing",
    oaprMin: 90,
    icon: "🩺",
    extra: "nat",
    natMin: 260,
    note: "NAT ≥260 required; OAPR ≥90 PR. Interview required."
  },

  /* ── College of Business Administration ───────────────────────── */
  "BS Business Administration": {
    dept: "College of Business Administration",
    oaprMin: 75,
    icon: "📊",
    extra: null,
    note: "OAPR ≥75 PR required"
  },
  "BS Accountancy": {
    dept: "College of Business Administration",
    oaprMin: 90,
    icon: "🧮",
    extra: null,
    note: "OAPR ≥90 PR required; QS ≥60 PR preferred"
  },
  "BS Economics": {
    dept: "College of Business Administration",
    oaprMin: 60,
    icon: "💰",
    extra: null,
    note: "OAPR ≥60 PR required"
  },

  /* ── College of Arts and Sciences ─────────────────────────────── */
  "BA Psychology": {
    dept: "College of Arts and Sciences",
    oaprMin: 70,
    icon: "🧠",
    extra: null,
    note: "OAPR ≥55 PR required"
  },
  "BA Political Science": {
    dept: "College of Arts and Sciences",
    oaprMin: 70,
    icon: "🏛️",
    extra: null,
    note: "OAPR ≥70 PR required"
  },
  "BS Journalism": {
    dept: "College of Arts and Sciences",
    oaprMin: 55,
    icon: "📰",
    extra: null,
    note: "EP ≥55 PR preferred"
  },
  "BA Broadcasting": {
    dept: "College of Arts and Sciences",
    oaprMin: 50,
    icon: "📺",
    extra: null,
    note: "OAPR ≥50 PR required"
  },
  "BA English Language Studies (BAELS)": {
    dept: "College of Arts and Sciences",
    oaprMin: 65,
    icon: "📖",
    extra: null,
    note: "EP ≥65 PR preferred"
  },

  /* ── College of Education ──────────────────────────────────────── */
  "Bachelor of Secondary Education": {
    dept: "College of Education",
    oaprMin: 75,
    icon: "📚",
    extra: null,
    note: "OAPR ≥75 PR required"
  },
  "Bachelor of Elementary Education": {
    dept: "College of Education",
    oaprMin: 70,
    icon: "📚",
    extra: null,
    note: "OAPR ≥70 PR required"
  },

  /* ── College of Agriculture ────────────────────────────────────── */
  "BS Agriculture": {
    dept: "College of Agriculture",
    oaprMin: 60,
    icon: "🌾",
    extra: null,
    note: "OAPR ≥60 PR required"
  },
  "BS Agri Business": {
    dept: "College of Agriculture",
    oaprMin: 50,
    icon: "🌾",
    extra: null,
    note: "OAPR ≥50 PR required"
  },
  "BS Food Technology": {
    dept: "College of Agriculture",
    oaprMin: 70,
    icon: "🍎",
    extra: null,
    note: "SPS ≥70 PR preferred"
  },
  "BS Forestry": {
    dept: "College of Agriculture",
    oaprMin: 60,
    icon: "🌲",
    extra: null,
    note: "OAPR ≥60 PR required"
  },
  "BS Nutrition and Dietetics": {
    dept: "College of Agriculture",
    oaprMin: 75,
    icon: "🥗",
    extra: null,
    note: "SPS ≥75 PR preferred"
  },
  "BS Environmental Science": {
    dept: "College of Agriculture",
    oaprMin: 55,
    icon: "🌍",
    extra: null,
    note: "OAPR ≥55 PR required"
  },
  "BS Agro-Forestry": {
    dept: "College of Agriculture",
    oaprMin: 50,
    icon: "🌲",
    extra: null,
    note: "OAPR ≥50 PR required"
  },
  "BS Home Economics": {
    dept: "College of Agriculture",
    oaprMin: 45,
    icon: "🏠",
    extra: null,
    note: "OAPR ≥45 PR required"
  },
  "BS Hospitality Management": {
    dept: "College of Agriculture",
    oaprMin: 70,
    icon: "🏨",
    extra: null,
    note: "OAPR ≥70 PR required"
  },

  /* ── College of Criminology ────────────────────────────────────── */
  "BS Criminology": {
    dept: "College of Criminology",
    oaprMin: 85,
    icon: "⚖️",
    extra: null,
    note: "OAPR ≥85 PR required. Physical fitness exam required. No line of 8 on SHS report card."
  },

  /* ── Other Programs ────────────────────────────────────────────── */
  "BS Islamic Studies": {
    dept: "College of Islamic and Arabic Studies",
    oaprMin: 45,
    icon: "🕌",
    extra: null,
    note: "OAPR ≥45 PR required"
  },
  "BS Asian Studies": {
    dept: "College of Arts and Sciences",
    oaprMin: 45,
    icon: "🌏",
    extra: null,
    note: "OAPR ≥45 PR required"
  },
};

/**
 * Check if an applicant qualifies for a given course.
 * Returns { qualified: bool, reasons: string[] }
 */
window.WMSU_checkQualification = function(course, oapr, natScore, eatScore) {
  const req = window.WMSU_COURSE_REQUIREMENTS[course];
  if (!req) return { qualified: true, reasons: [] };

  const reasons = [];
  let qualified = true;

  if (oapr < req.oaprMin) {
    qualified = false;
    reasons.push(`OAPR ${oapr} is below the required ${req.oaprMin} PR for ${course}.`);
  }

  if (req.extra === 'nat') {
    if (!natScore || natScore < req.natMin) {
      qualified = false;
      reasons.push(`NAT score ${natScore || '(not provided)'} is below the required ${req.natMin} for BS Nursing.`);
    }
  }

  if (req.extra === 'eat') {
    if (!eatScore || eatScore < req.eatMin) {
      qualified = false;
      reasons.push(`EAT score ${eatScore || '(not provided)'} is below the required ${req.eatMin} for ${course}.`);
    }
  }

  return { qualified, reasons, req };
};