/**
 * WMSU-Ease — studentData.js
 * Mock student dataset for MISTO system administration.
 * Generated with varied colleges, course programs, statuses, and student types.
 */

const COURSE_OPTIONS = [
    'BS Computer Science',
    'BS Information Technology',
    'BS Information Systems',
    'BS Civil Engineering',
    'BS Electrical Engineering',
    'BS Mechanical Engineering',
    'BS Sanitary Engineering',
    'BS Computer Engineering',
    'BS Electronics Communication Engineering',
    'BS Environmental Engineering',
    'BS Industrial Engineering',
    'BS Geodetic Engineering',
    'BS Agricultural Biosystem Engineering',
    'BS Nursing',
    'BS Business Administration',
    'BS Accountancy',
    'BS Economics',
    'BS Management Accounting',
    'BS Marketing Management',
    'BS Hospitality Management',
    'BS Tourism Management',
    'BA Psychology',
    'BA Political Science',
    'BS Journalism',
    'BA Broadcasting',
    'BA English Language Studies (BAELS)',
    'BS Asian Studies',
    'BA Communication',
    'BS Biology',
    'BS Chemistry',
    'BS Mathematics',
    'BS Statistics',
    'Bachelor of Elementary Education',
    'Bachelor of Secondary Education',
    'Bachelor of Physical Education',
    'BS Agriculture',
    'BS Agri Business',
    'BS Food Technology',
    'BS Forestry',
    'BS Nutrition and Dietetics',
    'BS Environmental Science',
    'BS Agro-Forestry',
    'BS Home Economics',
    'BS Criminology',
    'BS Islamic Studies',
    'AB Arabic Language',
    'Bachelor of Islamic Teacher Education',
];

const ADVISERS = [
    { id:'EMP-20241001', name:'Dr. Ana Dizon' },
    { id:'EMP-20241002', name:'Prof. Maria Reyes' },
    { id:'EMP-20241003', name:'Prof. Jose Rizal' },
    { id:'EMP-20241009', name:'Prof. Edgar Tan' },
    { id:'EMP-20241010', name:'Dr. Patricia Lim' },
    { id:'EMP-20241011', name:'Mr. Carlos Bautista' },
];

const FIRST_NAMES = [
    'Miguel', 'Sofia', 'Joshua', 'Ariana', 'Daniel', 'Isabella', 'Ethan', 'Mia', 'Noah', 'Luna',
    'Gabriel', 'Leah', 'Lucas', 'Nina', 'Samuel', 'Chloe', 'Aaron', 'Mae', 'Julian', 'Kiana',
    'Evelyn', 'Nathan', 'Hannah', 'Caleb', 'Alyssa', 'Isaac', 'Riley', 'Dylan', 'Alexa', 'Jericho',
    'Faith', 'Nathaniel', 'Bea', 'Owen', 'Claire', 'Ryan', 'Maya', 'Jerome', 'Alexa', 'Gia',
];

const LAST_NAMES = [
    'Garcia', 'Reyes', 'Dizon', 'Santos', 'Cruz', 'Lopez', 'Torres', 'Rivera', 'Martinez', 'Delos Santos',
    'Manalo', 'Villanueva', 'Silva', 'Perez', 'Alcantara', 'Santiago', 'Domingo', 'Ocampo', 'Salazar', 'Uy',
    'Mendoza', 'Palma', 'Ramos', 'Balangue', 'Calleja', 'Villamor', 'Lozada', 'Velasco', 'Ayala', 'Delgado',
];

const GUARDIANS = [
    'Maria Garcia', 'Jose Cruz', 'Ana Santos', 'Lucia Rivera', 'Ramon Lopez', 'Teresa Molina',
    'Nina Mendoza', 'Victor Dela Cruz', 'Gloria Flores', 'Rosa Ramos', 'Cedric Torres', 'Eileen Bautista',
];

const SUBJECT_TEMPLATES = [
    { code:'CS 111', title:'Introduction to Computing', units:3 },
    { code:'IT 111', title:'Introduction to Information Technology', units:3 },
    { code:'IS 111', title:'Introduction to Information Systems', units:3 },
    { code:'MATH 111', title:'Discrete Structures 1', units:3 },
    { code:'ENG 101', title:'Academic Writing', units:3 },
    { code:'COM 101', title:'Oral Communication', units:3 },
    { code:'HIST 101', title:'Readings in Philippine History', units:3 },
    { code:'BIO 101', title:'General Biology', units:3 },
    { code:'CHEM 101', title:'General Chemistry', units:3 },
    { code:'PHYS 101', title:'General Physics', units:3 },
    { code:'ECON 101', title:'Principles of Economics', units:3 },
    { code:'ACC 101', title:'Introductory Accounting', units:3 },
    { code:'MGMT 101', title:'Principles of Management', units:3 },
    { code:'PSYC 101', title:'General Psychology', units:3 },
    { code:'NURS 101', title:'Fundamentals of Nursing', units:3 },
    { code:'ENGG 101', title:'Engineering Drawing', units:3 },
    { code:'TOUR 101', title:'Introduction to Tourism', units:3 },
    { code:'CRIM 101', title:'Criminal Justice System', units:3 },
    { code:'PE 101', title:'Physical Education 1', units:2 },
    { code:'NSTP 1', title:'National Service Training Program 1', units:3 },
];

