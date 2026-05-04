// =============================================================
// enrollment-form.js
// Returning Student Enrollment Form — WMSU-Ease
// Handles: form validation, BSCS prerequisite engine,
//          grade table generation, file upload preview
// =============================================================

// ─────────────────────────────────────────────────────────────
// BSCS CURRICULUM — Semestral Program of Study
// Source: CHED CMO 25 s. 2015 (BSCS sample curriculum)
// Each subject: { code, description, units, sem, year, prereqs[] }
// prereqs[] contains subject codes that must be PASSED (grade 1.0–3.0)
// A grade of 5.0, UW, or INC on a prereq BLOCKS the dependent subject.
// ─────────────────────────────────────────────────────────────
const BSCS_CURRICULUM = [
    // ── YEAR 1, SEM 1 ─────────────────────────────────────
    { code: "CC 100",   desc: "Introduction to Computing",          units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "CC 101",   desc: "Computer Programming 1",             units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "CAS 101",  desc: "Purposive Communication",            units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "CWTS 1",   desc: "Civic Welfare Training Service 1",   units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "DS 111",   desc: "Discrete Structures 1",              units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "EPIC 1",   desc: "EPIC Start 1-A",                     units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "HIST 100", desc: "Life and Works of Rizal",            units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "MATH 100", desc: "Mathematics in the Modern World",    units: 3, year: 1, sem: 1, prereqs: [] },
    { code: "PATHFIT 1",desc: "Movement Competency Training",       units: 2, year: 1, sem: 1, prereqs: [] },
    { code: "US 101",   desc: "Understanding the Self",             units: 3, year: 1, sem: 1, prereqs: [] },

    // ── YEAR 1, SEM 2 ─────────────────────────────────────
    { code: "CC 102",   desc: "Computer Programming 2",             units: 3, year: 1, sem: 2, prereqs: ["CC 101"] },
    { code: "CC 102L",  desc: "Computer Programming 2 Lab",         units: 1, year: 1, sem: 2, prereqs: ["CC 101"] },
    { code: "CWTS 2",   desc: "Civic Welfare Training Service 2",   units: 3, year: 1, sem: 2, prereqs: ["CWTS 1"] },
    { code: "DS 112",   desc: "Discrete Structures 2",              units: 3, year: 1, sem: 2, prereqs: ["DS 111"] },
    { code: "EPIC 2",   desc: "EPIC Start 2-A",                     units: 3, year: 1, sem: 2, prereqs: [] },
    { code: "HIST 101", desc: "Readings in Philippine History",     units: 3, year: 1, sem: 2, prereqs: [] },
    { code: "PATHFIT 2",desc: "Exercise-Based Fitness Activities",  units: 2, year: 1, sem: 2, prereqs: ["PATHFIT 1"] },
    { code: "STS 100",  desc: "Science, Technology and Society",    units: 3, year: 1, sem: 2, prereqs: [] },

    // ── YEAR 2, SEM 1 ─────────────────────────────────────
    { code: "CC 103",   desc: "Data Structures and Algorithms",     units: 3, year: 2, sem: 1, prereqs: ["CC 102"] },
    { code: "CC 103L",  desc: "Data Structures and Algorithms Lab", units: 1, year: 2, sem: 1, prereqs: ["CC 102"] },
    { code: "DS 113",   desc: "Discrete Structures 3",              units: 3, year: 2, sem: 1, prereqs: ["DS 112"] },
    { code: "IAS 101",  desc: "Information Assurance and Security", units: 3, year: 2, sem: 1, prereqs: ["CC 102"] },
    { code: "OOP 112",  desc: "Object Oriented Programming",        units: 3, year: 2, sem: 1, prereqs: ["CC 102"] },
    { code: "OOP 112L", desc: "Object Oriented Programming Lab",    units: 1, year: 2, sem: 1, prereqs: ["CC 102"] },
    { code: "PATHFIT 3",desc: "Sports and Recreation",              units: 2, year: 2, sem: 1, prereqs: ["PATHFIT 2"] },
    { code: "SOCSCI 1", desc: "Ethics",                             units: 3, year: 2, sem: 1, prereqs: [] },

    // ── YEAR 2, SEM 2 ─────────────────────────────────────
    { code: "CC 104",   desc: "Design and Analysis of Algorithms",  units: 3, year: 2, sem: 2, prereqs: ["CC 103"] },
    { code: "CC 104L",  desc: "Design and Analysis of Algorithms Lab", units: 1, year: 2, sem: 2, prereqs: ["CC 103"] },
    { code: "HCI 116",  desc: "Human Computer Interaction",         units: 3, year: 2, sem: 2, prereqs: ["OOP 112"] },
    { code: "MATH 101", desc: "Linear Algebra",                     units: 3, year: 2, sem: 2, prereqs: ["DS 111"] },
    { code: "NET 101",  desc: "Computer Networks",                  units: 3, year: 2, sem: 2, prereqs: ["IAS 101"] },
    { code: "NET 101L", desc: "Computer Networks Lab",              units: 1, year: 2, sem: 2, prereqs: ["IAS 101"] },
    { code: "PATHFIT 4",desc: "Physical Activity Towards Health",   units: 2, year: 2, sem: 2, prereqs: ["PATHFIT 3"] },
    { code: "WD 114",   desc: "Web Development 1",                  units: 3, year: 2, sem: 2, prereqs: ["OOP 112"] },
    { code: "WD 114L",  desc: "Web Development 1 Lab",              units: 1, year: 2, sem: 2, prereqs: ["OOP 112"] },

    // ── YEAR 3, SEM 1 ─────────────────────────────────────
    { code: "CC 105",   desc: "Operating Systems",                  units: 3, year: 3, sem: 1, prereqs: ["CC 103"] },
    { code: "CC 105L",  desc: "Operating Systems Lab",              units: 1, year: 3, sem: 1, prereqs: ["CC 103"] },
    { code: "CS 106",   desc: "Cyber Security",                     units: 3, year: 3, sem: 1, prereqs: ["NET 101"] },
    { code: "CS 401",   desc: "Software Engineering",               units: 3, year: 3, sem: 1, prereqs: ["CC 104"] },
    { code: "DB 201",   desc: "Database Management Systems",        units: 3, year: 3, sem: 1, prereqs: ["CC 103"] },
    { code: "DB 201L",  desc: "Database Management Systems Lab",    units: 1, year: 3, sem: 1, prereqs: ["CC 103"] },
    { code: "SOCSCI 2", desc: "Art Appreciation",                   units: 3, year: 3, sem: 1, prereqs: [] },

    // ── YEAR 3, SEM 2 ─────────────────────────────────────
    { code: "AI 301",   desc: "Artificial Intelligence",            units: 3, year: 3, sem: 2, prereqs: ["CC 104"] },
    { code: "CC 106",   desc: "Automata Theory",                    units: 3, year: 3, sem: 2, prereqs: ["DS 113"] },
    { code: "CS 402",   desc: "Software Design and Architecture",   units: 3, year: 3, sem: 2, prereqs: ["CS 401"] },
    { code: "DB 202",   desc: "Advanced Database Systems",          units: 3, year: 3, sem: 2, prereqs: ["DB 201"] },
    { code: "ELECTIVE 1", desc: "CS Elective 1",                    units: 3, year: 3, sem: 2, prereqs: [] },
    { code: "METHODS",  desc: "Methods of Research",                units: 3, year: 3, sem: 2, prereqs: [] },

    // ── YEAR 4, SEM 1 ─────────────────────────────────────
    { code: "CS 403",   desc: "Capstone Project 1",                 units: 3, year: 4, sem: 1, prereqs: ["CS 402", "METHODS"] },
    { code: "CS 404",   desc: "Software Testing and Quality",       units: 3, year: 4, sem: 1, prereqs: ["CS 402"] },
    { code: "ELECTIVE 2", desc: "CS Elective 2",                    units: 3, year: 4, sem: 1, prereqs: [] },
    { code: "ELECTIVE 3", desc: "CS Elective 3",                    units: 3, year: 4, sem: 1, prereqs: [] },
    { code: "IAS 201",  desc: "Information Assurance and Security 2", units: 3, year: 4, sem: 1, prereqs: ["CS 106"] },

    // ── YEAR 4, SEM 2 ─────────────────────────────────────
    { code: "CS 405",   desc: "Capstone Project 2",                 units: 3, year: 4, sem: 2, prereqs: ["CS 403"] },
    { code: "CS 406",   desc: "Seminar and Field Trips",            units: 1, year: 4, sem: 2, prereqs: [] },
    { code: "OJT 400",  desc: "On-the-Job Training",                units: 3, year: 4, sem: 2, prereqs: ["CS 403"] },
];

