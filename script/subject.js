/**
 * ============================================================
 *  WMSU-EASE  |  subject.js  (browser build)
 *  Western Mindanao State University — Subject Prospectus DB
 * ============================================================
 */

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
      BSIS: {
        id: "BSIS", name: "BS Information Systems",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSIS-Y1S1-001","IS 111","Introduction to Information Systems",3,"lecture",[]),
              sub("BSIS-Y1S1-002","IS 112","Computer Programming 1",2,"lecture",[]),
              sub("BSIS-Y1S1-003","IS 112L","Computer Programming 1 (Lab)",1,"laboratory",["BSIS-Y1S1-002"]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSIS-Y1S2-001","IS 121","Information Systems Analysis",3,"lecture",["BSIS-Y1S1-001"]),
              sub("BSIS-Y1S2-002","IS 122","Computer Programming 2",2,"lecture",["BSIS-Y1S1-002"]),
              sub("BSIS-Y1S2-003","IS 123","Business Process Management",3,"lecture",[]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSIS-Y2S1-001","IS 211","Database Management",3,"lecture",["BSIS-Y1S2-001"]),
              sub("BSIS-Y2S1-002","IS 212","Human-Computer Interaction",3,"lecture",[]),
              sub("BSIS-Y2S1-003","IS 213","Systems Analysis and Design",3,"lecture",[]),
              sub("BSIS-Y2S1-004","IS 214","Accounting Information Systems",3,"lecture",[]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSIS-Y2S2-001","IS 221","Enterprise Resource Planning",3,"lecture",["BSIS-Y2S1-001"]),
              sub("BSIS-Y2S2-002","IS 222","Web Systems and Technologies",3,"lecture",[]),
              sub("BSIS-Y2S2-003","IS 223","Quantitative Methods for IS",3,"lecture",[]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-CW101"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSIS-Y3S1-001","IS 311","Enterprise Systems",3,"lecture",["BSIS-Y2S1-001"]),
              sub("BSIS-Y3S1-002","IS 312","Business Intelligence",3,"lecture",[]),
              sub("BSIS-Y3S1-003","IS 313","Systems Integration and Architecture",3,"lecture",["BSIS-Y2S1-003"]),
              sub("BSIS-Y3S1-004","IS 314","Information Security",3,"lecture",[]),
              sub("BSIS-Y3S1-005","IS 315","Project Management",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSIS-Y3S2-001","IS 321","E-Commerce Systems",3,"lecture",[]),
              sub("BSIS-Y3S2-002","IS 322","IS Elective 1",3,"lecture",[]),
              sub("BSIS-Y3S2-003","IS 323","IS Capstone Project 1",3,"thesis",["BSIS-Y3S1-003"]),
              sub("BSIS-Y3S2-004","IS 324","Social & Professional Issues in IS",3,"lecture",[]),
            ],
          },
          4: {
            [SEM.FIRST]: [
              sub("BSIS-Y4S1-001","IS 411","IS Capstone Project 2",6,"thesis",["BSIS-Y3S2-003"]),
              sub("BSIS-Y4S1-002","IS 412","IS Elective 2",3,"lecture",[]),
              sub("BSIS-Y4S1-003","IS 413","IT Governance",3,"lecture",[]),
              sub("BSIS-Y4S1-004","IS 414","IS Elective 3 (Data Analytics)",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSIS-Y4S2-001","IS 421","Practicum / OJT",6,"ojt",[]),
            ],
          },
        },
      },
    },
  },
  CON: {
    id: "CON", name: "College of Nursing",
    programs: {
      BSN: {
        id: "BSN", name: "BS Nursing", cmoRef: "CMO No. 14, s. 2009",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSN-Y1S1-001","NURS 101","Fundamentals of Nursing",3,"lecture",[]),
              sub("BSN-Y1S1-002","NURS 101L","Fundamentals of Nursing (Lab)",2,"laboratory",["BSN-Y1S1-001"]),
              sub("BSN-Y1S1-003","ANAT 101","Anatomy and Physiology",3,"lecture",[]),
              sub("BSN-Y1S1-004","CHEM 101","Biochemistry",3,"lecture",[]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSN-Y1S2-001","NURS 102","Health Assessment",3,"lecture",[]),
              sub("BSN-Y1S2-002","NURS 102L","Health Assessment (Lab)",1,"laboratory",["BSN-Y1S2-001"]),
              sub("BSN-Y1S2-003","MICR 101","Microbiology",3,"lecture",[]),
              sub("BSN-Y1S2-004","PSYC 101","Psychology",3,"lecture",[]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSN-Y2S1-001","NURS 201","Medical-Surgical Nursing 1",4,"lecture",[]),
              sub("BSN-Y2S1-002","NURS 201L","Medical-Surgical Nursing 1 (Lab)",2,"laboratory",["BSN-Y2S1-001"]),
              sub("BSN-Y2S1-003","PHAR 201","Pharmacology",3,"lecture",[]),
              sub("BSN-Y2S1-004","PATH 201","Pathophysiology",3,"lecture",[]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSN-Y2S2-001","NURS 202","Medical-Surgical Nursing 2",4,"lecture",["BSN-Y2S1-001"]),
              sub("BSN-Y2S2-002","NURS 202L","Medical-Surgical Nursing 2 (Lab)",2,"laboratory",["BSN-Y2S1-002"]),
              sub("BSN-Y2S2-003","NURS 203","Maternal and Child Nursing",4,"lecture",[]),
              sub("BSN-Y2S2-004","NURS 203L","Maternal and Child Nursing (Lab)",2,"laboratory",["BSN-Y2S2-003"]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSN-Y3S1-001","NURS 301","Mental Health Nursing",3,"lecture",[]),
              sub("BSN-Y3S1-002","NURS 301L","Mental Health Nursing (Lab)",1,"laboratory",["BSN-Y3S1-001"]),
              sub("BSN-Y3S1-003","NURS 302","Community Health Nursing",3,"lecture",[]),
              sub("BSN-Y3S1-004","NURS 302L","Community Health Nursing (Lab)",1,"laboratory",["BSN-Y3S1-003"]),
              sub("BSN-Y3S1-005","NURS 303","Nursing Research",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSN-Y3S2-001","NURS 304","Nursing Leadership and Management",3,"lecture",[]),
              sub("BSN-Y3S2-002","NURS 305","Emergency and Disaster Nursing",3,"lecture",[]),
              sub("BSN-Y3S2-003","NURS 306","Critical Care Nursing",3,"lecture",[]),
              sub("BSN-Y3S2-004","NURS 307","Geriatric Nursing",3,"lecture",[]),
            ],
          },
          4: {
            [SEM.FIRST]: [
              sub("BSN-Y4S1-001","NURS 401","Practicum 1",6,"practicum",[]),
              sub("BSN-Y4S1-002","NURS 402","Capstone Project",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSN-Y4S2-001","NURS 403","Practicum 2",6,"practicum",[]),
            ],
          },
        },
      },
    },
  },
  COE: {
    id: "COE", name: "College of Engineering",
    programs: {
      BSCE: {
        id: "BSCE", name: "BS Civil Engineering", cmoRef: "CMO No. 35, s. 2017",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSCE-Y1S1-001","MATH 101","Calculus 1",3,"lecture",[]),
              sub("BSCE-Y1S1-002","PHYS 101","Physics 1",3,"lecture",[]),
              sub("BSCE-Y1S1-003","PHYS 101L","Physics 1 (Lab)",1,"laboratory",["BSCE-Y1S1-002"]),
              sub("BSCE-Y1S1-004","CHEM 101","Chemistry for Engineers",3,"lecture",[]),
              sub("BSCE-Y1S1-005","CHEM 101L","Chemistry for Engineers (Lab)",1,"laboratory",["BSCE-Y1S1-004"]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSCE-Y1S2-001","MATH 102","Calculus 2",3,"lecture",["BSCE-Y1S1-001"]),
              sub("BSCE-Y1S2-002","PHYS 102","Physics 2",3,"lecture",["BSCE-Y1S1-002"]),
              sub("BSCE-Y1S2-003","PHYS 102L","Physics 2 (Lab)",1,"laboratory",["BSCE-Y1S1-003"]),
              sub("BSCE-Y1S2-004","CE 101","Engineering Drawing",2,"lecture",[]),
              sub("BSCE-Y1S2-005","CE 101L","Engineering Drawing (Lab)",1,"laboratory",["BSCE-Y1S2-004"]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSCE-Y2S1-001","MATH 201","Differential Equations",3,"lecture",["BSCE-Y1S2-001"]),
              sub("BSCE-Y2S1-002","CE 201","Mechanics of Deformable Bodies",3,"lecture",[]),
              sub("BSCE-Y2S1-003","CE 202","Fluid Mechanics",3,"lecture",[]),
              sub("BSCE-Y2S1-004","CE 203","Engineering Geology",3,"lecture",[]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSCE-Y2S2-001","CE 204","Structural Analysis",3,"lecture",["BSCE-Y2S1-002"]),
              sub("BSCE-Y2S2-002","CE 205","Construction Materials",3,"lecture",[]),
              sub("BSCE-Y2S2-003","CE 206","Surveying",2,"lecture",[]),
              sub("BSCE-Y2S2-004","CE 206L","Surveying (Lab)",1,"laboratory",["BSCE-Y2S2-003"]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSCE-Y3S1-001","CE 301","Reinforced Concrete Design",3,"lecture",["BSCE-Y2S2-001"]),
              sub("BSCE-Y3S1-002","CE 302","Steel Design",3,"lecture",["BSCE-Y2S2-001"]),
              sub("BSCE-Y3S1-003","CE 303","Geotechnical Engineering",3,"lecture",["BSCE-Y2S1-003"]),
              sub("BSCE-Y3S1-004","CE 304","Transportation Engineering",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSCE-Y3S2-001","CE 305","Water Resources Engineering",3,"lecture",["BSCE-Y2S1-003"]),
              sub("BSCE-Y3S2-002","CE 306","Environmental Engineering",3,"lecture",[]),
              sub("BSCE-Y3S2-003","CE 307","Construction Management",3,"lecture",[]),
              sub("BSCE-Y3S2-004","CE 308","Engineering Economy",3,"lecture",[]),
            ],
          },
          4: {
            [SEM.FIRST]: [
              sub("BSCE-Y4S1-001","CE 401","Design Project 1",3,"lecture",[]),
              sub("BSCE-Y4S1-002","CE 402","Professional Practice",3,"lecture",[]),
              sub("BSCE-Y4S1-003","CE 403","Elective 1",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSCE-Y4S2-001","CE 404","Design Project 2",3,"lecture",["BSCE-Y4S1-001"]),
              sub("BSCE-Y4S2-002","CE 405","Practicum",6,"practicum",[]),
            ],
          },
        },
      },
    },
  },
  CBA: {
    id: "CBA", name: "College of Business Administration",
    programs: {
      BSBA: {
        id: "BSBA", name: "BS Business Administration", cmoRef: "CMO No. 20, s. 2013",
        prospectus: {
          1: {
            [SEM.FIRST]: [
              sub("BSBA-Y1S1-001","MATH 101","Business Mathematics",3,"lecture",[]),
              sub("BSBA-Y1S1-002","ECON 101","Principles of Economics",3,"lecture",[]),
              sub("BSBA-Y1S1-003","ACCT 101","Financial Accounting",3,"lecture",[]),
              sub("BSBA-Y1S1-004","BMGT 101","Introduction to Business",3,"lecture",[]),
              GE_SUBJECTS["GE-US101"], GE_SUBJECTS["GE-CAS101"],
              GE_SUBJECTS["GE-PE101"], GE_SUBJECTS["GE-NSTP1"],
            ],
            [SEM.SECOND]: [
              sub("BSBA-Y1S2-001","STAT 101","Business Statistics",3,"lecture",[]),
              sub("BSBA-Y1S2-002","ACCT 102","Managerial Accounting",3,"lecture",["BSBA-Y1S1-003"]),
              sub("BSBA-Y1S2-003","BMGT 102","Business Communication",3,"lecture",[]),
              sub("BSBA-Y1S2-004","MKTG 101","Principles of Marketing",3,"lecture",[]),
              GE_SUBJECTS["GE-HIST101"], GE_SUBJECTS["GE-MATH100"],
              GE_SUBJECTS["GE-PE102"], GE_SUBJECTS["GE-NSTP2"],
            ],
          },
          2: {
            [SEM.FIRST]: [
              sub("BSBA-Y2S1-001","FIN 201","Financial Management",3,"lecture",[]),
              sub("BSBA-Y2S1-002","BMGT 201","Operations Management",3,"lecture",[]),
              sub("BSBA-Y2S1-003","BMGT 202","Human Resource Management",3,"lecture",[]),
              sub("BSBA-Y2S1-004","LAW 201","Business Law",3,"lecture",[]),
              GE_SUBJECTS["GE-ETHICS101"], GE_SUBJECTS["GE-AH100"], GE_SUBJECTS["GE-PE103"],
            ],
            [SEM.SECOND]: [
              sub("BSBA-Y2S2-001","BMGT 203","Strategic Management",3,"lecture",[]),
              sub("BSBA-Y2S2-002","BMGT 204","Entrepreneurship",3,"lecture",[]),
              sub("BSBA-Y2S2-003","MKTG 202","Marketing Management",3,"lecture",["BSBA-Y1S2-004"]),
              sub("BSBA-Y2S2-004","FIN 202","Investment Analysis",3,"lecture",["BSBA-Y2S1-001"]),
              GE_SUBJECTS["GE-STS100"], GE_SUBJECTS["GE-PE104"],
            ],
          },
          3: {
            [SEM.FIRST]: [
              sub("BSBA-Y3S1-001","BMGT 301","Business Research",3,"lecture",[]),
              sub("BSBA-Y3S1-002","BMGT 302","International Business",3,"lecture",[]),
              sub("BSBA-Y3S1-003","BMGT 303","Business Analytics",3,"lecture",[]),
              sub("BSBA-Y3S1-004","BMGT 304","Elective 1",3,"lecture",[]),
            ],
            [SEM.SECOND]: [
              sub("BSBA-Y3S2-001","BMGT 305","Capstone Project",3,"lecture",[]),
              sub("BSBA-Y3S2-002","BMGT 306","Practicum",6,"practicum",[]),
            ],
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

/** Get all subjects for a given program, flat list */
function getAllSubjectsForProgram(programId) {
  for (const college of Object.values(COLLEGES)) {
    const prog = college.programs[programId];
    if (!prog) continue;
    const all = [];
    for (const yr of Object.values(prog.prospectus))
      for (const sem of Object.values(yr))
        all.push(...sem);
    return all;
  }
  return [];
}

/** Get prospectus summary (total units by year) */
function getProspectusSummary(collegeId, programId) {
  const result = getProspectus(collegeId, programId);
  if (result.error) return result;
  const summary = {};
  for (const [yr, sems] of Object.entries(result.prospectus)) {
    let total = 0;
    for (const subjects of Object.values(sems))
      total += subjects.reduce((a, s) => a + s.units, 0);
    summary[`Year ${yr}`] = total;
  }
  return summary;
}