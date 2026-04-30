/**
 * WMSU-Ease — forms.js
 * Connects the enrollment form to the student's saved application data.
 *
 * Data source: localStorage → 'freshmanApp'  (set by the login page)
 * Falls back to window.WMSU_lookupApplicant() if the CET DB is also loaded.
 */

(function () {
    'use strict';

    /* ─── COURSE → COLLEGE MAP ───────────────────────────────── */
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
        nat: {
            fieldId:     'nat_score',
            label:       'NAT Score',
            placeholder: 'Nursing Aptitude Test score (e.g. 320)',
            note:        'Nursing Aptitude Test (NAT) — required for College of Nursing applicants.',
        },
        eat: {
            fieldId:     'eat_score',
            label:       'EAT Score',
            placeholder: 'Engineering Aptitude Test score (e.g. 315)',
            note:        'Engineering Aptitude Test (EAT) — required for College of Engineering applicants.',
        },
    };

    /* ─── HELPERS ────────────────────────────────────────────── */

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

    /* ─── STEP 1 — FILTER COURSE GRID ───────────────────────── */

    function filterCourseGrid(targetCollege) {
        if (!targetCollege) return;
        const grid = document.getElementById('courseGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // Rebuild COURSE_INFO with only this college's courses
        if (!window.COURSE_INFO) window.COURSE_INFO = {};
        // Clear old entries
        Object.keys(window.COURSE_INFO).forEach(function(k) { delete window.COURSE_INFO[k]; });

        const courses = Object.keys(COURSE_COLLEGE_MAP).filter(function(name) {
            return COURSE_COLLEGE_MAP[name].college === targetCollege;
        });

        if (!courses.length) return;

        courses.forEach(function(courseName) {
            const key = courseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

            window.COURSE_INFO[key] = {
                label:       courseName,
                college:     targetCollege,
                description: 'A program offered by the ' + targetCollege + '.',
            };

            const label = document.createElement('label');
            label.className = 'course-card';
            label.dataset.value = key;
            label.innerHTML =
                '<input type="radio" name="course" value="' + key + '">' +
                '<div class="course-check">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">' +
                        '<polyline points="20 6 9 17 4 12"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="course-name">' + courseName + '</div>' +
                '<div class="course-abbr">' + targetCollege + '</div>';

            label.addEventListener('click', function() {
                document.querySelectorAll('.course-card').forEach(function(c) { c.classList.remove('selected'); });
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
            document.querySelectorAll('.course-card').forEach(function(c) {
                const nameEl = c.querySelector('.course-name');
                if (nameEl && nameEl.textContent.trim().toLowerCase() === savedCourseName.toLowerCase()) {
                    card = c;
                }
            });
        }

        if (!card) return;

        document.querySelectorAll('.course-card').forEach(function(c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        const input = card.querySelector('input[type="radio"]');
        if (input) {
            input.checked = true;
            const college = getCollegeForCourse(savedCourseName);
            updateBanner(savedCourseName, college || 'WMSU');
            handleExtraField(savedCourseName);
        }
    }

    /* ─── STEP 2 — CET OAPR (read-only) ─────────────────────── */

    function injectOAPR(oapr) {
        if (document.getElementById('cet_oapr_row')) return;
        const cetIdRow = document.getElementById('cetid') && document.getElementById('cetid').closest('.form-row');
        if (!cetIdRow) return;

        const display = (oapr !== undefined && oapr !== null) ? oapr : '—';

        const row = document.createElement('div');
        row.className = 'form-row';
        row.id = 'cet_oapr_row';
        row.innerHTML =
            '<div class="form-group" style="max-width:260px">' +
                '<label>CET OAPR ' +
                    '<span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:5px;">(Overall Ability Percentile Rank)</span>' +
                '</label>' +
                '<input type="text" id="cet_oapr" value="' + display + '" readonly ' +
                    'style="background:#f3f4f6;cursor:default;font-weight:700;color:var(--crimson);" ' +
                    'title="Automatically retrieved from your CET record.">' +
            '</div>' +
            '<div class="form-group" style="flex:1;align-self:flex-end;">' +
                '<p style="font-size:12px;color:var(--muted);font-style:italic;padding-bottom:10px;">' +
                    'Your OAPR is pulled from your CET record and cannot be edited.' +
                '</p>' +
            '</div>';

        cetIdRow.insertAdjacentElement('afterend', row);
    }

    /* ─── STEP 4 — NAT / EAT FIELD ──────────────────────────── */

    var currentExtraFieldId = null;

    function handleExtraField(courseName) {
        ['extra_score_row_nat', 'extra_score_row_eat'].forEach(function(id) {
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
        row.className = 'form-row';
        row.id = 'extra_score_row_' + extraType;
        row.innerHTML =
            '<div class="form-group" style="max-width:340px">' +
                '<label>' + info.label + ' <span class="req">*</span></label>' +
                '<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:4px;">' + info.note + '</p>' +
                '<input type="number" id="' + info.fieldId + '" placeholder="' + info.placeholder + '" min="0" max="500" required>' +
            '</div>';

        anchor.insertAdjacentElement('afterend', row);

        // Pre-fill if saved
        const saved = getSavedApp();
        const savedVal = extraType === 'nat'
            ? (saved.natScore || (saved.cet && saved.cet.natScore))
            : (saved.eatScore || (saved.cet && saved.cet.eatScore));
        if (savedVal) setField(info.fieldId, savedVal);
    }

    /* ─── PRE-FILL FORM ──────────────────────────────────────── */

    function prefillForm(app) {
        // Name fields — from freshmanApp (set by login from wmsu_applications seed)
        setField('lastname',   app.surname       || '');
        setField('firstname',  app.firstname     || '');
        setField('middlename', app.middleinitial || '');

        // CET ID — use numeric part of appNo
        if (app.appNo) {
            setField('cetid', app.appNo.replace(/\D/g, ''));
        }

        setField('nationality', 'Filipino');

        // Contact
        setField('email',  app.email   || '');
        setField('phone',  app.contact || '');

        // OAPR
        const oapr = (app.cet && app.cet.oapr !== undefined) ? app.cet.oapr
                   : (app.cetOapr !== undefined ? app.cetOapr : null);
        injectOAPR(oapr);

        // If CET DB is loaded, supplement any missing fields
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
        window.validateStep = function(step) {
            if (!orig(step)) return false;
            if (step === 4 && currentExtraFieldId) {
                const el = document.getElementById(currentExtraFieldId);
                if (el && !el.value.trim()) {
                    el.focus();
                    el.style.borderColor = 'var(--crimson)';
                    setTimeout(function() { el.style.borderColor = ''; }, 2000);
                    const lbl = currentExtraFieldId === 'nat_score' ? 'NAT' : 'EAT';
                    alert('Please enter your ' + lbl + ' score. It is required for this course.');
                    return false;
                }
            }
            return true;
        };
    }

    /* ─── PATCH REVIEW ───────────────────────────────────────── */

    function patchBuildReview() {
        if (typeof window.buildReview !== 'function') return;
        const orig = window.buildReview;
        window.buildReview = function() {
            orig();
            const content = document.getElementById('reviewContent');
            if (!content) return;

            const oapr       = (document.getElementById('cet_oapr') || {}).value || '—';
            const extraVal   = currentExtraFieldId ? ((document.getElementById(currentExtraFieldId) || {}).value || '—') : null;
            const extraLabel = currentExtraFieldId === 'nat_score' ? 'NAT Score'
                             : currentExtraFieldId === 'eat_score' ? 'EAT Score' : null;

            content.querySelectorAll('.review-section').forEach(function(sec) {
                const h3 = sec.querySelector('h3');
                if (!h3 || h3.textContent.trim() !== 'Academic Background') return;
                const grid = sec.querySelector('.review-grid');
                if (!grid) return;

                const oaprItem = document.createElement('div');
                oaprItem.className = 'review-item';
                oaprItem.innerHTML = '<div class="ri-label">CET OAPR</div><div class="ri-value" style="color:var(--crimson)">' + oapr + '</div>';
                grid.appendChild(oaprItem);

                if (extraVal && extraLabel) {
                    const extraItem = document.createElement('div');
                    extraItem.className = 'review-item';
                    extraItem.innerHTML = '<div class="ri-label">' + extraLabel + '</div><div class="ri-value">' + extraVal + '</div>';
                    grid.appendChild(extraItem);
                }
            });
        };
    }

    /* ─── PATCH SUBMIT ───────────────────────────────────────── */

    function patchSubmit() {
        if (typeof window.submitForm !== 'function') return;
        const orig = window.submitForm;
        window.submitForm = function() {
            const saved = getSavedApp();
            const oapr = (document.getElementById('cet_oapr') || {}).value;
            const nat  = (document.getElementById('nat_score') || {}).value;
            const eat  = (document.getElementById('eat_score') || {}).value;
            if (oapr) saved.cetOapr  = parseFloat(oapr);
            if (nat)  saved.natScore = parseFloat(nat);
            if (eat)  saved.eatScore = parseFloat(eat);
            localStorage.setItem('freshmanApp', JSON.stringify(saved));
            orig();
        };
    }

    /* ─── MAIN INIT ──────────────────────────────────────────── */

    function init() {
        const app = getSavedApp();

        // Determine college
        var college = app.department || null;
        if (!college && app.course) college = getCollegeForCourse(app.course);

        // Filter course grid
        if (college) filterCourseGrid(college);

        // Pre-fill from freshmanApp
        prefillForm(app);

        // Auto-select saved course (also triggers NAT/EAT)
        if (app.course) {
            setTimeout(function() { autoSelectCourse(app.course); }, 60);
        }

        // Patch functions
        patchValidation();
        patchBuildReview();
        patchSubmit();
    }

    /* ─── BOOT ───────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();