// Map for quick lookup
const CURRICULUM_MAP = {};
BSCS_CURRICULUM.forEach(s => { CURRICULUM_MAP[s.code] = s; });

// Grade values that count as PASSED (prerequisite satisfied)
const PASSING_GRADES = new Set(["1.0", "1.25", "1.5", "1.75", "2.0", "2.25", "2.5", "2.75", "3.0"]);
const SPECIAL_GRADES = new Set(["INC", "UW", "NG", "W"]);

// ─────────────────────────────────────────────────────────────
// PREREQUISITE ENGINE
// Takes the student's grade record and returns a Set of subject
// codes that are BLOCKED (cannot be enrolled this semester).
// ─────────────────────────────────────────────────────────────
function computeBlockedSubjects(gradeRecord) {
    // gradeRecord: { "CC 101": "2.0", "CC 102": "5.0", "EPIC 1": "UW", ... }
    const blocked = new Set();

    BSCS_CURRICULUM.forEach(subject => {
        subject.prereqs.forEach(prereqCode => {
            const grade = gradeRecord[prereqCode];
            if (!grade) return; // not yet taken — not blocked by this prereq

            const isFailed = grade === "5.0" || SPECIAL_GRADES.has(grade.toUpperCase());
            if (isFailed) {
                blocked.add(subject.code);
            }
        });
    });

    return blocked;
}

