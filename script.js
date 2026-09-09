/* ============================================================
   BangkaGo — script.js
   All JavaScript functionality — No inline scripts in HTML
   ============================================================ */

'use strict';

/* ——————————————————————————————————————————————
   1. NAVBAR: Background change on scroll
—————————————————————————————————————————————— */
const mainNav = document.getElementById('mainNav');

function handleNavScroll() {
    if (window.scrollY > 60) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load


/* ——————————————————————————————————————————————
   2. NAVBAR: Active link highlighting on scroll
—————————————————————————————————————————————— */
const navLinks = document.querySelectorAll('#navMenu .nav-link');
const sections = document.querySelectorAll('section[id], div[id]');

function highlightNavLink() {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 90;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink, { passive: true });


/* ——————————————————————————————————————————————
   3. SMOOTH SCROLLING for all anchor links
—————————————————————————————————————————————— */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);

        if (targetEl) {
            e.preventDefault();

            const navHeight = mainNav.offsetHeight;
            const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({ top: targetPos, behavior: 'smooth' });

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
            if (bsCollapse && navMenu.classList.contains('show')) {
                bsCollapse.hide();
            }
        }
    });
});


/* ——————————————————————————————————————————————
   4. HERO SEARCH — Validation & feedback
—————————————————————————————————————————————— */
const heroSearchBtn = document.getElementById('heroSearchBtn');
const heroSearch = document.getElementById('heroSearch');
const searchFeedback = document.getElementById('searchFeedback');

function displaySearchFeedback(type, message) {
    searchFeedback.textContent = message;
    searchFeedback.className = 'search-feedback ' + type;
}

function handleHeroSearch() {
    const query = heroSearch.value.trim();

    if (query === '') {
        displaySearchFeedback('error', 'Please enter a service, destination, or location to search.');
        heroSearch.focus();
        return;
    }

    displaySearchFeedback(
        'success',
        'Searching for "' + query + '"… Connecting you to available services near you.'
    );
}

if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', handleHeroSearch);
}

if (heroSearch) {
    heroSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleHeroSearch();
        }
    });

    // Clear feedback when user starts typing
    heroSearch.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            searchFeedback.className = 'search-feedback';
        }
    });
}


/* ——————————————————————————————————————————————
   5. FORM UTILITIES — Shared helpers
—————————————————————————————————————————————— */

/**
 * Validate an email string format.
 * @param  {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Mark a field as invalid and show an error message.
 * @param {HTMLElement} field
 * @param {string}      errorElId
 * @param {string}      message
 */
function setInvalid(field, errorElId, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const errorEl = document.getElementById(errorElId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/**
 * Mark a field as valid.
 * @param {HTMLElement} field
 * @param {string}      errorElId
 */
function setValid(field, errorElId) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const errorEl = document.getElementById(errorElId);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

/**
 * Reset all fields in a form to their default state.
 * @param {HTMLFormElement} form
 */
function resetForm(form) {
    form.reset();
    form.querySelectorAll('.custom-input').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

/**
 * Show a success alert and hide it after a delay.
 * @param {string} elId  — ID of the success alert element
 * @param {number} delay — ms before hiding (default 8000)
 */
function showSuccess(elId, delay) {
    delay = delay || 8000;
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.remove('d-none');
    setTimeout(function () {
        el.classList.add('d-none');
    }, delay);
}


/* ——————————————————————————————————————————————
   6. JOIN US FORM — Validation
—————————————————————————————————————————————— */
const joinForm = document.getElementById('joinForm');

if (joinForm) {
    joinForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('joinName');
        const email = document.getElementById('joinEmail');
        const phone = document.getElementById('joinPhone');
        const role = document.getElementById('joinRole');
        const message = document.getElementById('joinMessage');

        let isValid = true;

        // Full Name
        if (name.value.trim().length < 2) {
            setInvalid(name, 'joinNameError', 'Please enter your full name (at least 2 characters).');
            isValid = false;
        } else {
            setValid(name, 'joinNameError');
        }

        // Email
        if (!isValidEmail(email.value.trim())) {
            setInvalid(email, 'joinEmailError', 'Please enter a valid email address (e.g. you@example.com).');
            isValid = false;
        } else {
            setValid(email, 'joinEmailError');
        }

        // Phone
        if (phone.value.trim().length < 7) {
            setInvalid(phone, 'joinPhoneError', 'Please enter a valid phone number.');
            isValid = false;
        } else {
            setValid(phone, 'joinPhoneError');
        }

        // Role
        if (role.value === '') {
            setInvalid(role, 'joinRoleError', 'Please select the role you are applying for.');
            isValid = false;
        } else {
            setValid(role, 'joinRoleError');
        }

        // Message
        if (message.value.trim().length < 10) {
            setInvalid(message, 'joinMessageError', 'Please tell us a bit about yourself (at least 10 characters).');
            isValid = false;
        } else {
            setValid(message, 'joinMessageError');
        }

        if (isValid) {
            showSuccess('joinSuccess');
            resetForm(joinForm);
        }
    });

    // Live validation on blur
    joinForm.querySelectorAll('.custom-input').forEach(function (field) {
        field.addEventListener('blur', function () {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
}


/* ——————————————————————————————————————————————
   7. CONTACT FORM — Validation
—————————————————————————————————————————————— */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const subject = document.getElementById('contactSubject');
        const message = document.getElementById('contactMessage');

        let isValid = true;

        // Name
        if (name.value.trim().length < 2) {
            setInvalid(name, 'contactNameError', 'Please enter your full name.');
            isValid = false;
        } else {
            setValid(name, 'contactNameError');
        }

        // Email
        if (!isValidEmail(email.value.trim())) {
            setInvalid(email, 'contactEmailError', 'Please enter a valid email address.');
            isValid = false;
        } else {
            setValid(email, 'contactEmailError');
        }

        // Subject
        if (subject.value.trim().length < 3) {
            setInvalid(subject, 'contactSubjectError', 'Please enter a subject for your message.');
            isValid = false;
        } else {
            setValid(subject, 'contactSubjectError');
        }

        // Message
        if (message.value.trim().length < 10) {
            setInvalid(message, 'contactMessageError', 'Your message is too short. Please provide more details.');
            isValid = false;
        } else {
            setValid(message, 'contactMessageError');
        }

        if (isValid) {
            showSuccess('contactSuccess');
            resetForm(contactForm);
        }
    });

    // Live validation on blur
    contactForm.querySelectorAll('.custom-input').forEach(function (field) {
        field.addEventListener('blur', function () {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
}


/* ——————————————————————————————————————————————
   8. SCROLL FADE-IN ANIMATION (Intersection Observer)
—————————————————————————————————————————————— */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // animate once
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

fadeEls.forEach(function (el, index) {
    // Stagger delay based on sibling position
    el.style.transitionDelay = (index % 4) * 0.1 + 's';
    fadeObserver.observe(el);
});


/* ——————————————————————————————————————————————
   9. BACK TO TOP button
—————————————————————————————————————————————— */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ——————————————————————————————————————————————
   10. DYNAMIC YEAR in footer copyright (optional)
—————————————————————————————————————————————— */
// Automatically keep copyright year current
const copyrightEl = document.querySelector('.footer-bottom p');
if (copyrightEl) {
    const year = new Date().getFullYear();
    copyrightEl.innerHTML = copyrightEl.innerHTML.replace('2025', year);
}