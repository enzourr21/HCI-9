/**
 * ============================================================
 *  WMSU-EASE  |  old-student.js
 *  Registrar & Student Session Data
 *
 *  Simulates data that would come from the Registrar's Office:
 *    - Current academic calendar (school year + semester)
 *    - Logged-in student's profile, college, program, year level
 *    - Already-enrolled subjects (to prevent duplicates)
 *  ============================================================
 */

// ─── CURRENT ACADEMIC CALENDAR (from Registrar) ─────────────
const REGISTRAR = {
  schoolYear:    "2024-2025",
  semester:      "2nd",          // "1st" | "2nd" | "summer"
  semLabel:      "2nd Semester",
  enrollmentOpen: true,
  maxUnits:      30,
  minUnits:      15,
};

// ─── LOGGED-IN STUDENT SESSION ───────────────────────────────
const CURRENT_STUDENT = {
  id:          "2024-00123",
  firstName:   "Juan",
  lastName:    "Dela Cruz",
  middleName:  "Santos",
  fullName:    "Juan Dela Cruz",
  initials:    "JD",
  yearLevel:   1,               // 1 | 2 | 3 | 4
  yearLabel:   "1st Year",
  collegeId:   "CCS",
  collegeName: "College of Computing Studies",
  programId:   "BSCS",
  programName: "BS Computer Science",

  // IDs of subjects already confirmed/enrolled this semester
  enrolledSubjectIds: [
    "BSCS-Y1S2-001",   // CS 113 – Computer Programming 2
    "BSCS-Y1S2-002",   // CS 113L – Computer Programming 2 (Lab)
    "BSCS-Y1S2-003",   // MATH 112 – Discrete Structures 2
    "BSCS-Y1S2-004",   // MATH 113 – Calculus for Computing
    "GE-HIST101",      // Readings in Philippine History
    "GE-MATH100",      // Mathematics in the Modern World
    "GE-PE102",        // PathFit 2
    "GE-NSTP2",        // NSTP 2
  ],

  // IDs of subjects already passed (for prerequisite checking)
  completedSubjectIds: [
    "BSCS-Y1S1-001",   // CS 111
    "BSCS-Y1S1-002",   // CS 112
    "BSCS-Y1S1-003",   // CS 112L
    "BSCS-Y1S1-004",   // MATH 111
    "GE-US101",
    "GE-CAS101",
    "GE-PE101",
    "GE-NSTP1",
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
 * Given an array of subject objects, sums the units of enrolled subjects.
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
 * Checks: already enrolled, already completed, units cap.
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