// ─────────────────────────────────────────────────────────────
// BUILD GRADES TABLE
// Shows subjects from the student's MOST RECENTLY COMPLETED
// semester only. This applies to ALL year levels including Year 1
// (a Year 1 student re-enrolling for 2nd sem has 1st sem grades).
//
// lastSem: { year: number, sem: number }
// ─────────────────────────────────────────────────────────────
function buildGradesTable(lastSem) {
    const tbody = document.getElementById("gradesTableBody");
    tbody.innerHTML = "";

    const subjects = BSCS_CURRICULUM.filter(
        s => s.year === lastSem.year && s.sem === lastSem.sem
    );

    if (!subjects.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;color:#aaa;">
            No subjects found for this semester in the curriculum.
        </td></tr>`;
        return;
    }

    // Single group header for the last completed semester
    const groupRow = document.createElement("tr");
    groupRow.className = "sem-group-row";
    groupRow.innerHTML = `<td colspan="5">Year ${lastSem.year} — ${lastSem.sem === 1 ? "1st" : "2nd"} Semester</td>`;
    tbody.appendChild(groupRow);

    subjects.forEach(sub => {
        const tr = document.createElement("tr");
        tr.dataset.code = sub.code;
        tr.innerHTML = `
            <td><strong>${sub.code}</strong></td>
            <td>${sub.desc}</td>
            <td style="text-align:center;">${sub.units}</td>
            <td style="text-align:center;">
                <input type="text" class="grade-input" id="grade-${sub.code.replace(/\s+/g,'-')}"
                    data-code="${sub.code}"
                    placeholder="e.g. 1.5 or blank"
                    maxlength="4"
                    oninput="onGradeInput(this)">
            </td>
            <td style="text-align:center;">
                <span class="grade-badge pending" id="badge-${sub.code.replace(/\s+/g,'-')}">—</span>
            </td>`;
        tbody.appendChild(tr);
    });
}

// ─────────────────────────────────────────────────────────────
// DERIVE LAST COMPLETED SEMESTER from session data.
// Re-enrollment is always for the NEXT semester after the last one.
// e.g. Year 1 Sem 1 completed → re-enrolling for Year 1 Sem 2
//      Year 1 Sem 2 completed → re-enrolling for Year 2 Sem 1
//      Year 3 Sem 1 completed → re-enrolling for Year 3 Sem 2
// ─────────────────────────────────────────────────────────────
function getLastCompletedSem(yearLevel, currentSem) {
    // currentSem = the semester they are RE-ENROLLING INTO (1 or 2)
    if (currentSem === 2) {
        // Re-enrolling for 2nd sem → last completed was same year, 1st sem
        return { year: yearLevel, sem: 1 };
    } else {
        // Re-enrolling for 1st sem → last completed was previous year, 2nd sem
        return { year: yearLevel - 1, sem: 2 };
    }
}

// ─────────────────────────────────────────────────────────────
// GRADE INPUT HANDLER
// Updates the badge next to each grade input in real time.
// ─────────────────────────────────────────────────────────────
function onGradeInput(input) {
    const code    = input.dataset.code;
    const val     = input.value.trim().toUpperCase();
    const badgeId = "badge-" + code.replace(/\s+/g, "-");
    const badge   = document.getElementById(badgeId);
    if (!badge) return;

    if (!val) {
        badge.className = "grade-badge pending";
        badge.textContent = "—";
        return;
    }

    if (val === "INC") {
        badge.className = "grade-badge inc";
        badge.textContent = "INC";
    } else if (val === "UW") {
        badge.className = "grade-badge uw";
        badge.textContent = "UW";
    } else if (val === "5.0" || val === "5") {
        badge.className = "grade-badge fail";
        badge.textContent = "Failed";
    } else if (PASSING_GRADES.has(val)) {
        badge.className = "grade-badge pass";
        badge.textContent = "Passed";
    } else {
        badge.className = "grade-badge pending";
        badge.textContent = "?";
    }
}

// ─────────────────────────────────────────────────────────────
// COLLECT GRADE RECORD FROM TABLE
// Returns { "CC 101": "2.0", ... } from all filled inputs.
// ─────────────────────────────────────────────────────────────
function collectGradeRecord() {
    const record = {};
    document.querySelectorAll(".grade-input").forEach(input => {
        const val = input.value.trim().toUpperCase();
        if (val) record[input.dataset.code] = val;
    });
    return record;
}

// ─────────────────────────────────────────────────────────────
// FILE UPLOAD PREVIEW
// ─────────────────────────────────────────────────────────────
function initFileUpload() {
    const input   = document.getElementById("gradeScreenshot");
    const preview = document.getElementById("uploadPreview");
    const zone    = document.getElementById("uploadZone");

    input.addEventListener("change", () => {
        if (input.files.length > 0) {
            const file = input.files[0];
            document.getElementById("uploadFileName").textContent = file.name;
            preview.classList.add("visible");
        }
    });

    // Drag-over highlight
    zone.addEventListener("dragover",  e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop",      e => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        if (e.dataTransfer.files.length) {
            input.files = e.dataTransfer.files;
            input.dispatchEvent(new Event("change"));
        }
    });
}

// ─────────────────────────────────────────────────────────────
// YEAR LEVEL CHANGE HANDLER
// Rebuilds the grade table whenever the student selects a year.
// ─────────────────────────────────────────────────────────────
// PRE-FILL FROM SESSION
// Reads student identity from sessionStorage and locks Block 1.
// Then builds the grades table for the correct last semester.
// ─────────────────────────────────────────────────────────────
function prefillFromSession() {
    // Read the student ID saved by login.js
    const savedId = sessionStorage.getItem('loggedInStudentId');

    // If no session exists, send them back to login
    if (!savedId) {
        window.location.href = '../../login-pages/login.html';
        return;
    }

    // Look up the student in STUDENT_DB (from studentData.js)
    const found = findStudentById(savedId);
    if (!found) {
        window.location.href = '../../login-pages/login.html';
        return;
    }

    // Build the session object from the real student record
    const session = {
        studentId:  found.studentId,
        fullName:   `${found.lastName.toUpperCase()}, ${found.firstName.toUpperCase()} ${found.middleInitial}.`,
        program:    found.programFull,
        yearLevel:  found.yearLevel,
        currentSem: found.currentSem,
        section:    found.section,
    };

    // Fill and lock Block 1
    const lock = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    lock("studentId", session.studentId);
    lock("program",   session.program);
    lock("yearLevel", `Year ${session.yearLevel}`);
    lock("section",   session.section);

    // Build grades table for last completed semester
    const lastSem = getLastCompletedSem(session.yearLevel, session.currentSem);
    buildGradesTable(lastSem);

    // Store session on window for use during submit
    window._studentSession = session;
}

// ─────────────────────────────────────────────────────────────
// FORM VALIDATION
// ─────────────────────────────────────────────────────────────
function validateField(id, condition, errorMsg) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "-error");
    if (!condition) {
        input?.classList.add("error");
        if (error) { error.textContent = errorMsg; error.classList.add("visible"); }
        return false;
    }
    input?.classList.remove("error");
    if (error) error.classList.remove("visible");
    return true;
}

function validateForm() {
    let valid = true;

    // Only validate fields the student actually fills in (Block 2 — personal/family/guardian).
    // Block 1 fields (studentId, program, yearLevel, section) are pre-filled and locked.
    const required = [
        { id: "lastName",         msg: "Last name is required." },
        { id: "firstName",        msg: "First name is required." },
        { id: "birthdate",        msg: "Birthdate is required." },
        { id: "contactNumber",    msg: "Contact number is required." },
        { id: "address",          msg: "Address is required." },
        { id: "motherName",       msg: "Mother's name is required." },
        { id: "fatherName",       msg: "Father's name is required." },
        { id: "guardianName",     msg: "Guardian name is required." },
        { id: "guardianRelation", msg: "Relationship is required." },
        { id: "guardianContact",  msg: "Guardian contact is required." },
    ];

    required.forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!validateField(id, el.value.trim() !== "", msg)) valid = false;
    });

    // Screenshot is optional — no validation required.
    // (Per business rule: grades may not be released during re-enrollment period.)

    return valid;
}

// ─────────────────────────────────────────────────────────────
// FORM SUBMIT
// Collects all data, computes blocked subjects, stores in
// sessionStorage, then navigates to the subjects page.
// ─────────────────────────────────────────────────────────────
function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        const firstError = document.querySelector(".error, .field-error.visible");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Submitting…`;

    // Collect grade record from table inputs (blank entries are allowed)
    const gradeRecord = collectGradeRecord();

    // Compute blocked subjects from prerequisite engine (stored for adviser reference;
    // blocking is NOT enforced on the student side until the blueprint is shared).
    const blockedSubjects = [...computeBlockedSubjects(gradeRecord)];

    const session = window._studentSession || {};

    const enrollmentData = {
        // Block 1 — from session (locked, not from inputs)
        studentId:       session.studentId,
        program:         "BSCS",
        yearLevel:       session.yearLevel,
        currentSem:      session.currentSem,
        section:         session.section,

        // Block 2 — from student inputs
        lastName:        document.getElementById("lastName").value.trim(),
        firstName:       document.getElementById("firstName").value.trim(),
        middleInitial:   document.getElementById("middleInitial").value.trim(),
        birthdate:       document.getElementById("birthdate").value,
        contactNumber:   document.getElementById("contactNumber").value.trim(),
        address:         document.getElementById("address").value.trim(),
        motherName:      document.getElementById("motherName").value.trim(),
        motherOccupation:document.getElementById("motherOccupation").value.trim(),
        fatherName:      document.getElementById("fatherName").value.trim(),
        fatherOccupation:document.getElementById("fatherOccupation").value.trim(),
        guardianName:    document.getElementById("guardianName").value.trim(),
        guardianRelation:document.getElementById("guardianRelation").value,
        guardianContact: document.getElementById("guardianContact").value.trim(),

        // Block 3 — grades (may be partial or empty if not yet released)
        gradeRecord,
        blockedSubjects,  // for adviser reference only — not enforced here
        screenshotUploaded: document.getElementById("gradeScreenshot").files.length > 0,

        formSubmittedAt: new Date().toISOString(),
    };

    // Store in sessionStorage — subjects page reads this
    sessionStorage.setItem("enrollmentData", JSON.stringify(enrollmentData));

    // Simulate brief processing then redirect
    setTimeout(() => {
        // Replace with your actual subjects page path
        window.location.href = "old_student/subject.html";
    }, 800);
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Pre-fill Block 1 from session and build grades table for last completed semester.
    // Replace with real API fetch when backend is ready.
    prefillFromSession();

    // File upload preview
    initFileUpload();

    // Form submission
    document.getElementById("enrollmentForm")
        .addEventListener("submit", handleSubmit);

    // Live validation on blur for editable fields only
    document.querySelectorAll(".form-input:not([readonly]), .form-select").forEach(el => {
        el.addEventListener("blur", () => {
            if (el.classList.contains("error")) {
                validateField(el.id, el.value.trim() !== "", "This field is required.");
            }
        });
    });
});