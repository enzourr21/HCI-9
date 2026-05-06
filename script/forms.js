/**
 * WMSU-Ease — forms.js  (v2 — Transferee/Shiftee support)
 *
 * Connects the enrollment form to the student's saved application data.
 * Dynamically injects extra steps for Transferee / Shiftee applicants.
 *
 * Data source: localStorage → 'freshmanApp'
 * Falls back to window.WMSU_lookupApplicant() if the CET DB is also loaded.
 *
 * Step map (Freshman):
 *   1 Course  2 Personal  3 Family  4 Academic  5 Documents  6 Review
 *
 * Step map (Transferee / Shiftee — injected after Academic):
 *   1 Course  2 Personal  3 Family  4 Academic
 *   4b Previous School Records  4c Transferee Documents
 *   5 Documents  6 Review
 */

(function () {
    'use strict';

    /* ─── COURSE → COLLEGE MAP ─────────────────────────────────── */
    const COURSE_COLLEGE_MAP = {
        'BS Computer Science':                   { college: 'College of Computing Studies',          extra: null },
        'BS Information Technology':             { college: 'College of Computing Studies',          extra: null },
        'BS Information Systems':                { college: 'College of Computing Studies',          extra: null },
        'BS Civil Engineering':                  { college: 'College of Engineering', extra: 'eat' },
        'BS Electrical Engineering':             { college: 'College of Engineering', extra: 'eat' },
        'BS Mechanical Engineering':             { college: 'College of Engineering', extra: 'eat' },
        'BS Computer Engineering':               { college: 'College of Engineering', extra: 'eat' },
        'BS Electronics Engineering':            { college: 'College of Engineering', extra: 'eat' },
        'BS Chemical Engineering':               { college: 'College of Engineering', extra: 'eat' },
        'BS Industrial Engineering':             { college: 'College of Engineering', extra: 'eat' },
        'BS Nursing':                            { college: 'College of Nursing',     extra: 'nat' },
        'BS Business Administration':            { college: 'College of Business Administration', extra: null },
        'BS Accountancy':                        { college: 'College of Business Administration', extra: null },
        'BS Management Accounting':              { college: 'College of Business Administration', extra: null },
        'BS Marketing Management':               { college: 'College of Business Administration', extra: null },
        'BS Hospitality Management':             { college: 'College of Business Administration', extra: null },
        'BS Tourism Management':                 { college: 'College of Business Administration', extra: null },
        'BA Psychology':                         { college: 'College of Arts and Sciences', extra: null },
        'BA Communication':                      { college: 'College of Arts and Sciences', extra: null },
        'BS Journalism':                         { college: 'College of Arts and Sciences', extra: null },
        'BS Biology':                            { college: 'College of Arts and Sciences', extra: null },
        'BS Chemistry':                          { college: 'College of Arts and Sciences', extra: null },
        'BS Mathematics':                        { college: 'College of Arts and Sciences', extra: null },
        'BS Statistics':                         { college: 'College of Arts and Sciences', extra: null },
        'BS Social Work':                        { college: 'College of Arts and Sciences', extra: null },
        'AB Political Science':                  { college: 'College of Arts and Sciences', extra: null },
        'Bachelor of Elementary Education':      { college: 'College of Education', extra: null },
        'Bachelor of Secondary Education':       { college: 'College of Education', extra: null },
        'Bachelor of Physical Education':        { college: 'College of Education', extra: null },
        'BS Agriculture':                        { college: 'College of Agriculture', extra: null },
        'BS Agricultural Engineering':           { college: 'College of Agriculture', extra: null },
        'BS Agribusiness Management':            { college: 'College of Agriculture', extra: null },
        'BS Food Technology':                    { college: 'College of Agriculture', extra: null },
        'BS Nutrition and Dietetics':            { college: 'College of Agriculture', extra: null },
        'BS Criminology':                        { college: 'College of Criminology', extra: null },
        'BS Islamic Studies':                    { college: 'College of Islamic and Arabic Studies', extra: null },
        'AB Arabic Language':                    { college: 'College of Islamic and Arabic Studies', extra: null },
        'Bachelor of Islamic Teacher Education': { college: 'College of Islamic and Arabic Studies', extra: null },
    };

    const EXTRA_LABELS = {
        nat: { fieldId: 'nat_score', label: 'NAT Score', placeholder: 'Nursing Aptitude Test score (e.g. 320)', note: 'Nursing Aptitude Test (NAT) — required for College of Nursing applicants.' },
        eat: { fieldId: 'eat_score', label: 'EAT Score', placeholder: 'Engineering Aptitude Test score (e.g. 315)', note: 'Engineering Aptitude Test (EAT) — required for College of Engineering applicants.' },
    };

    /* ─── TRANSFEREE STEP HTML ────────────────────────────────── */

    /**
     * HTML for Step 4b: Previous School Records
     * Injected only for Transferee / Shiftee
     */
    const STEP_4B_HTML = `
    <div class="step-panel" data-step="4b" id="step4b">
        <p class="panel-title">Previous School Records</p>
        <p class="panel-subtitle">Provide details about your academic history from your previous school</p>

        <div class="notice yellow">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Your Transcript of Records (TOR) or true copy of grades must be official and certified. Unofficial copies may cause delays.
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Previous School / University <span class="req">*</span></label>
                <input type="text" id="prev_school" placeholder="Full name of previous school" required>
            </div>
            <div class="form-group">
                <label>School Address <span class="req">*</span></label>
                <input type="text" id="prev_school_address" placeholder="City / Province" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Previous Program / Course <span class="req">*</span></label>
                <input type="text" id="prev_course" placeholder="e.g. BS Computer Engineering" required>
            </div>
            <div class="form-group sm" style="flex:0 0 130px">
                <label>Year Level Reached <span class="req">*</span></label>
                <select id="prev_year_level" required>
                    <option value="">-- Select --</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>5th Year</option>
                </select>
            </div>
            <div class="form-group sm" style="flex:0 0 130px">
                <label>Last Semester Attended <span class="req">*</span></label>
                <select id="prev_sem" required>
                    <option value="">-- Select --</option>
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>Summer</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group sm" style="flex:0 0 160px">
                <label>School Year Last Attended <span class="req">*</span></label>
                <input type="text" id="prev_school_year" placeholder="e.g. 2023–2024" required>
            </div>
            <div class="form-group">
                <label>General Weighted Average (GWA) <span class="req">*</span></label>
                <input type="text" id="prev_gwa" placeholder="e.g. 88.50 or 1.75" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Reason for Transferring / Shifting <span class="req">*</span></label>
                <select id="transfer_reason" required>
                    <option value="">-- Select primary reason --</option>
                    <optgroup label="Academic">
                        <option>Change of program / course preference</option>
                        <option>Academic performance / failing grades</option>
                        <option>Course not available in previous school</option>
                        <option>Dismissed / Academically disqualified</option>
                    </optgroup>
                    <optgroup label="Personal">
                        <option>Financial constraints</option>
                        <option>Family relocation</option>
                        <option>Health reasons</option>
                        <option>Personal / Family circumstances</option>
                    </optgroup>
                    <optgroup label="Institutional">
                        <option>School closure / program termination</option>
                        <option>Prefer WMSU's program / faculty / facilities</option>
                        <option>Scholarship opportunity at WMSU</option>
                        <option>Other</option>
                    </optgroup>
                </select>
            </div>
        </div>

        <div class="form-row" id="other_reason_row" style="display:none">
            <div class="form-group">
                <label>Please specify your reason</label>
                <input type="text" id="transfer_reason_other" placeholder="Describe your reason for transferring">
            </div>
        </div>

        <div class="section-divider"></div>
        <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:14px;">Subjects / Units Carried</p>

        <div class="form-row">
            <div class="form-group sm" style="flex:0 0 180px">
                <label>Total Units Earned <span class="req">*</span></label>
                <input type="number" id="units_earned" placeholder="e.g. 72" min="0" max="300" required>
            </div>
            <div class="form-group sm" style="flex:0 0 180px">
                <label>Units to be Credited (est.)</label>
                <input type="number" id="units_credited" placeholder="e.g. 54" min="0" max="300">
            </div>
            <div class="form-group">
                <label>Subjects with Failing Grades (if any)</label>
                <input type="text" id="failed_subjects" placeholder="e.g. Calculus 2, Physics 1 (or leave blank if none)">
            </div>
        </div>

        <div class="notice red" id="failed_subjects_notice" style="display:none">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Subjects with failing grades may affect your eligibility for transfer. The Registrar's Office will review your records.
        </div>

        <div class="form-nav">
            <button class="btn-back" onclick="window.WMSU_prevFrom4b()">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
            </button>
            <span class="step-counter" id="stepCounter4b">Step 5 of 8</span>
            <button class="btn-next" onclick="window.WMSU_nextFrom4b()">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
        </div>
    </div>`;

    /**
     * HTML for Step 4c: Transferee Documents
     * Injected only for Transferee / Shiftee
     */
    const STEP_4C_HTML = `
    <div class="step-panel" data-step="4c" id="step4c">
        <p class="panel-title">Transfer Documents</p>
        <p class="panel-subtitle">Upload the required documents from your previous school</p>

        <div class="notice red">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            The <strong>Transcript of Records (or True Copy of Grades)</strong> and <strong>Honorable Dismissal / Transfer Credentials</strong> are required. All other documents are highly recommended.
        </div>

        <!-- REQUIRED: TOR -->
        <div class="upload-group">
            <label>Transcript of Records (TOR) / True Copy of Grades <span class="req">*</span></label>
            <p class="upload-note-text">Must be certified true copy issued by your previous school's Registrar</p>
            <label class="upload-box" for="tor_doc" id="uploadBox_tor">
                <div class="upload-icon">↑</div>
                <p class="upload-title">Click to upload TOR / True Copy of Grades</p>
                <p class="upload-sub">JPG, PNG, PDF — Max 10MB</p>
                <p class="upload-filename" id="fname_tor"></p>
            </label>
            <input type="file" id="tor_doc" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_tor','fname_tor')">
        </div>

        <!-- REQUIRED: Honorable Dismissal -->
        <div class="upload-group">
            <label>Honorable Dismissal / Transfer Credentials <span class="req">*</span></label>
            <p class="upload-note-text">Official document from your previous school confirming you left in good standing</p>
            <label class="upload-box" for="honorable_doc" id="uploadBox_hd">
                <div class="upload-icon">↑</div>
                <p class="upload-title">Click to upload Honorable Dismissal</p>
                <p class="upload-sub">JPG, PNG, PDF — Max 10MB</p>
                <p class="upload-filename" id="fname_hd"></p>
            </label>
            <input type="file" id="honorable_doc" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_hd','fname_hd')">
        </div>

        <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:20px 0 12px;">Recommended Documents</p>

        <!-- Course Description / Syllabi -->
        <div class="upload-group">
            <label>Course Description / Syllabi</label>
            <p class="upload-note-text">For subjects you want credited. Helps the Registrar assess equivalency faster.</p>
            <label class="upload-box" for="course_desc_doc" id="uploadBox_cd">
                <div class="upload-icon">↑</div>
                <p class="upload-title">Click to upload Course Descriptions</p>
                <p class="upload-sub">JPG, PNG, PDF — Max 10MB</p>
                <p class="upload-filename" id="fname_cd"></p>
            </label>
            <input type="file" id="course_desc_doc" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_cd','fname_cd')">
        </div>

        <!-- Certificate of Good Moral from Previous School -->
        <div class="upload-group">
            <label>Certificate of Good Moral Character (from Previous School)</label>
            <label class="upload-box" for="prev_good_moral" id="uploadBox_pgm">
                <div class="upload-icon">↑</div>
                <p class="upload-title">Click to upload Good Moral Certificate</p>
                <p class="upload-sub">JPG, PNG, PDF — Max 5MB</p>
                <p class="upload-filename" id="fname_pgm"></p>
            </label>
            <input type="file" id="prev_good_moral" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_pgm','fname_pgm')">
        </div>

        <!-- For Shiftees: shows only if shiftee -->
        <div id="shiftee_only_docs" style="display:none">
            <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:20px 0 12px;">Shiftee-Specific Documents</p>

            <div class="upload-group">
                <label>Department Approval / Endorsement Letter</label>
                <p class="upload-note-text">Letter from your previous department approving or endorsing your shift</p>
                <label class="upload-box" for="dept_endorse_doc" id="uploadBox_de">
                    <div class="upload-icon">↑</div>
                    <p class="upload-title">Click to upload Endorsement Letter</p>
                    <p class="upload-sub">JPG, PNG, PDF — Max 5MB</p>
                    <p class="upload-filename" id="fname_de"></p>
                </label>
                <input type="file" id="dept_endorse_doc" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_de','fname_de')">
            </div>

            <div class="upload-group">
                <label>Petition for Change of Course</label>
                <p class="upload-note-text">Signed petition form, if required by your previous college</p>
                <label class="upload-box" for="petition_doc" id="uploadBox_pet">
                    <div class="upload-icon">↑</div>
                    <p class="upload-title">Click to upload Petition Form</p>
                    <p class="upload-sub">JPG, PNG, PDF — Max 5MB</p>
                    <p class="upload-filename" id="fname_pet"></p>
                </label>
                <input type="file" id="petition_doc" accept=".jpg,.jpeg,.png,.pdf" hidden onchange="showFilename(this,'uploadBox_pet','fname_pet')">
            </div>
        </div>

        <div class="form-nav">
            <button class="btn-back" onclick="window.WMSU_prevFrom4c()">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
            </button>
            <span class="step-counter" id="stepCounter4c">Step 6 of 8</span>
            <button class="btn-next" onclick="window.WMSU_nextFrom4c()">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
        </div>
    </div>`;

    /* ─── STATE ────────────────────────────────────────────────── */
    var isTransferee   = false; // true for Transferee OR Shiftee
    var isShiftee      = false;
    var transferStepsInjected = false;
    var currentExtraFieldId   = null;

    /* ─── HELPERS ──────────────────────────────────────────────── */

    function getSavedApp() {
        try { return JSON.parse(localStorage.getItem('freshmanApp') || '{}'); }
        catch (e) { return {}; }
    }

    function getCollegeForCourse(name) {
        if (!name) return null;
        if (COURSE_COLLEGE_MAP[name]) return COURSE_COLLEGE_MAP[name].college;
        const norm = name.trim().toLowerCase();
        for (var k in COURSE_COLLEGE_MAP) {
            if (k.toLowerCase() === norm) return COURSE_COLLEGE_MAP[k].college;
        }
        return null;
    }

    function getExtraForCourse(name) {
        if (!name) return null;
        if (COURSE_COLLEGE_MAP[name]) return COURSE_COLLEGE_MAP[name].extra;
        const norm = name.trim().toLowerCase();
        for (var k in COURSE_COLLEGE_MAP) {
            if (k.toLowerCase() === norm) return COURSE_COLLEGE_MAP[k].extra;
        }
        return null;
    }

    function setField(id, value) {
        const el = document.getElementById(id);
        if (!el || value === undefined || value === null || value === '') return;
        el.value = value;
    }

    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function getQueryParameter(name) {
        if (typeof URLSearchParams === 'undefined') return '';
        return new URLSearchParams(window.location.search).get(name) || '';
    }

    function normalizeStudentType(type) {
        if (!type) return '';
        const normalized = type.toString().trim().toLowerCase();
        if (normalized === 'freshman') return 'Freshman';
        if (normalized === 'transferee') return 'Transferee';
        if (normalized === 'shiftee' || normalized === 'shift') return 'Shiftee';
        return type.toString().trim();
    }

    function applyStudentType(app) {
        const type = normalizeStudentType(getQueryParameter('type') || app.studentType || app.applicantType || '');
        if (!type) return;
        setField('student_type', type);
    }

    /* ─── DETECT STUDENT TYPE ──────────────────────────────────── */

    /**
     * Called whenever student_type select changes (Step 4)
     * Injects or removes the transfer steps accordingly.
     */
    function onStudentTypeChange(type) {
        const wasTransferee = isTransferee;
        isTransferee = (type === 'Transferee' || type === 'Shiftee');
        isShiftee    = (type === 'Shiftee');

        if (isTransferee && !transferStepsInjected) {
            injectTransferSteps();
        }

        if (transferStepsInjected) {
            rebuildStepper();

            // Show / hide shiftee-only documents
            const shifteeSection = document.getElementById('shiftee_only_docs');
            if (shifteeSection) {
                shifteeSection.style.display = isShiftee ? 'block' : 'none';
            }

            // Update step counters
            updateTransferStepCounters();
        }

        // If they switch BACK to Freshman, hide the transfer panels
        if (!isTransferee && transferStepsInjected) {
            const p4b = document.getElementById('step4b');
            const p4c = document.getElementById('step4c');
            if (p4b) p4b.style.display = 'none';
            if (p4c) p4c.style.display = 'none';
            rebuildStepper();
        } else if (isTransferee && transferStepsInjected) {
            const p4b = document.getElementById('step4b');
            const p4c = document.getElementById('step4c');
            if (p4b) p4b.style.display = '';
            if (p4c) p4c.style.display = '';
            rebuildStepper();
        }
    }

    /* ─── INJECT TRANSFER STEPS INTO DOM ──────────────────────── */

    function injectTransferSteps() {
        // Find step 5 panel (Documents), insert before it
        const step5Panel = document.querySelector('.step-panel[data-step="5"]');
        if (!step5Panel || document.getElementById('step4b')) return;

        // Insert 4b before step5
        step5Panel.insertAdjacentHTML('beforebegin', STEP_4B_HTML);
        // Insert 4c before step5
        step5Panel.insertAdjacentHTML('beforebegin', STEP_4C_HTML);

        transferStepsInjected = true;

        // Wire "Other" reason textarea show/hide
        const reasonSelect = document.getElementById('transfer_reason');
        if (reasonSelect) {
            reasonSelect.addEventListener('change', function () {
                const otherRow = document.getElementById('other_reason_row');
                if (otherRow) otherRow.style.display = this.value === 'Other' ? 'flex' : 'none';
            });
        }

        // Show failed-subjects notice when field is filled
        const failedField = document.getElementById('failed_subjects');
        if (failedField) {
            failedField.addEventListener('input', function () {
                const notice = document.getElementById('failed_subjects_notice');
                if (notice) notice.style.display = this.value.trim() ? 'flex' : 'none';
            });
        }

        // Wire navigation handlers
        window.WMSU_prevFrom4b = function () {
            hidePanels();
            showPanel('[data-step="4"]');
            window.currentStep = 4;
            if (typeof buildStepper === 'function') buildStepper();
            updateProgress();
            scrollTop();
        };

        window.WMSU_nextFrom4b = function () {
            if (!validate4b()) return;
            hidePanels();
            showPanel('#step4c');
            window.currentStep = '4c';
            if (typeof buildStepper === 'function') buildStepper();
            updateProgress();
            scrollTop();
        };

        window.WMSU_prevFrom4c = function () {
            hidePanels();
            showPanel('#step4b');
            window.currentStep = '4b';
            if (typeof buildStepper === 'function') buildStepper();
            updateProgress();
            scrollTop();
        };

        window.WMSU_nextFrom4c = function () {
            if (!validate4c()) return;
            hidePanels();
            showPanel('[data-step="5"]');
            window.currentStep = 5;
            if (typeof buildStepper === 'function') buildStepper();
            updateProgress();
            scrollTop();
        };
    }

    function hidePanels() {
        document.querySelectorAll('.step-panel').forEach(function (p) { p.classList.remove('active'); });
    }

    function showPanel(selector) {
        const el = document.querySelector(selector);
        if (el) el.classList.add('active');
    }

    function scrollTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateProgress() {
        if (typeof window.updateProgress === 'function') {
            window.updateProgress();
        }
    }

    /* ─── STEP COUNTER LABELS ──────────────────────────────────── */

    function updateTransferStepCounters() {
        const total = isTransferee ? 8 : 6;
        const label4b = document.getElementById('stepCounter4b');
        const label4c = document.getElementById('stepCounter4c');
        if (label4b) label4b.textContent = 'Step 5 of ' + total;
        if (label4c) label4c.textContent = 'Step 6 of ' + total;
    }

    /* ─── REBUILD STEPPER ──────────────────────────────────────── */

    function rebuildStepper() {
        if (typeof window.WMSU_origBuildStepper !== 'function') return;

        // We patch window.STEPS to include or exclude transfer steps
        if (isTransferee) {
            window.STEPS = [
                { label: 'Course'    },
                { label: 'Personal'  },
                { label: 'Family'    },
                { label: 'Academic'  },
                { label: 'Prev School' },
                { label: 'Transfer Docs' },
                { label: 'Documents' },
                { label: 'Review'    },
            ];
        } else {
            window.STEPS = [
                { label: 'Course'    },
                { label: 'Personal'  },
                { label: 'Family'    },
                { label: 'Academic'  },
                { label: 'Documents' },
                { label: 'Review'    },
            ];
        }

        window.WMSU_origBuildStepper();
    }

    /* ─── VALIDATION: Steps 4b & 4c ──────────────────────────── */

    function validate4b() {
        const required = [
            { id: 'prev_school',      label: 'Previous School / University' },
            { id: 'prev_school_address', label: 'School Address' },
            { id: 'prev_course',      label: 'Previous Program / Course' },
            { id: 'prev_year_level',  label: 'Year Level Reached' },
            { id: 'prev_sem',         label: 'Last Semester Attended' },
            { id: 'prev_school_year', label: 'School Year Last Attended' },
            { id: 'prev_gwa',         label: 'GWA' },
            { id: 'transfer_reason',  label: 'Reason for Transferring' },
            { id: 'units_earned',     label: 'Total Units Earned' },
        ];

        for (var i = 0; i < required.length; i++) {
            var item = required[i];
            var el = document.getElementById(item.id);
            if (!el) continue;
            if (!el.value.trim()) {
                el.focus();
                el.style.borderColor = 'var(--crimson)';
                (function (e) { setTimeout(function () { e.style.borderColor = ''; }, 2000); })(el);
                alert('Please fill in: ' + item.label);
                return false;
            }
        }

        // If "Other" reason selected, require the text field
        if (getVal('transfer_reason') === 'Other') {
            var otherEl = document.getElementById('transfer_reason_other');
            if (otherEl && !otherEl.value.trim()) {
                otherEl.focus();
                alert('Please specify your reason for transferring.');
                return false;
            }
        }

        return true;
    }

    function validate4c() {
        // TOR is required
        var tor = document.getElementById('tor_doc');
        if (!tor || !tor.files || !tor.files.length) {
            alert('Please upload your Transcript of Records (TOR) / True Copy of Grades. It is required for transferees.');
            return false;
        }

        // Honorable Dismissal is required
        var hd = document.getElementById('honorable_doc');
        if (!hd || !hd.files || !hd.files.length) {
            alert('Please upload your Honorable Dismissal / Transfer Credentials. It is required for transferees.');
            return false;
        }

        return true;
    }

    /* ─── PATCH NEXT / PREV FROM STEP 4 ──────────────────────── */

    /**
     * Patches the existing nextStep(4) so that if the student is a
     * Transferee or Shiftee, it navigates to 4b instead of 5.
     */
    function patchStep4Navigation() {
        if (typeof window.nextStep !== 'function') return;
        var origNext = window.nextStep;

        window.nextStep = function (from) {
            if (from === 4 && isTransferee && transferStepsInjected) {
                // Run step-4 validation first
                if (typeof window.validateStep === 'function' && !window.validateStep(4)) return;
                hidePanels();
                showPanel('#step4b');
                window.currentStep = '4b';
                if (typeof buildStepper === 'function') buildStepper();
                updateProgress();
                scrollTop();
                return;
            }
            origNext(from);
        };

        // Patch prevStep(5) so transferees go to 4c, not 4
        if (typeof window.prevStep === 'function') {
            var origPrev = window.prevStep;
            window.prevStep = function (from) {
                if (from === 5 && isTransferee && transferStepsInjected) {
                    hidePanels();
                    showPanel('#step4c');
                    window.currentStep = '4c';
                    if (typeof buildStepper === 'function') buildStepper();
                    updateProgress();
                    scrollTop();
                    return;
                }
                origPrev(from);
            };
        }
    }

    /* ─── STEP 1 — COURSE GRID FILTER ────────────────────────── */

    function filterCourseGrid(targetCollege) {
        if (!targetCollege) return;
        const grid = document.getElementById('courseGrid');
        if (!grid) return;

        grid.innerHTML = '';
        if (!window.COURSE_INFO) window.COURSE_INFO = {};
        Object.keys(window.COURSE_INFO).forEach(function (k) { delete window.COURSE_INFO[k]; });

        const courses = Object.keys(COURSE_COLLEGE_MAP).filter(function (name) {
            return COURSE_COLLEGE_MAP[name].college === targetCollege;
        });
        if (!courses.length) return;

        courses.forEach(function (courseName) {
            const key = courseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
            window.COURSE_INFO[key] = { label: courseName, college: targetCollege, description: 'A program offered by the ' + targetCollege + '.' };

            const label = document.createElement('label');
            label.className = 'course-card';
            label.dataset.value = key;
            label.innerHTML =
                '<input type="radio" name="course" value="' + key + '">' +
                '<div class="course-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>' +
                '<div class="course-name">' + courseName + '</div>' +
                '<div class="course-abbr">' + targetCollege + '</div>';

            label.addEventListener('click', function () {
                document.querySelectorAll('.course-card').forEach(function (c) { c.classList.remove('selected'); });
                label.classList.add('selected');
                const input = label.querySelector('input[type="radio"]');
                if (input) {
                    input.checked = true;
                    updateBanner(courseName, targetCollege);
                    handleExtraField(courseName);
                }
            });
            grid.appendChild(label);
        });
    }

    function updateBanner(courseName, collegeName) {
        const cn = document.getElementById('collegeName');
        const pn = document.getElementById('programName');
        if (cn) cn.textContent = collegeName || 'WMSU';
        if (pn) pn.textContent = courseName  || 'Select a course below.';
    }

    function autoSelectCourse(savedCourseName) {
        if (!savedCourseName) return;
        const key = savedCourseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        let card = document.querySelector('.course-card[data-value="' + key + '"]');

        if (!card) {
            document.querySelectorAll('.course-card').forEach(function (c) {
                const nameEl = c.querySelector('.course-name');
                if (nameEl && nameEl.textContent.trim().toLowerCase() === savedCourseName.toLowerCase()) card = c;
            });
        }
        if (!card) return;

        document.querySelectorAll('.course-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        const input = card.querySelector('input[type="radio"]');
        if (input) {
            input.checked = true;
            const college = getCollegeForCourse(savedCourseName);
            updateBanner(savedCourseName, college || 'WMSU');
            handleExtraField(savedCourseName);
        }
    }

    /* ─── STEP 2 — CET OAPR ──────────────────────────────────── */

    function injectOAPR(oapr) {
        if (document.getElementById('cet_oapr_row')) return;
        const cetIdRow = document.getElementById('cetid') && document.getElementById('cetid').closest('.form-row');
        if (!cetIdRow) return;
        const display = (oapr !== undefined && oapr !== null) ? oapr : '—';
        const row = document.createElement('div');
        row.className = 'form-row'; row.id = 'cet_oapr_row';
        row.innerHTML =
            '<div class="form-group" style="max-width:260px">' +
                '<label>CET OAPR <span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:5px;">(Overall Ability Percentile Rank)</span></label>' +
                '<input type="text" id="cet_oapr" value="' + display + '" readonly style="background:#f3f4f6;cursor:default;font-weight:700;color:var(--crimson);" title="Automatically retrieved from your CET record.">' +
            '</div>' +
            '<div class="form-group" style="flex:1;align-self:flex-end;">' +
                '<p style="font-size:12px;color:var(--muted);font-style:italic;padding-bottom:10px;">Your OAPR is pulled from your CET record and cannot be edited.</p>' +
            '</div>';
        cetIdRow.insertAdjacentElement('afterend', row);
    }

    /* ─── STEP 4 — NAT / EAT FIELD ──────────────────────────── */

    function handleExtraField(courseName) {
        ['extra_score_row_nat', 'extra_score_row_eat'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.remove();
        });
        currentExtraFieldId = null;

        const extraType = getExtraForCourse(courseName);
        if (!extraType) return;
        const info = EXTRA_LABELS[extraType];
        const studentTypeEl = document.getElementById('student_type');
        if (!studentTypeEl) return;
        const anchor = studentTypeEl.closest('.form-row');
        if (!anchor) return;

        currentExtraFieldId = info.fieldId;
        const row = document.createElement('div');
        row.className = 'form-row'; row.id = 'extra_score_row_' + extraType;
        row.innerHTML =
            '<div class="form-group" style="max-width:340px">' +
                '<label>' + info.label + ' <span class="req">*</span></label>' +
                '<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:4px;">' + info.note + '</p>' +
                '<input type="number" id="' + info.fieldId + '" placeholder="' + info.placeholder + '" min="0" max="500" required>' +
            '</div>';
        anchor.insertAdjacentElement('afterend', row);

        const saved = getSavedApp();
        const savedVal = extraType === 'nat'
            ? (saved.natScore || (saved.cet && saved.cet.natScore))
            : (saved.eatScore || (saved.cet && saved.cet.eatScore));
        if (savedVal) setField(info.fieldId, savedVal);
    }

    /* ─── PRE-FILL FORM ──────────────────────────────────────── */

    function prefillForm(app) {
        setField('lastname',   app.surname       || '');
        setField('firstname',  app.firstname     || '');
        setField('middlename', app.middleinitial || '');
        if (app.appNo) setField('cetid', app.appNo.replace(/\D/g, ''));
        setField('nationality', 'Filipino');
        setField('email',  app.email   || '');
        setField('phone',  app.contact || '');

        const savedType = app.studentType || app.applicantType || '';
        if (savedType) {
            setField('student_type', normalizeStudentType(savedType));
        }

        const oapr = (app.cet && app.cet.oapr !== undefined) ? app.cet.oapr
                   : (app.cetOapr !== undefined ? app.cetOapr : null);
        injectOAPR(oapr);

        if (typeof window.WMSU_lookupApplicant === 'function' && app.appNo) {
            const rec = window.WMSU_lookupApplicant(app.appNo);
            if (rec) {
                if (!app.surname)       setField('lastname',   rec.surname       || '');
                if (!app.firstname)     setField('firstname',  rec.firstname     || '');
                if (!app.middleinitial) setField('middlename', rec.middleinitial || '');
                const oaprEl = document.getElementById('cet_oapr');
                if (oaprEl && rec.cet && rec.cet.oapr) oaprEl.value = rec.cet.oapr;
            }
        }
    }

    /* ─── PATCH VALIDATION ───────────────────────────────────── */

    function patchValidation() {
        if (typeof window.validateStep !== 'function') return;
        const orig = window.validateStep;
        window.validateStep = function (step) {
            if (!orig(step)) return false;
            if (step === 4 && currentExtraFieldId) {
                const el = document.getElementById(currentExtraFieldId);
                if (el && !el.value.trim()) {
                    el.focus();
                    el.style.borderColor = 'var(--crimson)';
                    setTimeout(function () { el.style.borderColor = ''; }, 2000);
                    const lbl = currentExtraFieldId === 'nat_score' ? 'NAT' : 'EAT';
                    alert('Please enter your ' + lbl + ' score. It is required for this course.');
                    return false;
                }
            }
            return true;
        };
    }

    /* ─── PATCH BUILD REVIEW ─────────────────────────────────── */

    function patchBuildReview() {
        if (typeof window.buildReview !== 'function') return;
        const orig = window.buildReview;
        window.buildReview = function () {
            orig();
            const content = document.getElementById('reviewContent');
            if (!content) return;

            const oapr       = (document.getElementById('cet_oapr') || {}).value || '—';
            const extraVal   = currentExtraFieldId ? ((document.getElementById(currentExtraFieldId) || {}).value || '—') : null;
            const extraLabel = currentExtraFieldId === 'nat_score' ? 'NAT Score'
                             : currentExtraFieldId === 'eat_score' ? 'EAT Score' : null;

            // Append OAPR to Academic section
            content.querySelectorAll('.review-section').forEach(function (sec) {
                const h3 = sec.querySelector('h3');
                if (!h3 || h3.textContent.trim() !== 'Academic Background') return;
                const grid = sec.querySelector('.review-grid');
                if (!grid) return;
                appendReviewItem(grid, 'CET OAPR', oapr, 'color:var(--crimson)');
                if (extraVal && extraLabel) appendReviewItem(grid, extraLabel, extraVal);
            });

            // Append transferee section if applicable
            if (isTransferee) {
                const divider = document.createElement('div'); divider.className = 'section-divider';
                content.appendChild(divider);

                const typeLabel = isShiftee ? 'Shiftee' : 'Transferee';
                const sec = document.createElement('div'); sec.className = 'review-section';
                sec.innerHTML = '<h3>Transfer / Previous School Records</h3>';
                const grid = document.createElement('div'); grid.className = 'review-grid';

                const fields = [
                    ['Student Type',                   typeLabel],
                    ['Previous School',                 getVal('prev_school')],
                    ['School Address',                  getVal('prev_school_address')],
                    ['Previous Program',                getVal('prev_course')],
                    ['Year Level Reached',              getVal('prev_year_level')],
                    ['Last Semester',                   getVal('prev_sem')],
                    ['School Year',                     getVal('prev_school_year')],
                    ['GWA (Previous School)',           getVal('prev_gwa')],
                    ['Total Units Earned',              getVal('units_earned')],
                    ['Units to be Credited (est.)',     getVal('units_credited') || '—'],
                    ['Subjects w/ Failing Grades',      getVal('failed_subjects')  || 'None'],
                    ['Reason for Transfer / Shift',
                        getVal('transfer_reason') === 'Other'
                            ? (getVal('transfer_reason_other') || 'Other')
                            : getVal('transfer_reason')
                    ],
                    ['TOR Uploaded',                    (document.getElementById('tor_doc')       || {}).files?.length ? 'Yes ✓' : 'Not uploaded'],
                    ['Honorable Dismissal Uploaded',    (document.getElementById('honorable_doc') || {}).files?.length ? 'Yes ✓' : 'Not uploaded'],
                ];

                fields.forEach(function (f) { appendReviewItem(grid, f[0], f[1] || '—'); });
                sec.appendChild(grid);
                content.appendChild(sec);
            }
        };
    }

    function appendReviewItem(grid, label, value, style) {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = '<div class="ri-label">' + label + '</div><div class="ri-value"' + (style ? ' style="' + style + '"' : '') + '>' + (value || '—') + '</div>';
        grid.appendChild(item);
    }

    /* ─── PATCH SUBMIT ───────────────────────────────────────── */

    function patchSubmit() {
        if (typeof window.submitForm !== 'function') return;
        const orig = window.submitForm;
        window.submitForm = function () {
            const saved = getSavedApp();
            const oapr = (document.getElementById('cet_oapr') || {}).value;
            const nat  = (document.getElementById('nat_score') || {}).value;
            const eat  = (document.getElementById('eat_score') || {}).value;
            if (oapr) saved.cetOapr  = parseFloat(oapr);
            if (nat)  saved.natScore = parseFloat(nat);
            if (eat)  saved.eatScore = parseFloat(eat);

            // Save transferee-specific data
            if (isTransferee) {
                saved.studentType     = isShiftee ? 'Shiftee' : 'Transferee';
                saved.prevSchool      = getVal('prev_school');
                saved.prevCourse      = getVal('prev_course');
                saved.prevYearLevel   = getVal('prev_year_level');
                saved.prevSem         = getVal('prev_sem');
                saved.prevSchoolYear  = getVal('prev_school_year');
                saved.prevGwa         = getVal('prev_gwa');
                saved.unitsEarned     = getVal('units_earned');
                saved.unitsCredited   = getVal('units_credited');
                saved.transferReason  = getVal('transfer_reason') === 'Other'
                                        ? getVal('transfer_reason_other')
                                        : getVal('transfer_reason');
                saved.failedSubjects  = getVal('failed_subjects');
            }

            localStorage.setItem('freshmanApp', JSON.stringify(saved));
            orig();
        };
    }

    /* ─── WATCH STUDENT TYPE SELECT ─────────────────────────── */

    function watchStudentType() {
        // Watch for the element (may not exist at DOMContentLoaded if the form uses
        // dynamic panels; use MutationObserver as fallback)
        function attach(el) {
            el.addEventListener('change', function () {
                onStudentTypeChange(this.value);
            });
            // Trigger on init if already pre-filled
            if (el.value) onStudentTypeChange(el.value);
        }

        const el = document.getElementById('student_type');
        if (el) { attach(el); return; }

        // Fallback: MutationObserver
        const obs = new MutationObserver(function () {
            const el2 = document.getElementById('student_type');
            if (el2) { obs.disconnect(); attach(el2); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    /* ─── PRESERVE ORIGINAL buildStepper ────────────────────── */

    function preserveBuildStepper() {
        if (typeof window.buildStepper === 'function' && !window.WMSU_origBuildStepper) {
            window.WMSU_origBuildStepper = window.buildStepper;
        } else {
            // buildStepper not defined yet; wait for it
            var check = setInterval(function () {
                if (typeof window.buildStepper === 'function' && !window.WMSU_origBuildStepper) {
                    window.WMSU_origBuildStepper = window.buildStepper;
                    clearInterval(check);
                }
            }, 50);
        }
    }

    /* ─── MAIN INIT ──────────────────────────────────────────── */

    function init() {
        const app = getSavedApp();

        preserveBuildStepper();

        // Determine college and filter course grid
        var college = app.department || null;
        if (!college && app.course) college = getCollegeForCourse(app.course);
        if (college) filterCourseGrid(college);

        // Pre-fill form fields
        prefillForm(app);
        applyStudentType(app);

        // Auto-select saved course
        if (app.course) {
            setTimeout(function () { autoSelectCourse(app.course); }, 60);
        }

        // Patch all navigations and review/submit
        patchValidation();
        patchStep4Navigation();
        patchBuildReview();
        patchSubmit();

        // Watch student_type for transferee detection
        watchStudentType();
    }

    /* ─── BOOT ───────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();