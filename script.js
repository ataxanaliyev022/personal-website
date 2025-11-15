// Mobile nav toggle and small contact form validation
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
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

      // If you want to send via a service (Formspree, Netlify Forms, etc.), replace the form action server-side.
      // For now we allow the mailto behavior to proceed (it will open the user's email client).
    });
  }
});