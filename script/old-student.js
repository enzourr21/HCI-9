/**
 * ============================================================
 *  WMSU-EASE  |  old-student.js
 *  Registrar & Student Session Data  (Old Students — 2nd Year+)
 *
 *  Simulates data from the Registrar's Office:
 *    - Current academic calendar (school year + semester)
 *    - Logged-in student's profile, college, program, year level
 *    - Already-enrolled subjects (to prevent duplicates)
 *
 *  NOTE: Old students (2nd year and above) enroll starting
 *  2nd Semester. Freshmen are handled by a separate portal.
 * ============================================================
 */

// ─── CURRENT ACADEMIC CALENDAR (from Registrar) ─────────────
const REGISTRAR = {
  schoolYear:     "2026-2027",
  semester:       "1st",            // "1st" | "2nd" | "summer"
  semLabel:       "1st Semester",
  enrollmentOpen: true,
  maxUnits:       30,
  minUnits:       15,
};

// ─── LOGGED-IN STUDENT SESSION ───────────────────────────────
const CURRENT_STUDENT = {
  id:          "2024-00123",
  firstName:   "Juan",
  lastName:    "Dela Cruz",
  middleName:  "Santos",
  fullName:    "Juan Dela Cruz",
  initials:    "JD",
  yearLevel:   2,               // 2 | 3 | 4  (old students only)
  yearLabel:   "2nd Year",
  collegeId:   "CCS",
  collegeName: "College of Computing Studies",
  programId:   "BSCS",
  programName: "BS Computer Science",

  // Empty — student is now enrolling for 1st Sem S.Y. 2026-2027
  enrolledSubjectIds: [],

  // All subjects passed from 1st Year (using IDs from subject.js)
  completedSubjectIds: [
    // ── 1st Year, 1st Semester ──────────────────────────────
    "BSCS-Y1S1-001",   // CS 111  – Introduction to Computing
    "BSCS-Y1S1-002",   // CS 112  – Computer Programming 1 (Lec)
    "BSCS-Y1S1-003",   // CS 112L – Computer Programming 1 (Lab)
    "BSCS-Y1S1-004",   // MATH 111 – Discrete Structures 1
    "GE-US101",        // Understanding the Self
    "GE-CAS101",       // Purposive Communication
    "GE-PE101",        // PathFit 1
    "GE-NSTP1",        // NSTP 1

    // ── 1st Year, 2nd Semester ──────────────────────────────
    "BSCS-Y1S2-001",   // CS 113  – Computer Programming 2 (Lec)
    "BSCS-Y1S2-002",   // CS 113L – Computer Programming 2 (Lab)
    "BSCS-Y1S2-003",   // MATH 112 – Discrete Structures 2
    "BSCS-Y1S2-004",   // MATH 113 – Calculus for Computing
    "GE-HIST101",      // Readings in Philippine History
    "GE-MATH100",      // Mathematics in the Modern World
    "GE-PE102",        // PathFit 2
    "GE-NSTP2",        // NSTP 2
  ],
};

// ─── HELPERS ────────────────────────────────────────────────

/**
 * getCurrentSemester()
 * Returns the active academic period from the Registrar.
 */
function getCurrentSemester() {
  return { ...REGISTRAR };
}

/**
 * getStudentSession()
 * Returns the current student's profile and enrollment state.
 */
function getStudentSession() {
  return { ...CURRENT_STUDENT };
}

/**
 * isEnrolled(subjectId)
 * Returns true if the student is already enrolled in that subject.
 */
function isEnrolled(subjectId) {
  return CURRENT_STUDENT.enrolledSubjectIds.includes(subjectId);
}

/**
 * hasCompleted(subjectId)
 * Returns true if the student has already passed that subject.
 */
function hasCompleted(subjectId) {
  return CURRENT_STUDENT.completedSubjectIds.includes(subjectId);
}

/**
 * getEnrolledUnits(subjectList)
 * Sums the units of currently enrolled subjects.
 * @param {Array} subjectList - flat array of subject objects with .id and .units
 */
function getEnrolledUnits(subjectList) {
  return subjectList
    .filter(s => isEnrolled(s.id))
    .reduce((sum, s) => sum + (s.units || 0), 0);
}

/**
 * canAddSubject(subject, currentEnrolledUnits)
 * Returns { allowed: bool, reason: string }
 */
function canAddSubject(subject, currentEnrolledUnits) {
  if (isEnrolled(subject.id)) {
    return { allowed: false, reason: "Already enrolled in this subject." };
  }
  if (hasCompleted(subject.id)) {
    return { allowed: false, reason: "Already completed this subject." };
  }
  if (currentEnrolledUnits + subject.units > REGISTRAR.maxUnits) {
    return {
      allowed: false,
      reason: `Adding this subject would exceed the ${REGISTRAR.maxUnits}-unit limit.`,
    };
  }
  return { allowed: true, reason: "" };
}

/**
 * enrollSubject(subjectId)
 * Simulates adding a subject to the student's enrollment list.
 * Returns { success: bool, message: string }
 */
function enrollSubject(subjectId) {
  if (isEnrolled(subjectId)) {
    return { success: false, message: "Subject is already in your enrollment list." };
  }
  CURRENT_STUDENT.enrolledSubjectIds.push(subjectId);
  return { success: true, message: "Subject added successfully." };
}

/**
 * removeSubject(subjectId)
 * Removes a subject from the student's enrollment list.
 */
function removeSubject(subjectId) {
  const idx = CURRENT_STUDENT.enrolledSubjectIds.indexOf(subjectId);
  if (idx === -1) {
    return { success: false, message: "Subject not found in your enrollment list." };
  }
  CURRENT_STUDENT.enrolledSubjectIds.splice(idx, 1);
  return { success: true, message: "Subject removed." };
}

/**
 * getAvailableSubjectsForStudent()
 * Returns subjects from the student's prospectus for the current semester
 * that they haven't enrolled in or already completed.
 *
 * Depends on getProspectus() and getSubjectById() from subject.js.
 * Both scripts must be loaded before this is called (runtime call is safe).
 */
function getAvailableSubjectsForStudent() {
  const s   = getStudentSession();
  const reg = getCurrentSemester();

  const college = COLLEGES?.[s.collegeId];
  if (!college) return [];
  const program = college.programs?.[s.programId];
  if (!program) return [];

  const all = [];

  // Loop through all years up to the student's current year level
  for (let yr = 1; yr <= s.yearLevel; yr++) {
    const yearData = program.prospectus[yr];
    if (!yearData) continue;

    // For years below current year: include both sems
    // For current year: include up to and including current sem
    const semsToInclude = yr < s.yearLevel
      ? [SEM.FIRST, SEM.SECOND]
      : reg.semester === SEM.SECOND
        ? [SEM.FIRST, SEM.SECOND]
        : [SEM.FIRST];

    for (const sem of semsToInclude) {
      const subjects = yearData[sem] ?? [];
      for (const sub of subjects) {
        // Skip already completed or enrolled
        if (isEnrolled(sub.id) || hasCompleted(sub.id)) continue;
        // Skip duplicates (GE subjects appear in multiple programs)
        if (all.find(x => x.id === sub.id)) continue;
        all.push(sub);
      }
    }
  }

  return all;
}