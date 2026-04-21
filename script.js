    (() => {
    'use strict';

    const SELECTORS = {
        nav: '#nav',
        mobileOverlay: '#mobileOverlay',
        hamburger: '.nav-hamburger',
        mobileOverlayLinks: '#mobileOverlay a[href^="#"]',
        revealItems: '[data-reveal]',
        filterButtons: '.mf-btn',
        reserveSectionForm: '#reserve form',
        reserveName: '#r_name',
        reservePhone: '#r_phone',
        reserveDate: '#r_date',
        reserveTime: '#r_time'
    };

    const state = {
        nav: null,
        mobileOverlay: null,
        hamburger: null,
        revealObserver: null
    };

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    function setMenuOpen(isOpen) {
        if (!state.mobileOverlay || !state.hamburger) return;

        state.mobileOverlay.classList.toggle('open', isOpen);
        state.hamburger.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function toggleMobile() {
        const isOpen = state.mobileOverlay?.classList.contains('open');
        setMenuOpen(!isOpen);
    }

    function closeMobile() {
        setMenuOpen(false);
    }

    function initNavScroll() {
        state.nav = qs(SELECTORS.nav);
        if (!state.nav) return;

        const onScroll = () => {
        state.nav.classList.toggle('solid', window.scrollY > 50);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initReveal() {
        const items = qsa(SELECTORS.revealItems);
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('in-view'));
        return;
        }

        state.revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        });
        }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
        });

        items.forEach((item) => state.revealObserver.observe(item));
    }

    function initMobileMenu() {
        state.mobileOverlay = qs(SELECTORS.mobileOverlay);
        state.hamburger = qs(SELECTORS.hamburger);

        if (!state.mobileOverlay || !state.hamburger) return;

        state.hamburger.addEventListener('click', toggleMobile);

        qsa(SELECTORS.mobileOverlayLinks).forEach((link) => {
        link.addEventListener('click', closeMobile);
        });

        const closeBtn = qs('.mobile-close');
        if (closeBtn) {
        closeBtn.addEventListener('click', closeMobile);
        }

        document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobile();
        }
        });

        window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobile();
        }
        });
    }

    function initSmoothScroll() {
        const anchors = qsa('a[href^="#"]');

        anchors.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = qs(href);
            if (!target) return;

            event.preventDefault();

            const nav = qs(SELECTORS.nav);
            const navOffset = nav ? nav.offsetHeight : 72;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - navOffset;

            window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
            });
        });
        });
    }

    function initMenuFilterTabs() {
        const buttons = qsa(SELECTORS.filterButtons);
        if (!buttons.length) return;

        buttons.forEach((button) => {
        button.addEventListener('click', () => {
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
        });
        });
    }

    function initDateMin() {
        const dateInput = qs(SELECTORS.reserveDate);
        if (!dateInput) return;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    function showToast(message, type = 'info') {
        const existing = qs('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
        toast.classList.add('show');
        });

        setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
        }, 3200);
    }

    function markFieldInvalid(input) {
        if (!input) return;
        input.classList.add('field-error');

        input.addEventListener('input', () => {
        input.classList.remove('field-error');
        }, { once: true });
    }

    function handleReserveSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const nameInput = qs(SELECTORS.reserveName, form) || qs(SELECTORS.reserveName);
        const phoneInput = qs(SELECTORS.reservePhone, form) || qs(SELECTORS.reservePhone);
        const dateInput = qs(SELECTORS.reserveDate, form) || qs(SELECTORS.reserveDate);
        const timeInput = qs(SELECTORS.reserveTime, form) || qs(SELECTORS.reserveTime);

        const name = nameInput?.value.trim() || '';
        const phone = phoneInput?.value.trim() || '';
        const date = dateInput?.value || '';
        const time = timeInput?.value || '';

        let hasError = false;

        if (!name) {
        markFieldInvalid(nameInput);
        hasError = true;
        }

        if (!phone) {
        markFieldInvalid(phoneInput);
        hasError = true;
        }

        if (!date) {
        markFieldInvalid(dateInput);
        hasError = true;
        }

        if (!time) {
        markFieldInvalid(timeInput);
        hasError = true;
        }

        if (hasError) {
        showToast('Please complete all required reservation fields.', 'error');
        return;
        }

        const message =
        `Hello Cantine Divino! I would like to make a reservation.\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Date: ${date}\n` +
        `Time: ${time}`;

        const whatsappUrl = `https://wa.me/256700805000?text=${encodeURIComponent(message)}`;

        showToast('Redirecting to WhatsApp...', 'success');
        window.open(whatsappUrl, '_blank', 'noopener');

        form.reset();
        initDateMin();
    }

    function initReservationForm() {
        const form = qs(SELECTORS.reserveSectionForm);
        if (!form) return;

        form.addEventListener('submit', handleReserveSubmit);
    }

    function exposeLegacyHooks() {
        // Keeps old inline onclick attributes working until you remove them
        window.toggleMobile = toggleMobile;
        window.closeMobile = closeMobile;
    }

    function init() {
        initNavScroll();
        initReveal();
        initMobileMenu();
        initSmoothScroll();
        initMenuFilterTabs();
        initDateMin();
        initReservationForm();
        exposeLegacyHooks();
    }

    document.addEventListener('DOMContentLoaded', init);
    })();