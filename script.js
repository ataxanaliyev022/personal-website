// Mobile nav toggle, smooth scrolling with header offset, contact form validation,
// and scroll reveal using IntersectionObserver
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close mobile nav and perform smooth scroll with offset so sticky header doesn't cover sections
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach(() => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If it's an external link, let it behave normally
      if (!href || !href.startsWith('#')) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Get header height from CSS variable (fallback to 64)
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        // Small extra gap
        const extra = 8;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extra;
        window.scrollTo({ top, behavior: 'smooth' });
      }

      // Close mobile nav if open
      if (nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Basic contact form client validation and mailto fallback hint
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Simple HTML5 validation is usually enough; this prevents blank submits in older browsers
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        alert('Please fill out name, email, and message before sending.');
        return;
      }

      // For now we allow the mailto behavior to proceed (it will open the user's email client).
      // If you want submissions to be sent to a server/service instead, I can hook up Formspree/Netlify/Formsubmit.
    });
  }

  // -------- Scroll reveal logic --------
  // Elements with class "reveal" will gain "reveal--active" when they enter the viewport.
  (function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      // If user prefers reduced motion, make everything visible immediately
      reveals.forEach(el => el.classList.add('reveal--active'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all reveals immediately if IntersectionObserver isn't supported
      reveals.forEach(el => el.classList.add('reveal--active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // trigger a bit before element fully in view
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--active');
          // If you want the element to animate every time it enters, remove the next line
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => {
      // Optional: stagger small inline reveals by using a data attribute
      const delay = el.dataset.revealDelay;
      if (delay) {
        el.style.transitionDelay = delay;
      }
      observer.observe(el);
    });
  })();
});