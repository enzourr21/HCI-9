/**
 * ============================================================
 *  WMSU-EASE  |  subject.js  (browser build)
 *  Western Mindanao State University — Subject Prospectus DB
 *
 *  Depends on:  old-student.js  (must load first)
 * ============================================================
 */

// ─── ROLE CONSTANTS ─────────────────────────────────────────
const ROLES = {
  SECRETARY: "secretary",
  DEPT_DEAN: "dept_dean",
  ADVISER:   "adviser",
  STUDENT:   "student",
};

const STATUS = {
  ACTIVE:     "active",
  INACTIVE:   "inactive",
  DEPRECATED: "deprecated",
};

const SEM        = { FIRST: "1st", SECOND: "2nd", SUMMER: "summer" };
const YEAR_LABELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// ============================================================
//  GENERAL EDUCATION SUBJECTS
// ============================================================
const GE_SUBJECTS = {
  "GE-US101":    { id:"GE-US101",    code:"US 101",      title:"Understanding the Self",                    units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.FIRST  },
  "GE-MATH100":  { id:"GE-MATH100",  code:"MATH 100",    title:"Mathematics in the Modern World",           units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.FIRST  },
  "GE-CAS101":   { id:"GE-CAS101",   code:"CAS 101",     title:"Purposive Communication",                   units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.FIRST  },
  "GE-HIST101":  { id:"GE-HIST101",  code:"HIST 101",    title:"Readings in Philippine History",            units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.SECOND },
  "GE-ETHICS101":{ id:"GE-ETHICS101",code:"ETHICS 101",  title:"Ethics",                                   units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.FIRST  },
  "GE-STS100":   { id:"GE-STS100",   code:"STS 100",     title:"Science, Technology, and Society",          units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.SECOND },
  "GE-AH100":    { id:"GE-AH100",    code:"A&H 100",     title:"Art Appreciation",                         units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.FIRST  },
  "GE-CW101":    { id:"GE-CW101",    code:"CW 101",      title:"The Contemporary World",                    units:3, type:"lecture",            category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.SECOND },
  "GE-PE101":    { id:"GE-PE101",    code:"PE 101",      title:"PathFit 1 – Movement Competency Training",  units:2, type:"laboratory",         category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.FIRST  },
  "GE-PE102":    { id:"GE-PE102",    code:"PE 102",      title:"PathFit 2 – Exercise-Based Fitness",        units:2, type:"laboratory",         category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.SECOND },
  "GE-PE103":    { id:"GE-PE103",    code:"PE 103",      title:"PathFit 3 – Sport (Team & Dual)",           units:2, type:"laboratory",         category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.FIRST  },
  "GE-PE104":    { id:"GE-PE104",    code:"PE 104",      title:"PathFit 4 – Dance, Martial Arts & Others",  units:2, type:"laboratory",         category:"GE", status:STATUS.ACTIVE, usualYear:2, usualSem:SEM.SECOND },
  "GE-NSTP1":    { id:"GE-NSTP1",   code:"NSTP 1",      title:"National Service Training Program 1",       units:3, type:"lecture-laboratory", category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.FIRST  },
  "GE-NSTP2":    { id:"GE-NSTP2",   code:"NSTP 2",      title:"National Service Training Program 2",       units:3, type:"lecture-laboratory", category:"GE", status:STATUS.ACTIVE, usualYear:1, usualSem:SEM.SECOND },
};

// ─── Helper builder ──────────────────────────────────────────
function sub(id, code, title, units, type, prereqs = [], description = "") {
  return { id, code, title, units, type, prerequisites: prereqs, description, status: STATUS.ACTIVE };
}

