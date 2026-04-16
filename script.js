/* ===================================================
   CANTINE DIVINO — SCRIPT
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu on nav link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const animatedEls = document.querySelectorAll('[data-animate]');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(el => animObserver.observe(el));

    // ===== RESERVATION FORM =====
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name  = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const date  = document.getElementById('date').value;
            const time  = document.getElementById('time').value;

            if (!name || !phone || !email || !date || !time) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            const message = `Hello Cantine Divino! I would like to make a reservation.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nDate: ${date}\nTime: ${time}`;
            const url = `https://wa.me/256700805000?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');

            showToast('Redirecting to WhatsApp...', 'success');
            form.reset();
        });

        // Input focus effects
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--gold)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = 'rgba(0,0,0,0.12)';
            });
        });
    }

    // ===== TOAST NOTIFICATION =====
    function showToast(msg, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'var(--gold)' : '#dc2626'};
            color: ${type === 'success' ? '#0d0d0d' : '#fff'};
            padding: 1rem 1.5rem;
            font-family: var(--sans, sans-serif);
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 2px;
            z-index: 9999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            animation: fadeUp 0.35s ease both;
            max-width: 320px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // ===== RESIZE: ENSURE MENU VISIBLE ON DESKTOP =====
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        }
    });

    console.log('Cantine Divino — loaded.');
});
