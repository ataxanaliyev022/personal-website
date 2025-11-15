// Mobile nav toggle, smooth scrolling with header offset, and small contact form validation
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
  navLinks.forEach((link) => {
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
});