// ============================================================
//  COLLEGES
// ============================================================
const COLLEGES = {
  CCS: {
    id: "CCS", name: "College of Computing Studies",
    programs: {
      BSCS: {
        id: "BSCS", name: "BS Computer Science", cmoRef: "CMO No. 25, s. 2015",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSCS-Y1S1-001","CS 111","Introduction to Computing",3,"lecture",[]),
              sub("BSCS-Y1S1-002","CS 112","Computer Programming 1",2,"lecture",[]),
              sub("BSCS-Y1S1-003","CS 112L","Computer Programming 1 (Lab)",1,"laboratory",["BSCS-Y1S1-002"]),
              sub("BSCS-Y1S1-004","MATH 111","Discrete Structures 1",3,"lecture",[]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSCS-Y1S2-001","CS 113","Computer Programming 2",2,"lecture",["BSCS-Y1S1-002"]),
              sub("BSCS-Y1S2-002","CS 113L","Computer Programming 2 (Lab)",1,"laboratory",["BSCS-Y1S1-003"]),
              sub("BSCS-Y1S2-003","MATH 112","Discrete Structures 2",3,"lecture",["BSCS-Y1S1-004"]),
              sub("BSCS-Y1S2-004","MATH 113","Calculus for Computing",3,"lecture",[]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSCS-Y2S1-001","CS 211","Data Structures and Algorithms",3,"lecture",["BSCS-Y1S2-001"]),
              sub("BSCS-Y2S1-002","CS 211L","Data Structures and Algorithms (Lab)",1,"laboratory",["BSCS-Y1S2-002"]),
              sub("BSCS-Y2S1-003","CS 212","Object-Oriented Programming",2,"lecture",["BSCS-Y1S2-001"]),
              sub("BSCS-Y2S1-004","CS 212L","OOP (Lab)",1,"laboratory",["BSCS-Y1S2-002"]),
              sub("BSCS-Y2S1-005","MATH 211","Linear Algebra",3,"lecture",["BSCS-Y1S2-004"]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSCS-Y2S2-001","CS 221","Information Management",3,"lecture",["BSCS-Y2S1-001"]),
              sub("BSCS-Y2S2-002","CS 221L","Information Management (Lab)",1,"laboratory",["BSCS-Y2S1-002"]),
              sub("BSCS-Y2S2-003","CS 222","Computer Architecture and Organization",3,"lecture",[]),
              sub("BSCS-Y2S2-004","MATH 212","Probability and Statistics",3,"lecture",["BSCS-Y1S2-004"]),
              sub("BSCS-Y2S2-005","CS 223","Human-Computer Interaction",3,"lecture",[]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSCS-Y3S1-001","CS 311","Software Engineering 1",3,"lecture",["BSCS-Y2S2-001"]),
              sub("BSCS-Y3S1-002","CS 312","Operating Systems",3,"lecture",["BSCS-Y2S2-003"]),
              sub("BSCS-Y3S1-003","CS 313","Networks and Communications",3,"lecture",[]),
              sub("BSCS-Y3S1-004","CS 314","Automata Theory and Formal Languages",3,"lecture",["BSCS-Y1S2-003"]),
              sub("BSCS-Y3S1-005","CS 315","Algorithms and Complexity",3,"lecture",["BSCS-Y2S1-001"]),
              GE_SUBJECTS["GE-CW101"],
            ],
            [SEM.SECOND]: [
              sub("BSCS-Y3S2-001","CS 321","Software Engineering 2",3,"lecture",["BSCS-Y3S1-001"]),
              sub("BSCS-Y3S2-002","CS 322","Programming Languages",3,"lecture",["BSCS-Y3S1-004"]),
              sub("BSCS-Y3S2-003","CS 323","Advanced Database Systems",3,"lecture",["BSCS-Y2S2-001"]),
              sub("BSCS-Y3S2-004","CS-EL1","CS Elective 1 (Data Science / AI)",3,"lecture",[]),
              sub("BSCS-Y3S2-005","CS 324","Computer Graphics",3,"lecture",[]),
            ],
          },
          4: {
            [SEM.FIRST]: [
              sub("BSCS-Y4S1-001","CS 411","CS Capstone Project 1",3,"thesis",["BSCS-Y3S2-001"]),
              sub("BSCS-Y4S1-002","CS 412","Social Issues and Professional Practice",3,"lecture",[]),
              sub("BSCS-Y4S1-003","CS-EL2","CS Elective 2",3,"lecture",[]),
              sub("BSCS-Y4S1-004","CS-EL3","CS Elective 3",3,"lecture",[]),
              sub("BSCS-Y4S1-005","CS 413","Research Methods in CS",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSCS-Y4S2-001","CS 421","CS Capstone Project 2",3,"thesis",["BSCS-Y4S1-001"]),
              sub("BSCS-Y4S2-002","CS 422","Practicum / Internship (OJT)",6,"ojt",[]),
            ],
          },
        },
      },
      BSIT: {
        id: "BSIT", name: "BS Information Technology",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSIT-Y1S1-001","IT 111","Introduction to Information Technology",3,"lecture",[]),
              sub("BSIT-Y1S1-002","IT 112","Computer Programming 1",2,"lecture",[]),
              sub("BSIT-Y1S1-003","IT 112L","Computer Programming 1 (Lab)",1,"laboratory",["BSIT-Y1S1-002"]),
              sub("BSIT-Y1S1-004","IT 113","Information Management 1",3,"lecture",[]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSIT-Y1S2-001","IT 121","Computer Programming 2",2,"lecture",["BSIT-Y1S1-002"]),
              sub("BSIT-Y1S2-002","IT 121L","Computer Programming 2 (Lab)",1,"laboratory",["BSIT-Y1S1-003"]),
              sub("BSIT-Y1S2-003","IT 122","Platform Technologies",3,"lecture",[]),
              sub("BSIT-Y1S2-004","IT 123","Organization and Management",3,"lecture",[]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSIT-Y2S1-001","IT 211","Data Structures and Algorithms",3,"lecture",["BSIT-Y1S2-001"]),
              sub("BSIT-Y2S1-002","IT 212","Web Systems and Technologies 1",2,"lecture",[]),
              sub("BSIT-Y2S1-003","IT 212L","Web Systems (Lab)",1,"laboratory",[]),
              sub("BSIT-Y2S1-004","IT 213","Information Assurance and Security 1",3,"lecture",[]),
              sub("BSIT-Y2S1-005","IT 214","Human-Computer Interaction",3,"lecture",[]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSIT-Y2S2-001","IT 221","Integrated Programming and Technologies",3,"lecture",["BSIT-Y2S1-001"]),
              sub("BSIT-Y2S2-002","IT 222","Network Management",3,"lecture",[]),
              sub("BSIT-Y2S2-003","IT 223","Systems Analysis and Design",3,"lecture",[]),
              sub("BSIT-Y2S2-004","IT 224","Applications Development",2,"lecture",[]),
              sub("BSIT-Y2S2-005","IT 224L","Applications Development (Lab)",1,"laboratory",[]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSIT-Y3S1-001","IT 311","Social and Professional Issues in IT",3,"lecture",[]),
              sub("BSIT-Y3S1-002","IT 312","Systems Integration and Architecture",3,"lecture",["BSIT-Y2S2-003"]),
              sub("BSIT-Y3S1-003","IT 313","IT Elective 1",3,"lecture",[]),
              sub("BSIT-Y3S1-004","IT 314","Multimedia Systems",3,"lecture",[]),
              sub("BSIT-Y3S1-005","IT 315","Quantitative Methods",3,"lecture",[]),
              GE_SUBJECTS["GE-CW101"],
            ],
            [SEM.SECOND]: [
              sub("BSIT-Y3S2-001","IT 321","Technopreneurship",3,"lecture",[]),
              sub("BSIT-Y3S2-002","IT 322","IT Elective 2",3,"lecture",[]),
              sub("BSIT-Y3S2-003","IT 323","IT Project Management",3,"lecture",[]),
              sub("BSIT-Y3S2-004","IT 324","IT Capstone Project 1",3,"thesis",["BSIT-Y3S1-002"]),
            ],
          },
          4: {
            [SEM.FIRST]: [
              sub("BSIT-Y4S1-001","IT 411","IT Capstone Project 2",3,"thesis",["BSIT-Y3S2-004"]),
              sub("BSIT-Y4S1-002","IT 412","IT Elective 3",3,"lecture",[]),
              sub("BSIT-Y4S1-003","IT 413","IT Elective 4",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSIT-Y4S2-001","IT 421","Practicum / OJT",6,"ojt",[]),
            ],
          },
        },
      },
    },
  },
  CET: {
    id: "CET", name: "College of Engineering and Technology",
    programs: {
      BSCE: {
        id:"BSCE", name:"BS Civil Engineering", boardExam:true,
        prospectus: {
          1: {
            [SEM.FIRST]:  [ sub("BSCE-Y1S1-001","MATH 111","Calculus 1",5,"lecture"), sub("BSCE-Y1S1-002","CHE 111","Chemistry for Engineers",3,"lecture"), sub("BSCE-Y1S1-003","CHE 111L","Chemistry for Engineers (Lab)",1,"laboratory",["BSCE-Y1S1-002"]), sub("BSCE-Y1S1-004","CE 111","Engineering Drawing 1",2,"laboratory"), sub("BSCE-Y1S1-005","CE 112","Engineering Orientation",1,"lecture"), GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"], GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"] ],
            [SEM.SECOND]: [ sub("BSCE-Y1S2-001","MATH 112","Calculus 2",5,"lecture",["BSCE-Y1S1-001"]), sub("BSCE-Y1S2-002","PHY 111","Physics for Engineers",3,"lecture"), sub("BSCE-Y1S2-003","PHY 111L","Physics for Engineers (Lab)",1,"laboratory",["BSCE-Y1S2-002"]), sub("BSCE-Y1S2-004","CS 111","Computer Programming for Engineers",2,"lecture"), sub("BSCE-Y1S2-005","CE 121","Engineering Drawing 2",2,"laboratory",["BSCE-Y1S1-004"]), GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"], GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"] ],
          },
          2: {
            [SEM.FIRST]:  [ sub("BSCE-Y2S1-001","MATH 211","Differential Equations",3,"lecture",["BSCE-Y1S2-001"]), sub("BSCE-Y2S1-002","CE 211","Statics of Rigid Bodies",3,"lecture",["BSCE-Y1S2-002"]), sub("BSCE-Y2S1-003","CE 212","Surveying 1",2,"lecture"), sub("BSCE-Y2S1-004","CE 212L","Surveying 1 (Lab)",1,"laboratory",["BSCE-Y2S1-003"]), sub("BSCE-Y2S1-005","CE 213","Engineering Materials",3,"lecture"), GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"] ],
            [SEM.SECOND]: [ sub("BSCE-Y2S2-001","CE 221","Dynamics of Rigid Bodies",3,"lecture",["BSCE-Y2S1-002"]), sub("BSCE-Y2S2-002","CE 222","Mechanics of Deformable Bodies",3,"lecture",["BSCE-Y2S1-002"]), sub("BSCE-Y2S2-003","CE 223","Surveying 2",2,"lecture",["BSCE-Y2S1-003"]), sub("BSCE-Y2S2-004","CE 223L","Surveying 2 (Lab)",1,"laboratory",["BSCE-Y2S1-004"]), sub("BSCE-Y2S2-005","CE 224","Engineering Economy",3,"lecture"), GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-CW101"], GE_SUBJECTS["GE-PE104"] ],
          },
          3: {
            [SEM.FIRST]:  [ sub("BSCE-Y3S1-001","CE 311","Structural Theory 1",3,"lecture",["BSCE-Y2S2-002"]), sub("BSCE-Y3S1-002","CE 312","Geotechnical Engineering 1",3,"lecture"), sub("BSCE-Y3S1-003","CE 313","Hydrology",3,"lecture"), sub("BSCE-Y3S1-004","CE 314","Transportation Engineering",3,"lecture"), sub("BSCE-Y3S1-005","CE 315","Construction Planning & Scheduling",3,"lecture") ],
            [SEM.SECOND]: [ sub("BSCE-Y3S2-001","CE 321","Reinforced Concrete Design",3,"lecture",["BSCE-Y3S1-001"]), sub("BSCE-Y3S2-002","CE 322","Hydraulics and Hydraulic Engineering",3,"lecture",["BSCE-Y3S1-003"]), sub("BSCE-Y3S2-003","CE 323","Geotechnical Engineering 2",3,"lecture",["BSCE-Y3S1-002"]), sub("BSCE-Y3S2-004","CE 324","Environmental Engineering",3,"lecture"), sub("BSCE-Y3S2-005","CE 325","Structural Theory 2",3,"lecture",["BSCE-Y3S1-001"]) ],
          },
          4: {
            [SEM.FIRST]:  [ sub("BSCE-Y4S1-001","CE 411","CE Project 1 (Thesis)",3,"thesis",["BSCE-Y3S2-001"]), sub("BSCE-Y4S1-002","CE 412","Steel Design",3,"lecture",["BSCE-Y3S2-001"]), sub("BSCE-Y4S1-003","CE 413","Foundation Engineering",3,"lecture",["BSCE-Y3S2-003"]), sub("BSCE-Y4S1-004","CE 414","Construction Management",3,"lecture"), sub("BSCE-Y4S1-005","CE 415","Professional Practice and Ethics",3,"lecture") ],
            [SEM.SECOND]: [ sub("BSCE-Y4S2-001","CE 421","CE Project 2",3,"thesis",["BSCE-Y4S1-001"]), sub("BSCE-Y4S2-002","CE 422","Quantity Surveying and Cost Estimating",3,"lecture",["BSCE-Y4S1-002"]), sub("BSCE-Y4S2-003","CE 423","Engineering Laws, Contracts, and Ethics",3,"lecture"), sub("BSCE-Y4S2-004","CE 424","Comprehensive Review / Board Exam Prep",3,"lecture") ],
          },
        },
      },
    },
  },
};

// ============================================================
//  HELPERS
// ============================================================
function getProspectus(collegeId, programId, year = null, sem = null) {
  const college = COLLEGES[collegeId];
  if (!college) return { error: `College '${collegeId}' not found.` };
  const program = college.programs[programId];
  if (!program) return { error: `Program '${programId}' not found.` };
  const p = program.prospectus;
  if (year && sem) return { college: college.name, program: program.name, year, sem, subjects: p[year]?.[sem] ?? [] };
  if (year) return { college: college.name, program: program.name, year, semesters: { [SEM.FIRST]: p[year]?.[SEM.FIRST] ?? [], [SEM.SECOND]: p[year]?.[SEM.SECOND] ?? [] } };
  return { college: college.name, program: program.name, boardExam: program.boardExam ?? false, prospectus: p };
}

function getSubjectById(id) {
  if (GE_SUBJECTS[id]) return GE_SUBJECTS[id];
  for (const col of Object.values(COLLEGES))
    for (const prog of Object.values(col.programs))
      for (const yr of Object.values(prog.prospectus))
        for (const sem of Object.values(yr)) {
          const found = sem.find(s => s.id === id);
          if (found) return found;
        }
  return null;
}

function getAvailableSubjectsForStudent() {
  const session   = getStudentSession();           // from old-student.js
  const registrar = getCurrentSemester();          // from old-student.js

  const college = COLLEGES[session.collegeId];
  if (!college) return [];
  const program = college.programs[session.programId];
  if (!program) return [];

  const semSubjects = program.prospectus[session.yearLevel]?.[registrar.semester] ?? [];

  // Filter: not already enrolled, not completed
  return semSubjects.filter(s => !isEnrolled(s.id) && !hasCompleted(s.id));
}