var ACTIVE_SEM = 1;
var STATUS     = 'upcoming';

var SCHED = {
    1: {
        classStart : 'Jul 7, 2025',
        labelOld   : 'Jun 2 – 14, 2025',
        labelNew   : 'Jun 16 – 28, 2025',
        labelLate  : 'Jul 1 – 5, 2025'
    },
    2: {
        classStart : 'Dec 8, 2026',
        labelOld   : 'Nov 3 – 14, 2026',
        labelNew   : 'Nov 17 – 28, 2026',
        labelLate  : 'Dec 1 – 5, 2026'
    }
};

/* ── DO NOT EDIT BELOW THIS LINE ── */

(function init() {
    var sem      = ACTIVE_SEM;
    var s        = SCHED[sem];
    var semLabel = sem === 1 ? '1st' : '2nd';

    /* Hero badge */
    var badge = document.getElementById('semBadge');
    if (badge) badge.textContent = 'A.Y. 2025\u20132026 \u00b7 ' + semLabel + ' Semester';

    /* Hero date strip */
    var elOld  = document.getElementById('dateOld');
    var elNew  = document.getElementById('dateNew');
    var elLate = document.getElementById('dateLate');
    if (elOld)  elOld.textContent  = s.labelOld;
    if (elNew)  elNew.textContent  = s.labelNew;
    if (elLate) elLate.textContent = s.labelLate;

    /* Announcement bar */
    var bar = document.getElementById('announcementBar');
    var txt = document.getElementById('announcementText');
    if (bar && txt) {
        if (STATUS === 'open') {
            bar.className = 'lp-bar lp-bar--open';
            txt.innerHTML = '<strong>Enrollment is now OPEN</strong> \u2014 A.Y. 2025\u20132026, '
                + semLabel + ' Semester &nbsp;|&nbsp; Registrar: <strong>(062) 991-1040</strong>';
        } else if (STATUS === 'upcoming') {
            bar.className = 'lp-bar lp-bar--upcoming';
            txt.innerHTML = '<strong>' + semLabel + ' Semester enrollment</strong> opens soon \u2014 prepare your documents now.';
        } else {
            bar.className = 'lp-bar lp-bar--closed';
            txt.innerHTML = 'Enrollment is currently <strong>closed</strong>. Contact the Registrar\u2019s Office for the next schedule.';
            /* Disable enroll buttons */
            document.querySelectorAll('.lp-btn--primary, .lp-path-cta, .lp-btn-full, .lp-apply-opt').forEach(function(btn) {
                btn.style.opacity = '0.45';
                btn.style.pointerEvents = 'none';
                btn.style.cursor = 'not-allowed';
            });
        }
    }

    /* 2nd semester notice */
    var noticeEl  = document.getElementById('sem2Notice');
    var sem2Table = document.getElementById('sem2Table');
    if (noticeEl) {
        if (sem === 1) {
            noticeEl.style.display = 'flex';
            noticeEl.innerHTML =
                '<span>\uD83D\uDD12</span><div><strong>2nd Semester enrollment is not yet open</strong>'
                + '<p>The 2nd Semester portal opens after 1st Semester classes begin ('
                + SCHED[1].classStart + '). Shifting and transferring follow a separate schedule.</p></div>';
            if (sem2Table) sem2Table.style.opacity = '0.4';
        } else {
            noticeEl.style.display = 'none';
            if (sem2Table) sem2Table.style.opacity = '1';
        }
    }
})();

/* ── Semester toggle ── */
function switchSem(n) {
    document.getElementById('sem1Dates').classList.toggle('lp-hidden', n !== 1);
    document.getElementById('sem2Dates').classList.toggle('lp-hidden', n !== 2);
    document.getElementById('btn1st').classList.toggle('active', n === 1);
    document.getElementById('btn2nd').classList.toggle('active', n === 2);
}

/* ── FAQ accordion ── */
function toggleFaq(btn) {
    var item    = btn.closest('.lp-faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.lp-faq-item.open').forEach(function(i) { i.classList.remove('open'); });
    if (!wasOpen) item.classList.add('open');
}

/* ── Hamburger menu ── */
(function hamburger() {
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

    toggle.addEventListener('click', function() {
        if (menu.classList.contains('open')) closeMenu();
        else openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', closeMenu);
    });
})();

/* ── Announcement bar close ── */
(function barClose() {
    var closeBtn = document.getElementById('barClose');
    var bar      = document.getElementById('announcementBar');
    if (closeBtn && bar) {
        closeBtn.addEventListener('click', function() { bar.style.display = 'none'; });
    }
})();

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});