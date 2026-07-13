// Calculia — shared site behaviour (nav, reveal-on-scroll, scroll-to-top)
//
// IMPORTANT: this script uses try/catch around each independent feature so
// that a failure in one (e.g. IntersectionObserver missing in a very old
// browser) never stops the rest of the script — nav toggling, active-link
// highlighting, etc. — from working. Content itself never depends on this
// script succeeding: see the .reveal / .mark-underline / .mark-circle rules
// in style.css, which are visible by default and only opt into a hidden
// starting state once body.reveal-ready is added below.

(function () {
  // Confirm JS is running before any content is allowed to start hidden.
  // If this line never executes (script blocked, fails to load, etc.),
  // .reveal / .mark-underline / .mark-circle content stays fully visible —
  // see style.css.
  document.body.classList.add('reveal-ready');

  // Mobile menu toggle
  try {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => mobileMenu.classList.remove('open'))
      );
    }
  } catch (err) {
    console.error('Calculia nav toggle failed to initialize:', err);
  }

  // Scroll-triggered reveal — .reveal (sections/cards) and the
  // .mark-underline / .mark-circle hand-marked accents (which may or may
  // not sit inside a .reveal ancestor).
  try {
    if ('IntersectionObserver' in window) {
      const revealEls = document.querySelectorAll('.reveal');
      if (revealEls.length) {
        const revealIO = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealIO.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        revealEls.forEach(el => revealIO.observe(el));
      }

      const markEls = document.querySelectorAll('.mark-underline, .mark-circle');
      if (markEls.length) {
        const markIO = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('marked');
              markIO.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        markEls.forEach(el => markIO.observe(el));
      }
    } else {
      // No IntersectionObserver support — undo the hidden starting state
      // immediately rather than leaving content stuck invisible.
      document.body.classList.remove('reveal-ready');
    }
  } catch (err) {
    console.error('Calculia scroll-reveal failed to initialize:', err);
    document.body.classList.remove('reveal-ready');
  }

  // Scroll to top button
  try {
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
      window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('show', window.scrollY > 500);
      }, { passive: true });
      scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  } catch (err) {
    console.error('Calculia scroll-to-top failed to initialize:', err);
  }

  // Active nav link based on current page
  try {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  } catch (err) {
    console.error('Calculia active-link highlighting failed to initialize:', err);
  }
})();