const STATUS_OPTIONS = ['Enrolled', 'Enrolled', 'Enrolled', 'Irregular', 'On Leave'];
const STUDENT_TYPES = ['Regular', 'Regular', 'Freshmen', 'Transferee', 'Regular'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];
const GENDERS = ['Male', 'Female'];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function makeEmail(firstName, lastName, index) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${String(index).padStart(3,'0')}@wmsu.edu.ph`;
}

function buildStudentId(index, studentType) {
    const year = new Date().getFullYear();
    const id = String(index).padStart(5, '0');
    return studentType === 'Transferee' ? `${year}-T${id}` : `${year}-${id}`;
}

function createRandomSubjects() {
    const count = randomInt(3, 6);
    const picked = new Set();
    const subjects = [];
    while (subjects.length < count) {
        const candidate = randomChoice(SUBJECT_TEMPLATES);
        if (picked.has(candidate.code)) continue;
        picked.add(candidate.code);
        subjects.push({ code: candidate.code, desc: candidate.title, units: candidate.units });
    }
    return subjects;
}

function createStudent(index) {
    const gender = randomChoice(GENDERS);
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const middleInitial = randomChoice('ABCDEFGHIJKL'.split(''));
    const studentType = randomChoice(STUDENT_TYPES);
    const status = randomChoice(STATUS_OPTIONS);
    let yearLevel = studentType === 'Freshmen' ? 1 : randomInt(1, 4);
    if (studentType === 'Transferee') {
        yearLevel = randomInt(2, 4);
    }
    const course = randomChoice(COURSE_OPTIONS);
    const adviser = randomChoice(ADVISERS);
    const transferUnits = studentType === 'Transferee' ? randomInt(18, 54) : 0;
    return {
        studentId: buildStudentId(index, studentType),
        firstName,
        lastName,
        middleName: `${middleInitial}.`,
        fullName: `${firstName} ${middleInitial}. ${lastName}`,
        gender,
        birthdate: `${randomInt(1999, 2006)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
        course,
        yearLevel,
        section: randomChoice(SECTIONS),
        status,
        studentType,
        adviserId: adviser.id,
        adviserName: adviser.name,
        enrollmentDate: `2026-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
        semester: randomChoice(['1st Semester', '2nd Semester']),
        ay: '2026–2027',
        units: randomInt(15, 24),
        email: (studentType === 'Freshmen' || studentType === 'Transferee') && randomInt(1, 100) <= 50 ? '' : makeEmail(firstName, lastName, index),
        contact: `09${randomInt(100000000, 999999999)}`,
        address: `${randomInt(100, 999)} ${randomChoice(['Maharlika', 'Rizal', 'Bonifacio', 'Mabini', 'Aguinaldo'])} St., Barangay ${randomChoice(['Poblacion','San Roque','Santa Cruz','Santo Niño','Bagong Lipunan'])}, Zamboanga City`,
        guardian: randomChoice(GUARDIANS),
        guardianContact: `09${randomInt(100000000, 999999999)}`,
        subjects: createRandomSubjects(),
        ...(studentType === 'Transferee' ? {
            transferFrom: randomChoice(['MINDANAO STATE UNIVERSITY', 'ZAMBOANGA CITY STATE COLLEGE', 'PAGADIAN STATE UNIVERSITY', 'UNIVERSITY OF ZAMBOANGA']),
            transferUnits,
        } : {}),
    };
}

function addStudent(data) {
    const idx = STUDENTS.length + 1;
    const studentType = data.studentType || 'Regular';
    const student = {
        studentId: data.studentId || buildStudentId(idx, studentType),
        firstName: data.firstName || 'Student',
        lastName: data.lastName || `S${String(idx).padStart(5, '0')}`,
        middleName: data.middleName || '',
        fullName: data.fullName || `${data.firstName || 'Student'} ${data.middleName || ''} ${data.lastName || ''}`.trim(),
        gender: data.gender || 'Male',
        birthdate: data.birthdate || '2006-01-01',
        course: data.course || COURSE_OPTIONS[0],
        yearLevel: data.yearLevel || 1,
        section: data.section || 'A',
        status: data.status || 'Enrolled',
        studentType,
        adviserId: data.adviserId || ADVISERS[0].id,
        adviserName: data.adviserName || ADVISERS[0].name,
        enrollmentDate: data.enrollmentDate || new Date().toISOString().split('T')[0],
        semester: data.semester || '1st Semester',
        ay: data.ay || '2026–2027',
        units: data.units || 0,
        email: data.email || makeEmail(data.firstName || 'student', data.lastName || `s${idx}`, idx),
        contact: data.contact || `09${randomInt(100000000, 999999999)}`,
        address: data.address || 'Barangay Poblacion, Zamboanga City',
        guardian: data.guardian || ADVISERS[0].name,
        guardianContact: data.guardianContact || `09${randomInt(100000000, 999999999)}`,
        subjects: data.subjects || [],
        ...(studentType === 'Transferee' ? {
            transferFrom: data.transferFrom || 'Other Institution',
            transferUnits: data.transferUnits || 0,
        } : {}),
    };
    STUDENTS.push(student);
    return student;
}

function getStudentsByAdviser(adviserId) {
    return STUDENTS.filter(s => s.adviserId === adviserId);
}

function getStudentStats() {
    const stats = { total: STUDENTS.length, enrolled: 0, freshmen: 0, transferees: 0 };
    for (const s of STUDENTS) {
        if (s.status === 'Enrolled') stats.enrolled += 1;
        if (s.studentType === 'Freshmen') stats.freshmen += 1;
        if (s.studentType === 'Transferee') stats.transferees += 1;
    }
    return stats;
}

const STUDENTS = Array.from({ length: 1000 }, (_, idx) => createStudent(idx + 1));
