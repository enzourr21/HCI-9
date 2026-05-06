
// ─────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────
function escHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;");
}

function getInitials(name) {
    return (name || '??').split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className   = "correction-toast";
    toast.textContent = message;
    
    // Simpleng style para sa toast kung sakaling wala sa CSS
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = type === "success" ? "#1a7a42" : "#8b1a24";
    toast.style.color = "#fff";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.transition = "opacity 0.3s, transform 0.3s";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";

    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ─────────────────────────────────────────────────────────────
// LOCALSTORAGE & STUDENT_DB INTEGRATION
// ─────────────────────────────────────────────────────────────

// Kinukuha ang data sa STUDENT_DB at inililipat sa LocalStorage 
// para ma-save ang mga "enrolledSubjects" at "adviserStatus".
function initializeStudents() {
    let localDB = JSON.parse(localStorage.getItem('wmsu_student_db') || 'null');
    
    // Kung wala pa sa local storage pero may STUDENT_DB na nakalink
    if (!localDB && typeof STUDENT_DB !== 'undefined') {
        localDB = STUDENT_DB.map(s => ({
            studentId: s.studentId,
            name: `${s.firstName} ${s.middleInitial ? s.middleInitial + '.' : ''} ${s.lastName}`,
            program: s.program,
            programFull: s.programFull,
            yearLevel: s.yearLevel,
            section: s.section,
            email: s.email,
            // Magdadagdag tayo ng fields para sa F2F advising simulation
            enrolledSubjects: [], 
            adviserStatus: 'pending', // pending | submitted | for_correction
        }));
        localStorage.setItem('wmsu_student_db', JSON.stringify(localDB));
    }
    return localDB || [];
}

function getStudents() {
    return JSON.parse(localStorage.getItem('wmsu_student_db') || '[]');
}

function saveStudents(arr) {
    localStorage.setItem('wmsu_student_db', JSON.stringify(arr));
}

// ─────────────────────────────────────────────────────────────
// ADVISER CONFIG (Halimbawa: Adviser para sa CS)
// ─────────────────────────────────────────────────────────────
const ADVISER_PROGRAM = 'CS'; // Pwedeng baguhin to 'IT' depende sa department ng adviser

function getMyStudents() {
    return getStudents().filter(s => s.program === ADVISER_PROGRAM && s.adviserStatus !== 'submitted');
}

function getSubmittedStudents() {
    return getStudents().filter(s => s.program === ADVISER_PROGRAM && s.adviserStatus === 'submitted');
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD LOGIC
// ─────────────────────────────────────────────────────────────
const sectionFilter = document.getElementById("sectionFilter");

    // Awtomatikong kukunin ang lahat ng unique sections mula sa mga estudyante mo
    if (sectionFilter) {
        const myStudents = getMyStudents();
        // Gumawa ng array na puro unique section names lang
        const uniqueSections = [...new Set(myStudents.map(s => s.section).filter(Boolean))];
        
        // I-add ang bawat section bilang option sa dropdown
        uniqueSections.sort().forEach(sec => {
            const opt = document.createElement("option");
            opt.value = sec;
            opt.textContent = sec;
            sectionFilter.appendChild(opt);
        });

        // Mag-add ng event listener kapag nagbago ang section na pinili
        sectionFilter.addEventListener('change', () => {
            renderStudentList();
        });
    }

function initAdviserDashboard() {
    if (!document.getElementById("student-list")) return;

    // Load DB
    initializeStudents();

    let activeFilter  = 'all';
    let searchQuery   = '';
    let proceedTarget = null;
    let currentViewStudent = null;

    // ── UI ELEMENTS ──
    const container  = document.getElementById("student-list");
    const emptyState = document.getElementById("dashEmptyState");
    const searchInput = document.getElementById("searchStudent");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // ── RENDER STUDENT CARDS ──
    function renderStudentList() {
        let students = getMyStudents();

        // 1. Search Function
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            students = students.filter(s => 
                s.name.toLowerCase().includes(q) || 
                s.studentId.toLowerCase().includes(q)
            );
        }

        // 2. Filter Tabs Function
        if (activeFilter === 'form_submitted') {
            // "With Subjects"
            students = students.filter(s => s.enrolledSubjects && s.enrolledSubjects.length > 0);
        } else if (activeFilter === 'awaiting_form') {
            // "No Subjects"
            students = students.filter(s => !s.enrolledSubjects || s.enrolledSubjects.length === 0);
        }

        // 3. Section Filter Function
        if (sectionFilter) {
            const selectedSection = sectionFilter.value;
            if (selectedSection !== 'all') {
                students = students.filter(s => s.section === selectedSection);
            }
        }

        updateQuickStats();

        // Empty state check
        if (students.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        // Render
        container.innerHTML = students.map(s => buildStudentCard(s)).join('');

        // Attach events to the newly generated buttons
        attachCardEvents();
    }

    function buildStudentCard(s) {
        const initials    = getInitials(s.name);
        const hasSubjects = s.enrolledSubjects && s.enrolledSubjects.length > 0;
        const totalUnits  = hasSubjects ? s.enrolledSubjects.reduce((sum, sub) => sum + (Number(sub.units) || 0), 0) : 0;
        const statusLabel = hasSubjects ? 'Subjects Assigned' : 'Awaiting Assignment';

        // Gagawa ng listahan ng subjects kung meron
        const previewRows = hasSubjects 
            ? s.enrolledSubjects.slice(0, 3).map(sub => `
                <tr>
                    <td style="padding:5px 10px;font-weight:600;font-size:12px;white-space:nowrap;">${escHtml(sub.code)}</td>
                    <td style="padding:5px 10px;font-size:12px;">${escHtml(sub.title || '')}</td>
                    <td style="padding:5px 10px;font-size:12px;text-align:center;">${sub.units}</td>
                </tr>`).join('') + (s.enrolledSubjects.length > 3 ? `<tr><td colspan="3" style="padding:5px 10px;font-size:11px;color:#999;text-align:center;">+${s.enrolledSubjects.length - 3} more subject(s)</td></tr>` : '')
            : `<tr><td colspan="3" style="padding:16px;text-align:center;color:#bbb;font-size:12px;">No subjects assigned yet.<br><span style="font-size:11px;">Use 'View Subjects' to assign manually.</span></td></tr>`;

        return `
            <div class="student-card" data-id="${escHtml(s.studentId)}" style="background:#fff; border:1px solid #e6e6e6; border-radius:12px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06); display:flex; flex-direction:column; gap:14px;">
                <div class="sc-header" style="display:flex; align-items:center; gap:12px;">
                    <div class="sc-avatar" style="width:40px; height:40px; background:#8b1a24; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">${initials}</div>
                    <div class="sc-info">
                        <div class="sc-name" style="font-weight:700; font-size:14px; color:#111;">${escHtml(s.name)}</div>
                        <div class="sc-appno" style="font-size:12px; color:#666;">${escHtml(s.studentId)} • ${escHtml(s.section)}</div>
                    </div>
                </div>
                
                <div class="sc-status-bar" style="background:${hasSubjects ? '#eaf7f0' : '#fef8ec'}; color:${hasSubjects ? '#166035' : '#b06d09'}; border:1px solid ${hasSubjects ? 'rgba(26,122,66,0.2)' : 'rgba(176,109,9,0.2)'}; padding:6px 10px; border-radius:6px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;">
                    <i class="fa-solid ${hasSubjects ? 'fa-check-circle' : 'fa-clock'}"></i>
                    ${statusLabel}
                </div>

                <table class="sc-table" style="width:100%; border-collapse:collapse; background:#f9f9f9; border-radius:8px; overflow:hidden;">
                    <thead style="background:#eeeeec; border-bottom:1px solid #e6e6e6;">
                        <tr><th style="text-align:left; padding:8px 10px; font-size:11px; color:#555;">Code</th><th style="text-align:left; padding:8px 10px; font-size:11px; color:#555;">Subject</th><th style="text-align:center; padding:8px 10px; font-size:11px; color:#555;">Units</th></tr>
                    </thead>
                    <tbody>${previewRows}</tbody>
                </table>

                <div class="sc-footer" style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e6e6e6; padding-top:12px;">
                    <span class="sc-units" style="font-size:12px; font-weight:700; color:#8b1a24;">${totalUnits} Total Units</span>
                    <div class="sc-actions" style="display:flex; gap:8px;">
                        <button class="btn-view-form btn-outline" data-id="${escHtml(s.studentId)}" style="padding:6px 12px; border-radius:6px; border:1px solid #8b1a24; background:transparent; color:#8b1a24; font-size:12px; font-weight:600; cursor:pointer;">View Subjects</button>
                        <button class="btn-proceed-student btn-primary" data-id="${escHtml(s.studentId)}" ${!hasSubjects ? 'disabled' : ''} style="padding:6px 12px; border-radius:6px; border:none; background:#8b1a24; color:#fff; font-size:12px; font-weight:600; cursor:${!hasSubjects ? 'not-allowed' : 'pointer'}; opacity:${!hasSubjects ? '0.5' : '1'};">Submit</button>
                    </div>
                </div>
            </div>`;
    }

    // ── EVENT LISTENERS (Buttons on Cards) ──
    function attachCardEvents() {
        container.querySelectorAll('.btn-view-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const s = getStudents().find(a => a.studentId === btn.dataset.id);
                if (s) openSubjectModal(s);
            });
        });

        container.querySelectorAll('.btn-proceed-student').forEach(btn => {
            btn.addEventListener('click', () => {
                proceedTarget = btn.dataset.id;
                const s = getStudents().find(a => a.studentId === proceedTarget);
                if (!s) return;
                
                // Show proceed modal if it exists, otherwise use fallback confirm dialog
                const modal = document.getElementById('proceedModal');
                if(modal) {
                    document.getElementById('proceedStudentName').textContent = s.name || s.studentId;
                    modal.classList.add('active');
                } else {
                    if(confirm(`Submit student ${s.name} to Assessment Office?`)) confirmProceed();
                }
            });
        });
    }

    // Search bar event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderStudentList();
        });
    }

    // Filter Buttons Event
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            activeFilter = btn.dataset.filter || 'all';
            renderStudentList();
        });
    });

    // ── PROCEED TO ASSESSMENT MODAL LOGIC ──
    document.getElementById('cancelProceedBtn')?.addEventListener('click', () => {
        document.getElementById('proceedModal')?.classList.remove('active');
        proceedTarget = null;
    });

    document.getElementById('confirmProceedBtn')?.addEventListener('click', confirmProceed);

    function confirmProceed() {
        if (!proceedTarget) return;
        let allStudents = getStudents();
        const index = allStudents.findIndex(s => s.studentId === proceedTarget);
        
        if (index > -1) {
            allStudents[index].adviserStatus = 'submitted';
            saveStudents(allStudents);
            showToast(`✓ ${allStudents[index].name} has been forwarded to Assessment.`, 'success');
        }
        
        document.getElementById('proceedModal')?.classList.remove('active');
        proceedTarget = null;
        renderStudentList();
    }

    function updateQuickStats() {
        const total = getStudents().filter(s => s.program === ADVISER_PROGRAM).length;
        const pending = getMyStudents().length;
        const submitted = getSubmittedStudents().length;
        
        // Updates DOM quick stats
        const stats = document.querySelectorAll('.stat-item strong');
        if(stats.length >= 3) {
            stats[0].textContent = total;
            stats[1].textContent = pending;
            stats[2].textContent = submitted;
        }
    }

    // ── VIEW/ADD SUBJECTS MODAL (F2F Enlistment Emulation) ──
    function openSubjectModal(student) {
        currentViewStudent = student;
        const modal = document.getElementById('formViewModal');
        if(!modal) return;

        // Populate Modal Headers
        document.getElementById('fvAppNo').textContent = student.studentId;
        document.getElementById('fvName').textContent = student.name;
        document.getElementById('fvCourse').textContent = student.programFull;

        renderModalSubjects();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Pigilan ang pag-scroll sa likod
    }

    function renderModalSubjects() {
        const tbody = document.getElementById('fvSubjectsTbody');
        if(!tbody) return;

        const subjects = currentViewStudent.enrolledSubjects || [];
        const totalUnits = subjects.reduce((sum, s) => sum + (Number(s.units) || 0), 0);
        
        const fvTotalUnits = document.getElementById('fvTotalUnits');
        if(fvTotalUnits) fvTotalUnits.textContent = totalUnits;

        if (subjects.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#888;">No subjects enlisted yet. Click 'Add Subject'.</td></tr>`;
            return;
        }

        tbody.innerHTML = subjects.map((sub, idx) => `
            <tr style="border-bottom:1px solid #e6e6e6;">
                <td style="padding:10px; font-weight:600; color:#8b1a24;">${escHtml(sub.code)}</td>
                <td style="padding:10px;">${escHtml(sub.title)}</td>
                <td style="padding:10px; text-align:center;">${sub.units}</td>
                <td style="padding:10px; text-align:center;">
                    <button style="border:none; background:#fdf2f3; color:#8b1a24; padding:6px 10px; border-radius:6px; cursor:pointer;" onclick="removeSubject(${idx})" title="Remove Subject">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Global function para ma-trigger galing sa HTML onClick attribute
    window.removeSubject = function(index) {
        if(!currentViewStudent) return;
        currentViewStudent.enrolledSubjects.splice(index, 1);
        updateStudentInDB();
        renderModalSubjects();
        showToast("Subject removed.");
    };

    // Quick Add Subject Button sa loob ng Modal
    document.getElementById('btnAddSubject')?.addEventListener('click', () => {
        const code = prompt("Enter Subject Code (e.g., CS 101):");
        if(!code) return;
        const title = prompt("Enter Subject Description (e.g., Intro to Computing):");
        const units = parseInt(prompt("Enter Units:")) || 3;
        
        if(!currentViewStudent.enrolledSubjects) currentViewStudent.enrolledSubjects = [];
        
        currentViewStudent.enrolledSubjects.push({ code, title: title||'', units: units });
        updateStudentInDB();
        renderModalSubjects();
        showToast(`Subject ${code} added successfully.`);
    });

    function updateStudentInDB() {
        let allStudents = getStudents();
        const idx = allStudents.findIndex(s => s.studentId === currentViewStudent.studentId);
        if(idx > -1) {
            allStudents[idx] = currentViewStudent;
            saveStudents(allStudents); // Save back to local storage
        }
    }

    // Modal Close logic
    document.getElementById('closeFvModal')?.addEventListener('click', () => {
        document.getElementById('formViewModal')?.classList.remove('active');
        document.body.style.overflow = ''; // Ibalik ang pag-scroll sa background
        renderStudentList(); // I-refresh ang main UI pag-close ng modal
    });

    // ── INITIAL LOAD ──
    renderStudentList();
}

// =============================================================
// BOOTSTRAP - Ina-activate ang logic kapag nag-load na ang page
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
    initAdviserDashboard();
});