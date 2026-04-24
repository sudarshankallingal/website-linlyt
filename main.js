/* ─────────────────────────────────────────────────────
   LINLYT — main.js
   Scroll reveal · Navbar · Capabilities tabs · Form
───────────────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════════════════
   1. NAVBAR — scroll state + hamburger
══════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Scroll state
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('open', open);
  });

  // Close on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ══════════════════════════════════════════════════
   2. SCROLL REVEAL — IntersectionObserver
══════════════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  // Apply delay from data attribute
  elements.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════
   3. CAPABILITIES TAB SWITCHER
══════════════════════════════════════════════════ */
(function initCapabilities() {
  const items = document.querySelectorAll('.cap-item');
  const panels = document.querySelectorAll('.cap-panel');

  function activate(index) {
    items.forEach((item, i) => {
      item.classList.toggle('cap-item-active', i === index);
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => activate(i));
    // Keyboard support
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(i);
      }
    });
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
  });

  // Auto-rotate every 4s
  let autoIndex = 0;
  const autoRotate = setInterval(() => {
    autoIndex = (autoIndex + 1) % items.length;
    activate(autoIndex);
  }, 4000);

  // Pause on hover
  const section = document.getElementById('capabilities');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoRotate));
  }
})();

/* ══════════════════════════════════════════════════
   4. VERY SUBTLE PARALLAX — hero only
══════════════════════════════════════════════════ */
(function initParallax() {
  const heroShapes = document.querySelector('.hero-shapes');
  if (!heroShapes) return;

  // Only on devices unlikely to be touch
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
  }, { passive: true });

  function rafLoop() {
    const progress = lastY / (window.innerHeight || 800);
    const offset = Math.min(progress * 40, 40); // max 40px
    heroShapes.style.transform = `translateY(${offset}px)`;
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);
})();

/* ══════════════════════════════════════════════════
   5. CONTACT FORM — WhatsApp Only (Clean Setup)
══════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submit = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    // Validation
    if (!name || !email) {
      shakeField(!name ? '#cf-name' : '#cf-email');
      return;
    }
    if (!isValidEmail(email)) {
      shakeField('#cf-email');
      return;
    }

    // UI loading state
    submit.disabled = true;
    submit.textContent = 'Opening WhatsApp…';

    const phone = "916238398173";

    const text = `New enquiry:
Name: ${name}
Email: ${email}
Message: ${message}`;

    // Small delay for smooth UX
    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");

      // Reset UI
      submit.disabled = false;
      submit.textContent = 'Send Enquiry';
      form.reset();
    }, 600);
  });

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function shakeField(selector) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.classList.add('input-error');
    el.addEventListener('animationend', () => el.classList.remove('input-error'), { once: true });
  }
})();
/* ══════════════════════════════════════════════════
   6. FLOATING LABELS — persistence
══════════════════════════════════════════════════ */
(function initFloatingLabels() {
  const inputs = document.querySelectorAll('.form-group-modern input, .form-group-modern select, .form-group-modern textarea');

  function checkValue(el) {
    if (el.value !== "") {
      el.parentElement.classList.add('filled');
    } else {
      el.parentElement.classList.remove('filled');
    }
  }

  inputs.forEach(input => {
    // Initial check
    checkValue(input);

    // Update on change
    input.addEventListener('input', () => checkValue(input));
    input.addEventListener('change', () => checkValue(input));
  });
})();

/* ══════════════════════════════════════════════════
   7. INPUT SHAKE ANIMATION (CSS inject)
══════════════════════════════════════════════════ */
(function injectShakeCss() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes inputShake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX( 6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX( 4px); }
    }
    .input-error {
      border-color: #ef4444 !important;
      animation: inputShake 0.4s ease-in-out;
    }
  `;
  document.head.appendChild(style);
})();

