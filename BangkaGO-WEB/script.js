/* ============================================================
   BangkaGo — script.js
   Smoother, throttled, reduced-motion aware
   ============================================================ */

'use strict';

/* Utility: rAF throttle */
function rafThrottle(fn){
  let ticking = false;
  return function(){
    const args = arguments;
    if(!ticking){
      requestAnimationFrame(function(){
        fn.apply(null, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ——————————————————————————————————————————————
   1 & 2. NAVBAR: scroll + active link (throttled)
—————————————————————————————————————————————— */
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('#navMenu .nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
    if (!mainNav) return;
    if (window.scrollY > 60) mainNav.classList.add('scrolled');
    else mainNav.classList.remove('scrolled');
}
function highlightNavLink() {
    if (!navLinks.length || !sections.length) return;
    let currentSection = '';
    const offset = 100;
    sections.forEach(function(section){
        const top = section.offsetTop - offset;
        if (window.scrollY >= top) currentSection = section.getAttribute('id');
    });
    navLinks.forEach(function(link){
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
}
const throttledNav = rafThrottle(function(){
  handleNavScroll();
  highlightNavLink();
});
window.addEventListener('scroll', throttledNav, { passive: true });
handleNavScroll();
highlightNavLink();

/* ——————————————————————————————————————————————
   3. SMOOTH SCROLLING for anchor links
—————————————————————————————————————————————— */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const navHeight = mainNav ? mainNav.offsetHeight : 0;
            const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 8;
            window.scrollTo({ top: targetPos, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            const navMenu = document.getElementById('navMenu');
            if (navMenu && window.bootstrap && bootstrap.Collapse){
              const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
              if (bsCollapse && navMenu.classList.contains('show')) bsCollapse.hide();
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
    if(!searchFeedback) return;
    searchFeedback.textContent = message;
    searchFeedback.className = 'search-feedback ' + type;
}
function handleHeroSearch() {
    if(!heroSearch || !searchFeedback) return;
    const query = heroSearch.value.trim();
    if (query === '') {
        displaySearchFeedback('error', 'Please enter a service, destination, or location to search.');
        heroSearch.focus();
        return;
    }
    displaySearchFeedback('success', 'Searching for "' + query + '"… Connecting you to available services near you.');
}
if (heroSearchBtn) heroSearchBtn.addEventListener('click', handleHeroSearch);
if (heroSearch) {
    heroSearch.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); handleHeroSearch(); }
    });
    heroSearch.addEventListener('input', function () {
        if (this.value.trim() !== '' && searchFeedback) searchFeedback.className = 'search-feedback';
    });
}

/* ——————————————————————————————————————————————
   5. FORM UTILITIES — Shared helpers
—————————————————————————————————————————————— */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function setInvalid(field, errorElId, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const errorEl = document.getElementById(errorElId);
    if (errorEl) { errorEl.textContent = message; errorEl.style.display = 'block'; }
}
function setValid(field, errorElId) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const errorEl = document.getElementById(errorElId);
    if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
}
function resetForm(form) {
    form.reset();
    form.querySelectorAll('.custom-input').forEach(function(el){
        el.classList.remove('is-invalid', 'is-valid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(function(el){
        el.textContent = ''; el.style.display = 'none';
    });
}
function showSuccess(elId, delay) {
    delay = delay || 8000;
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.remove('d-none');
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    setTimeout(function () { el.classList.add('d-none'); }, delay);
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
        if (name.value.trim().length < 2) { setInvalid(name, 'joinNameError', 'Please enter your full name (at least 2 characters).'); isValid = false; } else { setValid(name, 'joinNameError'); }
        if (!isValidEmail(email.value.trim())) { setInvalid(email, 'joinEmailError', 'Please enter a valid email address (e.g. you@example.com).'); isValid = false; } else { setValid(email, 'joinEmailError'); }
        if (phone.value.trim().length < 7) { setInvalid(phone, 'joinPhoneError', 'Please enter a valid phone number.'); isValid = false; } else { setValid(phone, 'joinPhoneError'); }
        if (role.value === '') { setInvalid(role, 'joinRoleError', 'Please select the role you are applying for.'); isValid = false; } else { setValid(role, 'joinRoleError'); }
        if (message.value.trim().length < 10) { setInvalid(message, 'joinMessageError', 'Please tell us a bit about yourself (at least 10 characters).'); isValid = false; } else { setValid(message, 'joinMessageError'); }
        if (isValid) { showSuccess('joinSuccess'); resetForm(joinForm); }
    });
    joinForm.querySelectorAll('.custom-input').forEach(function (field) {
        field.addEventListener('blur', function () {
            if (this.value.trim() !== '') { this.classList.remove('is-invalid'); this.classList.add('is-valid'); }
        });
        field.addEventListener('input', function(){ if(this.classList.contains('is-invalid') && this.value.trim().length>1) this.classList.remove('is-invalid'); });
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
        if (name.value.trim().length < 2) { setInvalid(name, 'contactNameError', 'Please enter your full name.'); isValid = false; } else { setValid(name, 'contactNameError'); }
        if (!isValidEmail(email.value.trim())) { setInvalid(email, 'contactEmailError', 'Please enter a valid email address.'); isValid = false; } else { setValid(email, 'contactEmailError'); }
        if (subject.value.trim().length < 3) { setInvalid(subject, 'contactSubjectError', 'Please enter a subject for your message.'); isValid = false; } else { setValid(subject, 'contactSubjectError'); }
        if (message.value.trim().length < 10) { setInvalid(message, 'contactMessageError', 'Your message is too short. Please provide more details.'); isValid = false; } else { setValid(message, 'contactMessageError'); }
        if (isValid) { showSuccess('contactSuccess'); resetForm(contactForm); }
    });
    contactForm.querySelectorAll('.custom-input').forEach(function (field) {
        field.addEventListener('blur', function () {
            if (this.value.trim() !== '') { this.classList.remove('is-invalid'); this.classList.add('is-valid'); }
        });
        field.addEventListener('input', function(){ if(this.classList.contains('is-invalid') && this.value.trim().length>1) this.classList.remove('is-invalid'); });
    });
}

/* ——————————————————————————————————————————————
   8. SCROLL FADE-IN ANIMATION (Intersection Observer)
—————————————————————————————————————————————— */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length){
  if (prefersReducedMotion){
    fadeEls.forEach(function(el){ el.classList.add('visible'); });
  } else {
    const fadeObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el, index) {
        const col = index % 3;
        el.style.transitionDelay = (col * 0.08) + 's';
        fadeObserver.observe(el);
    });
  }
}

/* ——————————————————————————————————————————————
   9. BACK TO TOP button (throttled)
—————————————————————————————————————————————— */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn){
  const toggleBackToTop = rafThrottle(function(){
    if (window.scrollY > 400) backToTopBtn.classList.add('visible');
    else backToTopBtn.classList.remove('visible');
  });
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
  toggleBackToTop();
}

/* ——————————————————————————————————————————————
   10. DYNAMIC YEAR in footer
—————————————————————————————————————————————— */
const copyrightEl = document.querySelector('.footer-bottom p');
if (copyrightEl) {
    const year = new Date().getFullYear();
    copyrightEl.innerHTML = copyrightEl.innerHTML.replace('2025', year);
}
