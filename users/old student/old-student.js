const student = {
    firstName:  'Juan',
    lastName:   'Dela Cruz',
    middleName: 'Santos',
    id:         '2025-001234',
    year:       '1st Year',
    college:    'College of Computing Studies',
    collegeAbbr:'CCS',
    gender:     'Male',
    dob:        '2005-01-15',
    contact:    '09123456789',
    email:      'ty2025001234@wmsu.edu.ph'
};

function getInitials(firstName, lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
}

function populateChip() {
    document.getElementById('chipAvatar').textContent = getInitials(student.firstName, student.lastName);
    document.getElementById('chipName').textContent   = `${student.firstName} ${student.lastName}`;
    document.getElementById('chipMeta').textContent   = `${student.year} • ${student.collegeAbbr}`;
}

function populateHeader() {
    document.getElementById('profileAvatar').textContent = getInitials(student.firstName, student.lastName);
    document.getElementById('profileName').textContent   = `${student.firstName} ${student.lastName}`;
    document.getElementById('profileSub').innerHTML = `${student.id} &bull; ${student.year} &bull; ${student.college}`;
}

function populateViewFields() {
    const dob = new Date(`${student.dob}T00:00:00`);
    const formatted = dob.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    document.getElementById('viewLastName').textContent   = student.lastName;
    document.getElementById('viewFirstName').textContent  = student.firstName;
    document.getElementById('viewMiddleName').textContent = student.middleName;
    document.getElementById('viewDOB').textContent        = formatted;
    document.getElementById('viewGender').textContent     = student.gender;
    document.getElementById('viewContact').textContent    = student.contact;
    document.getElementById('viewEmail').textContent      = student.email;
}

function populateEditFields() {
    document.getElementById('editLastName').value   = student.lastName;
    document.getElementById('editFirstName').value  = student.firstName;
    document.getElementById('editMiddleName').value = student.middleName;
    document.getElementById('editDOB').value        = student.dob;
    document.getElementById('editGender').value     = student.gender;
    document.getElementById('editContact').value    = student.contact;
    document.getElementById('editEmail').value      = student.email;
}

function saveChanges() {
    student.lastName   = document.getElementById('editLastName').value.trim()   || student.lastName;
    student.firstName  = document.getElementById('editFirstName').value.trim()  || student.firstName;
    student.middleName = document.getElementById('editMiddleName').value.trim();
    student.dob        = document.getElementById('editDOB').value               || student.dob;
    student.gender     = document.getElementById('editGender').value;
    student.contact    = document.getElementById('editContact').value.trim()    || student.contact;
    student.email      = document.getElementById('editEmail').value.trim()      || student.email;

    populateChip();
    populateHeader();
    populateViewFields();
    populateEditFields();
    document.getElementById('edit-toggle').checked = false;
}

function updateActiveLink(page) {
    document.querySelectorAll('.sidebar-links a[data-page]').forEach(link => {
        const isActive = link.dataset.page === page;
        link.classList.toggle('active', isActive);
    });
}

function showPage(page) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.style.display = section.dataset.page === page ? 'block' : 'none';
    });
    updateActiveLink(page);
}

function getPageFromHash() {
    const hash = window.location.hash.replace('#', '');
    return hash || 'profile';
}

function handleHashChange() {
    const page = getPageFromHash();
    const validPages = ['profile', 'subjects', 'schedule', 'payment'];
    showPage(validPages.includes(page) ? page : 'profile');
}

function updateScheduleVisibility() {
    const scheduleContent = document.getElementById('schedule-content');
    const enlistmentBadge = document.querySelector('.progress-step:last-child .badge');
    if (scheduleContent) {
        scheduleContent.style.display = enlistmentBadge && enlistmentBadge.textContent.trim() === 'Completed' ? 'block' : 'none';
    }
}

function initNavigation() {
    document.querySelectorAll('.sidebar-links a[data-page]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const page = link.dataset.page;
            window.location.hash = page;
        });
    });
}

function initLogout() {
    document.getElementById('logoutLink').addEventListener('click', function (event) {
        if (!confirm('Are you sure you want to log out?')) {
            event.preventDefault();
        }
    });
}

function initPage() {
    populateChip();
    populateHeader();
    populateViewFields();
    populateEditFields();
    initNavigation();
    initLogout();
    document.getElementById('btnSave').addEventListener('click', saveChanges);
    handleHashChange();
    updateScheduleVisibility();
}

window.addEventListener('hashchange', handleHashChange);
document.addEventListener('DOMContentLoaded', initPage);
