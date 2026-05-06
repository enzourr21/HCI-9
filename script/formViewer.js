/**
 * WMSU-Ease — formViewer.js  (v2 — Adviser-Driven Subject Assignment)
 *
 * Read-only enrollment form viewer for Adviser dashboard.
 * Subjects are assigned by the adviser during f2f advising — NOT pre-filled.
 *
 * Features:
 *   • Empty subject panel by default (student has no pre-assigned subjects)
 *   • "Load Year 1 Prospectus" button — loads full BSCS Y1S1 from subject.js
 *   • Individual search & add — type code/title, pick from dropdown
 *   • Remove rows — X button per row
 *   • Save — persists to localStorage
 *
 * Exposes:
 *   window.openEnrollmentViewer(appNo)
 *   window.closeEnrollmentViewer()
 */

(function () {
    'use strict';

    /* ─── INJECT MODAL HTML ──────────────────────────────────────── */
    function injectModal() {
        if (document.getElementById('enrollViewerOverlay')) return;

        document.body.insertAdjacentHTML('beforeend', `
        <div id="enrollViewerOverlay" style="
            display:none; position:fixed; inset:0; z-index:10000;
            background:rgba(0,0,0,.55); backdrop-filter:blur(3px);
            align-items:center; justify-content:center; padding:20px;">

            <div id="enrollViewerCard" style="
                background:#fff; border-radius:16px; width:100%; max-width:820px;
                max-height:92vh; display:flex; flex-direction:column;
                box-shadow:0 24px 64px rgba(0,0,0,.25); overflow:hidden;">

                <!-- ── VIEWER HEADER ── -->
                <div id="evHeader" style="
                    background:linear-gradient(135deg,#c0192b 0%,#8b0000 100%);
                    padding:20px 28px; flex-shrink:0; display:flex;
                    align-items:center; gap:16px;">
                    <div id="evAvatar" style="
                        width:52px; height:52px; border-radius:50%;
                        background:rgba(255,255,255,.25);
                        border:2.5px solid rgba(255,255,255,.5);
                        display:flex; align-items:center; justify-content:center;
                        font-size:1rem; font-weight:800; color:#fff;
                        flex-shrink:0; letter-spacing:.02em;"></div>
                    <div style="flex:1; min-width:0;">
                        <div id="evName" style="font-size:1.1rem; font-weight:800; color:#fff;
                            white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
                        <div id="evSub" style="font-size:.78rem; color:rgba(255,255,255,.75); margin-top:2px;"></div>
                    </div>
                    <div style="display:flex; gap:8px; flex-shrink:0;">
                        <button id="evDownloadBtn" onclick="downloadStudentForm()" title="Download PDF" style="
                            display:flex; align-items:center; gap:7px;
                            padding:9px 18px; border-radius:8px;
                            background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.35);
                            color:#fff; font-size:.82rem; font-weight:700;
                            cursor:pointer; transition:all .2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download Info
                        </button>
                        <button onclick="closeEnrollmentViewer()" title="Close" style="
                            width:36px; height:36px; border-radius:8px;
                            background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.3);
                            color:#fff; font-size:1.3rem; cursor:pointer; line-height:1;
                            display:flex; align-items:center; justify-content:center;">×</button>
                    </div>
                </div>

                <!-- ── SCROLLABLE BODY ── -->
                <div id="evBody" style="
                    flex:1; overflow-y:auto; padding:28px 32px;
                    background:#fafafa;">
                </div>
            </div>
        </div>`);

        /* Close on backdrop click */
        document.getElementById('enrollViewerOverlay').addEventListener('click', function(e){
            if (e.target === this) closeEnrollmentViewer();
        });
        document.addEventListener('keydown', function(e){
            if (e.key === 'Escape') closeEnrollmentViewer();
        });

        /* Download button hover */
        const btn = document.getElementById('evDownloadBtn');
        if (btn) {
            btn.addEventListener('mouseenter', function(){ this.style.background = 'rgba(255,255,255,.3)'; });
            btn.addEventListener('mouseleave', function(){ this.style.background = 'rgba(255,255,255,.18)'; });
        }
    }

    /* ─── STATE ──────────────────────────────────────────────────── */
    let _currentApp      = null;
    let _currentSubjects = [];   // working copy — adviser fills this during f2f

    /* ─── OPEN ───────────────────────────────────────────────────── */
    window.openEnrollmentViewer = function(appNo) {
        injectModal();

        let apps = [];
        try { apps = JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); } catch(e) {}
        const s = apps.find(a => a.appNo === appNo);
        if (!s) { alert('Student record not found: ' + appNo); return; }

        _currentApp = s;
        /* Start from whatever is already saved — if nothing, blank slate */
        _currentSubjects = JSON.parse(JSON.stringify(s.enrolledSubjects || []));

        const initials = (s.name || '??').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
        document.getElementById('evAvatar').textContent = initials;
        document.getElementById('evName').textContent   = s.name || s.appNo || '—';
        document.getElementById('evSub').textContent    =
            `${s.appNo || '—'}  ·  ${s.course || 'Unknown Course'}  ·  ${s.department || ''}`;

        document.getElementById('evBody').innerHTML = buildFormHTML(s);
        const overlay = document.getElementById('enrollViewerOverlay');
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        renderSubjectPanel();
    };

    /* ─── CLOSE ──────────────────────────────────────────────────── */
    window.closeEnrollmentViewer = function() {
        const overlay = document.getElementById('enrollViewerOverlay');
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = '';
    };

    /* ─── PROGRAM RESOLVER ───────────────────────────────────────── */
    function resolveProgramId(courseName) {
        if (!courseName) return null;
        const n = courseName.toLowerCase();
        const map = [
            ['computer science',      'BSCS'],
            ['information technology','BSIT'],
            ['information systems',   'BSIS'],
            ['nursing',               'BSN'],
            ['civil engineering',     'BSCE'],
            ['business administration','BSBA'],
        ];
        for (const [needle, id] of map) {
            if (n.includes(needle)) return id;
        }
        return null;
    }

    /* ─── GET PROSPECTUS SUBJECTS ────────────────────────────────── */
    /**
     * Returns all Year 1 Sem 1 subjects for the student's program
     * from subject.js COLLEGES. Falls back to GE subjects if not found.
     */
    function getProspectusYear1Subjects() {
        if (typeof COLLEGES === 'undefined') return [];

        const programId = resolveProgramId(_currentApp?.course || '');
        if (!programId) return [];

        const SEM_FIRST = '1st';
        for (const college of Object.values(COLLEGES)) {
            const prog = college.programs[programId];
            if (!prog) continue;
            const y1s1 = prog.prospectus?.[1]?.[SEM_FIRST] || [];
            return y1s1.map(s => ({
                code:  s.code  || '',
                title: s.title || s.description || '',
                units: s.units || 0,
                type:  s.type  || '',
            }));
        }
        return [];
    }

    /**
     * Returns ALL subjects available for this program (all years + GE),
     * used for the individual search dropdown.
     */
    function getAvailableSubjects() {
        const ge = (typeof GE_SUBJECTS !== 'undefined') ? Object.values(GE_SUBJECTS) : [];
        if (typeof COLLEGES === 'undefined') return ge;

        const programId = resolveProgramId(_currentApp?.course || '');
        let programSubs = [];

        for (const college of Object.values(COLLEGES)) {
            for (const [pid, prog] of Object.entries(college.programs)) {
                if (programId && pid !== programId) continue;
                for (const yearData of Object.values(prog.prospectus)) {
                    for (const semSubs of Object.values(yearData)) {
                        programSubs.push(...semSubs);
                    }
                }
                if (programId) break;
            }
            if (programId && programSubs.length) break;
        }

        const seen = new Set();
        return [...programSubs, ...ge].filter(s => {
            const key = (s.id || s.code || '').trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function searchSubjects(query) {
        const q = (query || '').toLowerCase().trim();
        const addedCodes = new Set(_currentSubjects.map(s => (s.code || '').trim().toLowerCase()));
        const all = getAvailableSubjects();

        return all.filter(s => {
            if (addedCodes.has((s.code || '').trim().toLowerCase())) return false;
            if (!q) return true;
            return (s.code  || '').toLowerCase().includes(q)
                || (s.title || '').toLowerCase().includes(q);
        }).slice(0, 12);
    }

    /* ─── SUBJECT PANEL ──────────────────────────────────────────── */
    function renderSubjectPanel() {
        const panel = document.getElementById('evSubjectPanel');
        if (!panel) return;

        const subs       = _currentSubjects;
        const totalUnits = subs.reduce((t, s) => t + (Number(s.units) || 0), 0);
        const hasSubjects = subs.length > 0;

        /* Rows */
        const rowsHTML = hasSubjects
            ? subs.map((sub, i) => {
                const typeTag = sub.type
                    ? `<span style="font-size:10px;padding:2px 7px;border-radius:10px;
                            background:#f3f4f6;color:#6b7280;font-weight:600;
                            text-transform:capitalize;margin-left:6px;">${esc(sub.type)}</span>`
                    : '';
                return `
                <tr style="border-bottom:1px solid #f0f0f0;">
                    <td style="padding:9px 10px;width:36px;text-align:center;">
                        <button onclick="evRemoveRow(${i})" title="Remove subject"
                            style="background:none;border:none;cursor:pointer;color:#e2e8f0;
                                padding:3px;border-radius:4px;line-height:1;display:inline-flex;"
                            onmouseover="this.style.color='#ef4444'"
                            onmouseout="this.style.color='#e2e8f0'">
                            <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13'
                                viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'>
                                <line x1='18' y1='6' x2='6' y2='18'/>
                                <line x1='6' y1='6' x2='18' y2='18'/>
                            </svg>
                        </button>
                    </td>
                    <td style="padding:9px 10px;font-size:12px;font-weight:700;
                        white-space:nowrap;color:#374151;">${esc(sub.code)}</td>
                    <td style="padding:9px 10px;font-size:12px;color:#1a1a1a;line-height:1.4;">
                        ${esc(sub.title || sub.description || '')}${typeTag}
                    </td>
                    <td style="padding:9px 10px;text-align:center;font-size:12.5px;
                        font-weight:700;color:#374151;">${sub.units}</td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="4" style="padding:32px 16px;text-align:center;
                    color:#d1d5db;font-size:12.5px;">
                    <div style="font-size:28px;margin-bottom:8px;">📋</div>
                    <strong style="display:block;color:#9ca3af;margin-bottom:4px;">No subjects assigned yet</strong>
                    <span style="color:#d1d5db;">Use <strong style="color:#c0192b;">Load Year 1 Prospectus</strong> to load defaults,
                    or search a subject below to add one by one.</span>
               </td></tr>`;

        panel.innerHTML = `
        <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;
            overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.04);">

            <!-- ── Panel Header ── -->
            <div style="padding:13px 18px;background:linear-gradient(90deg,#fff5f5,#fff);
                border-bottom:1px solid #fde8e8;
                display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span style="font-size:16px;">📋</span>
                <span style="font-size:12px;font-weight:800;text-transform:uppercase;
                    letter-spacing:.08em;color:#c0192b;flex:1;">
                    Subject Assignment
                    <span style="font-weight:400;font-size:10.5px;text-transform:none;
                        letter-spacing:0;color:#9ca3af;margin-left:6px;">
                        Adviser assigns during f2f advising
                    </span>
                </span>

                <!-- Load Prospectus Button -->
                <button onclick="evLoadProspectus()"
                    title="Load all Year 1, Sem 1 subjects from the BSCS prospectus"
                    style="display:flex;align-items:center;gap:6px;
                        padding:7px 14px;border-radius:7px;
                        background:#fff3cd;border:1.5px solid #ffc107;
                        color:#856404;font-size:11.5px;font-weight:700;
                        cursor:pointer;transition:all .15s;white-space:nowrap;"
                    onmouseover="this.style.background='#ffc107';this.style.color='#1a1a1a';"
                    onmouseout="this.style.background='#fff3cd';this.style.color='#856404';">
                    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'
                        viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'>
                        <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/>
                        <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/>
                    </svg>
                    Load Year 1 Prospectus
                </button>

                ${hasSubjects
                    ? `<span id="evTotalPill" style="font-size:.72rem;background:#dcfce7;
                            color:#15803d;padding:3px 10px;border-radius:20px;
                            font-weight:700;">${totalUnits} units total</span>`
                    : ''}
            </div>

            <!-- ── Subject Table ── -->
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;min-width:400px;">
                    <thead>
                        <tr style="background:#fafafa;">
                            <th style="padding:7px 10px;width:36px;
                                border-bottom:1px solid #f0f0f0;"></th>
                            <th style="padding:7px 10px;text-align:left;font-size:11px;
                                color:#9ca3af;font-weight:700;
                                border-bottom:1px solid #f0f0f0;">Code</th>
                            <th style="padding:7px 10px;text-align:left;font-size:11px;
                                color:#9ca3af;font-weight:700;
                                border-bottom:1px solid #f0f0f0;">Subject Title</th>
                            <th style="padding:7px 10px;text-align:center;font-size:11px;
                                color:#9ca3af;font-weight:700;width:60px;
                                border-bottom:1px solid #f0f0f0;">Units</th>
                        </tr>
                    </thead>
                    <tbody id="evSubjectRows">${rowsHTML}</tbody>
                    ${hasSubjects ? `
                    <tfoot>
                        <tr style="background:#f9fafb;border-top:2px solid #e5e7eb;">
                            <td colspan="3" style="padding:8px 10px;
                                font-weight:800;font-size:12.5px;">Total</td>
                            <td id="evTotalUnits" style="padding:8px 10px;text-align:center;
                                font-weight:900;font-size:14px;
                                color:#15803d;">${totalUnits}</td>
                        </tr>
                    </tfoot>` : ''}
                </table>
            </div>

            <!-- ── Individual Search & Add ── -->
            <div style="padding:14px 16px;border-top:1px solid #f0f0f0;
                background:#fafafa;position:relative;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;
                    letter-spacing:.07em;color:#9ca3af;margin-bottom:8px;">
                    🔍 Add Subject Individually
                </div>
                <div style="position:relative;">
                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14'
                        viewBox='0 0 24 24' fill='none' stroke='#9ca3af' stroke-width='2.5'
                        style="position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;">
                        <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
                    </svg>
                    <input id="evSearchInput"
                        type="text"
                        placeholder="Type subject code or title (e.g. CS 111 or Calculus)…"
                        oninput="evOnSearch(this.value)"
                        autocomplete="off"
                        style="width:100%;padding:9px 12px 9px 34px;
                            border:1.5px solid #e5e7eb;border-radius:8px;
                            font-size:13px;outline:none;font-family:inherit;
                            background:#fff;color:#1a1a1a;transition:border-color .15s;"
                        onfocus="this.style.borderColor='#c0192b';evOnSearch(this.value);"
                        onblur="setTimeout(evHideDropdown, 180);">
                </div>

                <!-- Search results dropdown -->
                <div id="evSearchDropdown" style="
                    display:none;position:absolute;left:16px;right:16px;top:100%;
                    background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;
                    box-shadow:0 8px 24px rgba(0,0,0,.10);z-index:999;
                    max-height:260px;overflow-y:auto;"></div>
            </div>

            <!-- ── Footer: status + save ── -->
            <div style="padding:11px 16px;display:flex;align-items:center;gap:10px;
                border-top:1px solid #f0f0f0;background:#fafafa;">
                <span id="evSaveStatus"
                    style="font-size:11.5px;color:#9ca3af;font-style:italic;flex:1;"></span>
                <button onclick="evClearAll()"
                    style="display:flex;align-items:center;gap:5px;padding:7px 14px;
                        border-radius:7px;background:#fff;color:#dc2626;
                        border:1.5px solid #fecaca;font-size:11.5px;font-weight:700;
                        cursor:pointer;transition:all .15s;"
                    onmouseover="this.style.background='#fef2f2'"
                    onmouseout="this.style.background='#fff'"
                    ${!hasSubjects ? 'disabled style="opacity:.4;cursor:not-allowed;"' : ''}>
                    Clear All
                </button>
                <button onclick="evSaveSubjects()"
                    style="display:flex;align-items:center;gap:6px;padding:8px 20px;
                        border-radius:7px;background:#15803d;color:#fff;border:none;
                        font-size:12.5px;font-weight:700;cursor:pointer;transition:background .15s;"
                    onmouseover="this.style.background='#166534'"
                    onmouseout="this.style.background='#15803d'">
                    <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13'
                        viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'>
                        <polyline points='20 6 9 17 4 12'/>
                    </svg>
                    Save Subjects
                </button>
            </div>
        </div>`;
    }

    /* ─── LOAD YEAR 1 PROSPECTUS ─────────────────────────────────── */
    window.evLoadProspectus = function() {
        const y1subs = getProspectusYear1Subjects();

        if (!y1subs.length) {
            alert('No Year 1 prospectus subjects found for this program. Make sure subject.js is loaded.');
            return;
        }

        const existing = _currentSubjects.length;
        if (existing > 0) {
            const ok = confirm(
                `The student already has ${existing} subject(s) assigned.\n\n` +
                `Loading the Year 1 prospectus will ADD any missing subjects ` +
                `(already-added ones will be skipped).\n\nProceed?`
            );
            if (!ok) return;
        }

        /* Add only subjects not yet in the list */
        const addedCodes = new Set(_currentSubjects.map(s => (s.code || '').trim().toLowerCase()));
        let added = 0;
        y1subs.forEach(sub => {
            if (!addedCodes.has((sub.code || '').trim().toLowerCase())) {
                _currentSubjects.push({
                    code:  sub.code  || '',
                    title: sub.title || sub.description || '',
                    units: sub.units || 0,
                    type:  sub.type  || '',
                });
                added++;
            }
        });

        evMarkDirty();
        renderSubjectPanel();

        /* Quick feedback */
        const statusEl = document.getElementById('evSaveStatus');
        if (statusEl) {
            statusEl.textContent = added > 0
                ? `✓ ${added} Year 1 subject(s) loaded. Review, then save.`
                : 'All Year 1 subjects are already added.';
            statusEl.style.color     = added > 0 ? '#d97706' : '#6b7280';
            statusEl.style.fontStyle = 'italic';
        }
    };

    /* ─── SEARCH DROPDOWN ────────────────────────────────────────── */
    window.evOnSearch = function(query) {
        const dd = document.getElementById('evSearchDropdown');
        if (!dd) return;

        const results = searchSubjects(query);

        if (!results.length) {
            dd.style.display = query.trim() ? 'block' : 'none';
            dd.innerHTML = query.trim()
                ? `<div style="padding:14px 16px;font-size:12.5px;color:#9ca3af;
                        font-style:italic;text-align:center;">
                        No matching subjects found. Try a different keyword.
                   </div>`
                : '';
            return;
        }

        dd.style.display = 'block';
        dd.innerHTML = results.map(sub => {
            const typeTag = sub.type
                ? `<span style="font-size:10px;padding:2px 7px;border-radius:10px;
                        background:#f3f4f6;color:#6b7280;font-weight:600;
                        text-transform:capitalize;">${esc(sub.type)}</span>`
                : '';
            const yearSem = (sub.usualYear && sub.usualSem)
                ? `<span style="font-size:10px;color:#9ca3af;">Year ${sub.usualYear}, ${sub.usualSem} Sem</span>`
                : '';
            const cat = sub.category === 'GE'
                ? `<span style="font-size:10px;padding:2px 6px;border-radius:8px;
                        background:#eff6ff;color:#1d4ed8;font-weight:700;">GE</span>`
                : '';

            return `
            <div onclick="evPickSubject(${JSON.stringify(JSON.stringify(sub))})"
                style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;
                    display:flex;align-items:flex-start;gap:10px;transition:background .1s;"
                onmouseover="this.style.background='#fef2f2'"
                onmouseout="this.style.background='#fff'">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="font-size:12.5px;font-weight:800;color:#374151;
                            white-space:nowrap;">${esc(sub.code)}</span>
                        ${typeTag} ${cat} ${yearSem}
                    </div>
                    <div style="font-size:12px;color:#6b7280;margin-top:2px;
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        ${esc(sub.title)}
                    </div>
                </div>
                <div style="font-size:13px;font-weight:800;color:#c0192b;
                    white-space:nowrap;padding-top:2px;">
                    ${sub.units} unit${sub.units !== 1 ? 's' : ''}
                </div>
            </div>`;
        }).join('');
    };

    window.evPickSubject = function(jsonStr) {
        let sub;
        try { sub = JSON.parse(jsonStr); } catch(e) { return; }

        _currentSubjects.push({
            code:  sub.code  || '',
            title: sub.title || sub.description || '',
            units: sub.units || 0,
            type:  sub.type  || '',
        });

        evMarkDirty();
        renderSubjectPanel();

        const inp = document.getElementById('evSearchInput');
        const dd  = document.getElementById('evSearchDropdown');
        if (inp) inp.value = '';
        if (dd)  dd.style.display = 'none';

        /* Scroll new row into view */
        const rows = document.querySelectorAll('#evSubjectRows tr');
        if (rows.length) rows[rows.length - 1].scrollIntoView({ behavior:'smooth', block:'nearest' });
    };

    window.evHideDropdown = function() {
        const dd = document.getElementById('evSearchDropdown');
        if (dd) dd.style.display = 'none';
    };

    /* ─── ROW REMOVE ─────────────────────────────────────────────── */
    window.evRemoveRow = function(idx) {
        _currentSubjects.splice(idx, 1);
        renderSubjectPanel();
        evMarkDirty();
    };

    /* ─── CLEAR ALL ──────────────────────────────────────────────── */
    window.evClearAll = function() {
        if (!_currentSubjects.length) return;
        if (!confirm('Remove ALL assigned subjects? This cannot be undone until you save.')) return;
        _currentSubjects = [];
        renderSubjectPanel();
        evMarkDirty();
    };

    /* ─── DIRTY FLAG ─────────────────────────────────────────────── */
    function evMarkDirty() {
        const el = document.getElementById('evSaveStatus');
        if (el) {
            el.textContent     = 'Unsaved changes…';
            el.style.color     = '#f59e0b';
            el.style.fontStyle = 'italic';
        }
    }

    /* ─── SAVE ───────────────────────────────────────────────────── */
    window.evSaveSubjects = function() {
        if (!_currentApp) return;
        if (!_currentSubjects.length) {
            alert('No subjects to save. Add at least one subject first.');
            return;
        }

        let apps = [];
        try { apps = JSON.parse(localStorage.getItem('wmsu_applications') || '[]'); } catch(e) {}
        const idx = apps.findIndex(a => a.appNo === _currentApp.appNo);
        if (idx === -1) { alert('Application record not found.'); return; }

        const totalUnits = _currentSubjects.reduce((t, s) => t + (Number(s.units) || 0), 0);
        apps[idx].enrolledSubjects = _currentSubjects;
        apps[idx].totalUnits       = totalUnits;
        localStorage.setItem('wmsu_applications', JSON.stringify(apps));

        _currentApp.enrolledSubjects = _currentSubjects;
        _currentSubjects = JSON.parse(JSON.stringify(_currentSubjects));

        const statusEl = document.getElementById('evSaveStatus');
        if (statusEl) {
            statusEl.textContent     = `✓ Saved! ${_currentSubjects.length} subjects · ${totalUnits} units`;
            statusEl.style.color     = '#15803d';
            statusEl.style.fontStyle = 'normal';
            statusEl.style.fontWeight= '700';
            setTimeout(() => {
                if (statusEl) {
                    statusEl.textContent      = '';
                    statusEl.style.fontWeight = '400';
                    statusEl.style.color      = '#9ca3af';
                    statusEl.style.fontStyle  = 'italic';
                }
            }, 3000);
        }

        renderSubjectPanel();
        if (typeof renderStudentList === 'function') renderStudentList();
    };

    /* ─── HTML BUILDER ───────────────────────────────────────────── */
    function esc(v) {
        return String(v ?? '—')
            .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function val(obj, ...keys) {
        for (const k of keys) {
            const v = obj?.[k];
            if (v !== undefined && v !== null && v !== '') return String(v);
        }
        return '—';
    }

    function field(label, value, fullWidth) {
        return `
        <div style="${fullWidth ? 'grid-column:1/-1;' : ''} display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:10.5px;font-weight:800;text-transform:uppercase;
                letter-spacing:.08em;color:#9ca3af;">${esc(label)}</span>
            <span style="font-size:13.5px;color:#1a1a1a;font-weight:500;
                padding:8px 12px;background:#fff;border:1.5px solid #e5e7eb;
                border-radius:7px;line-height:1.4;">${esc(value) === '—' ? '<em style="color:#ccc;">Not provided</em>' : esc(value)}</span>
        </div>`;
    }

    function section(icon, title, innerHTML) {
        return `
        <div style="margin-bottom:24px;background:#fff;border-radius:12px;
            border:1px solid #e5e7eb;overflow:hidden;
            box-shadow:0 1px 3px rgba(0,0,0,.04);">
            <div style="padding:14px 20px;background:linear-gradient(90deg,#fff5f5,#fff);
                border-bottom:1px solid #fde8e8;display:flex;align-items:center;gap:10px;">
                <span style="font-size:16px;">${icon}</span>
                <span style="font-size:12px;font-weight:800;text-transform:uppercase;
                    letter-spacing:.08em;color:#c0192b;">${esc(title)}</span>
            </div>
            <div style="padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;">
                ${innerHTML}
            </div>
        </div>`;
    }

    function buildFormHTML(s) {
        /* Photo + header */
        const photoBox = `
        <div style="margin-bottom:24px;display:flex;gap:20px;align-items:flex-start;
            background:#fff;border-radius:12px;border:1px solid #e5e7eb;
            padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);">
            <div style="width:110px;height:130px;flex-shrink:0;border-radius:8px;
                border:2px dashed #d1d5db;background:#f9fafb;
                display:flex;flex-direction:column;align-items:center;
                justify-content:center;gap:6px;overflow:hidden;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span style="font-size:10px;color:#d1d5db;font-weight:600;text-align:center;line-height:1.3;">
                    2×2 ID<br>Photo
                </span>
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.07em;color:#c0192b;margin-bottom:8px;">Enrollment Application</div>
                <div style="font-size:1.4rem;font-weight:800;color:#1a1a1a;line-height:1.2;margin-bottom:4px;">
                    ${esc(val(s,'name'))}
                </div>
                <div style="font-size:.82rem;color:#6b7280;margin-bottom:10px;">
                    App No.: <strong>${esc(val(s,'appNo'))}</strong>
                    &nbsp;·&nbsp;
                    Type: <strong style="text-transform:capitalize;">${esc(val(s,'applicantType','studentType'))}</strong>
                </div>
                <div style="display:inline-flex;align-items:center;gap:6px;
                    padding:4px 12px;border-radius:20px;background:#fef2f2;
                    border:1px solid #fecdd3;font-size:.75rem;font-weight:700;color:#c0192b;">
                    ${esc(val(s,'course','program'))}
                </div>
                <div style="margin-top:6px;font-size:.78rem;color:#9ca3af;">
                    ${esc(val(s,'department'))}
                </div>
                <div style="margin-top:12px;font-size:.75rem;color:#bbb;font-style:italic;">
                    ⚠ Actual ID photo is kept in the physical submission folder.
                </div>
            </div>
        </div>`;

        const step1 = section('🎓', 'Step 1 — Program / Course', `
            ${field('Selected Course',    val(s,'course','program'))}
            ${field('College / Department', val(s,'department','courseCollege'))}
            ${field('Course Description', val(s,'courseDescription'), true)}
        `);

        const addr = [s.street, s.barangay, s.city, s.province]
            .filter(x => x && x !== '').join(', ') || '—';

        const step2 = section('👤', 'Step 2 — Personal Information', `
            ${field('Last Name',     val(s,'surname','lastName'))}
            ${field('First Name',    val(s,'firstname','firstName'))}
            ${field('Middle Name',   val(s,'middleinitial','middleName'))}
            ${field('Suffix',        val(s,'suffix'))}
            ${field('Date of Birth', val(s,'dob','dateOfBirth'))}
            ${field('Place of Birth', val(s,'pob','placeOfBirth'))}
            ${field('Age',           val(s,'age'))}
            ${field('Sex',           val(s,'gender','sex'))}
            ${field('Civil Status',  val(s,'civil','civilStatus'))}
            ${field('Nationality',   val(s,'nationality'))}
            ${field('Religion',      val(s,'religion'))}
            ${field('CET ID',        val(s,'cetid','appNo'))}
            ${field('Full Address',  addr, true)}
        `);

        const step3 = section('👨‍👩‍👧', 'Step 3 — Family Background', `
            ${field("Father's Full Name",    val(s,'fatherName','father_name'))}
            ${field("Father's Occupation",   val(s,'fatherOccupation','father_occ'))}
            ${field("Mother's Full Name",     val(s,'motherName','mother_name'))}
            ${field("Mother's Occupation",    val(s,'motherOccupation','mother_occ'))}
            ${field("Guardian's Name",        val(s,'guardianName','guardian_name'))}
            ${field("Guardian's Contact No.", val(s,'guardianContact','guardian_contact'))}
        `);

        const step4 = section('📚', 'Step 4 — Academic Background', `
            ${field('Last School Attended', val(s,'school','lastSchool'))}
            ${field('School Address',       val(s,'schoolAddress','school_address'))}
            ${field('Year Graduated',       val(s,'gradYear','grad_year'))}
            ${field('GWA',                  val(s,'gwa'))}
            ${field('Track / Strand',       val(s,'strand'))}
            ${field('Student Type',         val(s,'studentType','applicantType'))}
        `);

        const isTransferee = ['Transferee','Shiftee'].includes(s.studentType || s.applicantType || '');
        let step4b = '';
        if (isTransferee) {
            step4b = section('🔄', 'Step 4b — Previous School Records', `
                ${field('Previous School',         val(s,'prevSchool'))}
                ${field('Previous Course/Program', val(s,'prevCourse'))}
                ${field('Year Level Reached',      val(s,'prevYearLevel'))}
                ${field('Last Semester',           val(s,'prevSem'))}
                ${field('School Year',             val(s,'prevSchoolYear'))}
                ${field('GWA (Previous School)',   val(s,'prevGwa'))}
                ${field('Total Units Earned',      val(s,'unitsEarned'))}
                ${field('Est. Units for Credit',   val(s,'unitsCredited'))}
                ${field('Reason for Transfer',     val(s,'transferReason'), true)}
                ${field('Failed Subjects (if any)',val(s,'failedSubjects'), true)}
            `);
        }

        const docRows = [
            ['2×2 ID Photo',         '📎 Submitted (physical)'],
            ['Birth Certificate',    val(s,'birthCert')   !== '—' ? '📎 Uploaded' : 'Not submitted'],
            ['Form 138/Report Card', val(s,'form138')     !== '—' ? '📎 Uploaded' : 'Not submitted'],
            ['Good Moral Cert.',     val(s,'goodMoral')   !== '—' ? '📎 Uploaded' : 'Not submitted'],
            ['CET Result',           val(s,'cetResult')   !== '—' ? '📎 Uploaded' : 'Not submitted'],
            ['Medical Certificate',  val(s,'medicalCert') !== '—' ? '📎 Uploaded' : 'Not submitted'],
        ].map(([lbl, v]) => field(lbl, v)).join('');

        const step5 = section('📄', 'Step 5 — Documents & Contact', `
            ${docRows}
            ${field('Email Address', val(s,'email'))}
            ${field('Phone Number',  val(s,'contact','phone'))}
        `);

        let cetSection = '';
        const cet = s.cet;
        if (cet && cet.oapr) {
            cetSection = section('📊', 'CET Scores', `
                ${field('OAPR (Overall Percentile)', cet.oapr + ' PR')}
                ${cet.ep  ? field('English Proficiency',    cet.ep + ' PR')  : ''}
                ${cet.rc  ? field('Reading Comprehension',  cet.rc + ' PR')  : ''}
                ${cet.sps ? field('Science Process Skills', cet.sps + ' PR') : ''}
                ${cet.qs  ? field('Quantitative Skills',    cet.qs + ' PR')  : ''}
                ${cet.ats ? field('Abstract Thinking',      cet.ats + ' PR') : ''}
            `);
        }

        /* Subject panel — rendered separately via renderSubjectPanel() */
        const subjSection = `<div id="evSubjectPanel" style="margin-bottom:24px;"></div>`;

        const submittedDate = s.submittedDate
            ? new Date(s.submittedDate).toLocaleDateString('en-PH',
                {weekday:'long', year:'numeric', month:'long', day:'numeric'})
            : '—';

        const footer = `
        <div style="text-align:center;padding:16px 0 4px;
            font-size:11.5px;color:#d1d5db;border-top:1px solid #f0f0f0;">
            Submitted on ${esc(submittedDate)} via WMSU-Ease Enrollment Portal
            &nbsp;·&nbsp; Adviser reference only.
        </div>`;

        return photoBox + step1 + step2 + step3 + step4 + step4b + step5 + cetSection + subjSection + footer;
    }

    /* ─── DOWNLOAD (Print-to-PDF) ────────────────────────────────── */
    window.downloadStudentForm = function() {
        const s = _currentApp;
        if (!s) return;

        const submittedDate = s.submittedDate
            ? new Date(s.submittedDate).toLocaleDateString('en-PH',
                {year:'numeric', month:'long', day:'numeric'})
            : '—';

        let subjTableHTML = '';
        if (s.enrolledSubjects && s.enrolledSubjects.length) {
            const totalUnits = s.enrolledSubjects.reduce((t,sub) => t + (Number(sub.units)||0), 0);
            subjTableHTML = `
            <div class="section">
                <div class="section-title">📋 Enrolled Subjects (Assigned by Adviser)</div>
                <table class="subj-table">
                    <thead>
                        <tr><th>Code</th><th>Subject</th><th>Units</th></tr>
                    </thead>
                    <tbody>
                        ${s.enrolledSubjects.map(sub => `
                        <tr>
                            <td style="font-weight:700;">${sub.code||'—'}</td>
                            <td>${sub.title||sub.description||'—'}</td>
                            <td style="text-align:center;">${sub.units}</td>
                        </tr>`).join('')}
                        <tr class="total-row">
                            <td colspan="2"><strong>Total</strong></td>
                            <td style="text-align:center;"><strong>${totalUnits}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        } else {
            subjTableHTML = `
            <div class="section">
                <div class="section-title">📋 Enrolled Subjects</div>
                <div style="padding:16px;font-size:12px;color:#bbb;text-align:center;font-style:italic;">
                    No subjects assigned yet.
                </div>
            </div>`;
        }

        const addr = [s.street, s.barangay, s.city, s.province]
            .filter(x => x && x !== '').join(', ') || '—';

        const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
        win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Enrollment Form — ${s.name || s.appNo}</title>
<style>
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Segoe UI',system-ui,sans-serif; font-size:12px; color:#111; background:#fff; padding:30px 40px; }
  .doc-header { display:flex; align-items:flex-start; gap:18px; border-bottom:3px solid #c0192b; padding-bottom:18px; margin-bottom:22px; }
  .doc-photo-placeholder { width:90px; height:108px; flex-shrink:0; border:2px dashed #d1d5db; border-radius:6px; background:#f9fafb; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; font-size:10px; color:#bbb; text-align:center; }
  .doc-header-info { flex:1; }
  .doc-header-info h1 { font-size:20px; font-weight:800; color:#1a1a1a; margin-bottom:4px; }
  .doc-header-info .meta { font-size:11px; color:#6b7280; margin-bottom:10px; }
  .doc-header-info .course-pill { display:inline-block; padding:3px 12px; border-radius:20px; background:#fef2f2; border:1px solid #fecdd3; font-size:11px; font-weight:700; color:#c0192b; margin-bottom:6px; }
  .header-logo { font-size:16px; font-weight:900; color:#c0192b; letter-spacing:-.02em; margin-bottom:2px; }
  .section { margin-bottom:18px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; }
  .section-title { background:linear-gradient(90deg,#fff5f5,#fff); border-bottom:1px solid #fde8e8; padding:8px 14px; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#c0192b; }
  .fields-grid { display:grid; grid-template-columns:1fr 1fr; }
  .field-item { padding:10px 14px; border-bottom:1px solid #f5f5f5; }
  .field-item.full { grid-column:1/-1; }
  .field-label { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#9ca3af; margin-bottom:3px; }
  .field-value { font-size:12.5px; font-weight:500; color:#1a1a1a; line-height:1.4; }
  .subj-table { width:100%; border-collapse:collapse; font-size:12px; }
  .subj-table th { padding:8px 12px; text-align:left; background:#f8fffe; border-bottom:1px solid #e5e7eb; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#6b7280; }
  .subj-table td { padding:8px 12px; border-bottom:1px solid #f5f5f5; }
  .total-row td { background:#f9fafb; border-top:2px solid #e5e7eb; font-weight:800; font-size:13px; color:#15803d; }
  .sig-block { display:flex; gap:30px; margin-top:30px; padding-top:18px; border-top:1px dashed #e5e7eb; }
  .sig-item { flex:1; text-align:center; }
  .sig-line { border-top:1.5px solid #1a1a1a; margin:38px 20px 4px; }
  .sig-label { font-size:9.5px; color:#6b7280; text-transform:uppercase; letter-spacing:.06em; }
  .doc-footer { text-align:center; font-size:9px; color:#d1d5db; margin-top:20px; padding-top:12px; border-top:1px solid #f5f5f5; }
  @media print { body { padding:20px 28px; } .no-print { display:none !important; } .section { break-inside:avoid; } }
</style>
</head>
<body>
<div class="no-print" style="text-align:right;margin-bottom:16px;">
  <button onclick="window.print()" style="padding:9px 20px;background:#c0192b;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-right:8px;">🖨 Print / Save as PDF</button>
  <button onclick="window.close()" style="padding:9px 20px;background:#f5f5f5;color:#555;border:1px solid #e0e0e0;border-radius:8px;font-size:13px;cursor:pointer;">Close</button>
</div>
<div class="doc-header">
  <div class="doc-photo-placeholder">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    2×2 ID Photo<br><em style="font-size:9px;">See physical folder</em>
  </div>
  <div class="doc-header-info">
    <div class="header-logo">WMSU-Ease</div>
    <h1>${s.name || s.appNo || '—'}</h1>
    <div class="meta">App No.: <strong>${s.appNo || '—'}</strong> &nbsp;·&nbsp; Type: <strong style="text-transform:capitalize">${s.applicantType || s.studentType || 'Freshman'}</strong> &nbsp;·&nbsp; Submitted: ${submittedDate}</div>
    <div class="course-pill">${s.course || 'Course not specified'}</div><br>
    <div style="font-size:11px;color:#9ca3af;">${s.department || 'WMSU'}</div>
    <div style="font-size:9px;color:#e5e7eb;margin-top:6px;font-style:italic;">For Adviser Reference Only — WMSU-Ease Enrollment Portal</div>
  </div>
</div>
<div class="section"><div class="section-title">🎓 Step 1 — Program / Course</div><div class="fields-grid"><div class="field-item"><div class="field-label">Selected Course</div><div class="field-value">${s.course||'—'}</div></div><div class="field-item"><div class="field-label">College / Department</div><div class="field-value">${s.department||s.courseCollege||'—'}</div></div><div class="field-item full"><div class="field-label">Course Description</div><div class="field-value">${s.courseDescription||'—'}</div></div></div></div>
<div class="section"><div class="section-title">👤 Step 2 — Personal Information</div><div class="fields-grid"><div class="field-item"><div class="field-label">Last Name</div><div class="field-value">${s.surname||s.lastName||'—'}</div></div><div class="field-item"><div class="field-label">First Name</div><div class="field-value">${s.firstname||s.firstName||'—'}</div></div><div class="field-item"><div class="field-label">Middle Name</div><div class="field-value">${s.middleinitial||s.middleName||'—'}</div></div><div class="field-item"><div class="field-label">Suffix</div><div class="field-value">${s.suffix||'—'}</div></div><div class="field-item"><div class="field-label">Date of Birth</div><div class="field-value">${s.dob||s.dateOfBirth||'—'}</div></div><div class="field-item"><div class="field-label">Place of Birth</div><div class="field-value">${s.pob||s.placeOfBirth||'—'}</div></div><div class="field-item"><div class="field-label">Age</div><div class="field-value">${s.age||'—'}</div></div><div class="field-item"><div class="field-label">Sex</div><div class="field-value">${s.gender||s.sex||'—'}</div></div><div class="field-item"><div class="field-label">Civil Status</div><div class="field-value">${s.civil||s.civilStatus||'—'}</div></div><div class="field-item"><div class="field-label">Nationality</div><div class="field-value">${s.nationality||'—'}</div></div><div class="field-item full"><div class="field-label">Full Address</div><div class="field-value">${addr}</div></div><div class="field-item"><div class="field-label">Email</div><div class="field-value">${s.email||'—'}</div></div><div class="field-item"><div class="field-label">Phone</div><div class="field-value">${s.contact||s.phone||'—'}</div></div></div></div>
<div class="section"><div class="section-title">👨‍👩‍👧 Step 3 — Family Background</div><div class="fields-grid"><div class="field-item"><div class="field-label">Father's Full Name</div><div class="field-value">${s.fatherName||s.father_name||'—'}</div></div><div class="field-item"><div class="field-label">Father's Occupation</div><div class="field-value">${s.fatherOccupation||s.father_occ||'—'}</div></div><div class="field-item"><div class="field-label">Mother's Full Name</div><div class="field-value">${s.motherName||s.mother_name||'—'}</div></div><div class="field-item"><div class="field-label">Mother's Occupation</div><div class="field-value">${s.motherOccupation||s.mother_occ||'—'}</div></div><div class="field-item"><div class="field-label">Guardian's Name</div><div class="field-value">${s.guardianName||s.guardian_name||'—'}</div></div><div class="field-item"><div class="field-label">Guardian's Contact No.</div><div class="field-value">${s.guardianContact||s.guardian_contact||'—'}</div></div></div></div>
<div class="section"><div class="section-title">📚 Step 4 — Academic Background</div><div class="fields-grid"><div class="field-item"><div class="field-label">Last School Attended</div><div class="field-value">${s.school||s.lastSchool||'—'}</div></div><div class="field-item"><div class="field-label">Year Graduated</div><div class="field-value">${s.gradYear||s.grad_year||'—'}</div></div><div class="field-item"><div class="field-label">GWA</div><div class="field-value">${s.gwa||'—'}</div></div><div class="field-item"><div class="field-label">Track / Strand</div><div class="field-value">${s.strand||'—'}</div></div></div></div>
${subjTableHTML}
<div class="sig-block"><div class="sig-item"><div class="sig-line"></div><div class="sig-label">Student's Signature over Printed Name</div></div><div class="sig-item"><div class="sig-line"></div><div class="sig-label">Adviser's Signature &amp; Date</div></div><div class="sig-item"><div class="sig-line"></div><div class="sig-label">Dean / Program Head</div></div></div>
<div class="doc-footer">Western Mindanao State University — Enrollment Application Form &nbsp;·&nbsp; App No.: ${s.appNo || '—'} &nbsp;·&nbsp; Generated via WMSU-Ease on ${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})} &nbsp;·&nbsp; FOR ADVISER REFERENCE ONLY</div>
</body></html>`);
        win.document.close();
    };

    /* ─── PATCH ADVISER VIEW BUTTONS ─────────────────────────────── */
    function patchAdviserViewButtons() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-view-form[data-appno]');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            if (typeof openEnrollmentViewer === 'function') {
                openEnrollmentViewer(btn.dataset.appno);
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchAdviserViewButtons);
    } else {
        patchAdviserViewButtons();
    }

})();