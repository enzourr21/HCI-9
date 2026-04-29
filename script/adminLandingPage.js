/* Admin landing page script */

(function initAdminLandingPage() {
    var stats = {
        enrolled: '1,842',
        pending: '247',
        daysLeft: '7'
    };

    var statEnrolled = document.getElementById('statEnrolled');
    var statPending  = document.getElementById('statPending');
    var statDays     = document.getElementById('statDays');
    var loginCta     = document.getElementById('loginCta');
    var savedRole    = null;

    if (statEnrolled) statEnrolled.textContent = stats.enrolled;
    if (statPending)  statPending.textContent  = stats.pending;
    if (statDays)     statDays.textContent     = stats.daysLeft;

    try {
        savedRole = window.localStorage ? window.localStorage.getItem('adminLandingSelectedRole') : null;
    } catch (error) {
        savedRole = null;
    }

    if (savedRole) {
        setSelectedRole(savedRole);
    }

    if (loginCta) {
        loginCta.addEventListener('click', function (event) {
            var selected = loginCta.dataset.role;
            if (!selected) {
                event.preventDefault();
                window.alert('Please select your administrative role before proceeding.');
            }
        });
    }
})();

/* Role selection */
function selectRole(button) {
    if (!button) return;

    var role   = button.getAttribute('data-role');
    var label  = button.querySelector('.adm-role-btn-text strong');
    var roleName = label ? label.textContent.trim() : role;

    document.querySelectorAll('.adm-role-btn.selected').forEach(function (node) {
        node.classList.remove('selected');
    });

    button.classList.add('selected');
    setSelectedRole(role, roleName);
}

function setSelectedRole(role, label) {
    if (!role) return;

    var loginCta = document.getElementById('loginCta');
    if (loginCta) {
        loginCta.dataset.role = role;
        loginCta.href = 'login-pages/adminLogin.html?role=' + encodeURIComponent(role);
        loginCta.textContent = 'Continue as ' + (label || role) + ' →';
    }

    try {
        if (window.localStorage) {
            window.localStorage.setItem('adminLandingSelectedRole', role);
        }
    } catch (error) {
        // ignore storage failures
    }
}

/* Hamburger menu */
(function adminHamburger() {
    var toggle  = document.getElementById('navToggle');
    var menu    = document.getElementById('navMenu');
    var overlay = document.getElementById('navOverlay');

    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();

/* Announcement bar close */
(function adminBarClose() {
    var closeBtn = document.getElementById('barClose');
    var bar      = document.getElementById('announcementBar');

    if (closeBtn && bar) {
        closeBtn.addEventListener('click', function () {
            bar.style.display = 'none';
        });
    }
})();

/* Smooth scroll for internal anchor links */
(function adminSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
