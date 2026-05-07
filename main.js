/* ─────────────────────────────────────────────────────
   LINLYT — main.js
───────────────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════════════════
   1. NAVBAR
══════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

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

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.classList.toggle('open', open);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ══════════════════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════
   3. CAPABILITIES TAB SWITCHER
══════════════════════════════════════════════════ */
(function initCapabilities() {
  const items = document.querySelectorAll('.cap-item');
  const panels = document.querySelectorAll('.cap-panel');
  if (!items.length) return;

  function activate(index) {
    items.forEach((item, i) => item.classList.toggle('cap-item-active', i === index));
    panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => activate(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i); }
    });
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
  });

  let autoIndex = 0;
  const autoRotate = setInterval(() => {
    autoIndex = (autoIndex + 1) % items.length;
    activate(autoIndex);
  }, 4000);

  const section = document.getElementById('capabilities');
  if (section) section.addEventListener('mouseenter', () => clearInterval(autoRotate));
})();

/* ══════════════════════════════════════════════════
   4. HERO PARALLAX — shapes only
══════════════════════════════════════════════════ */
(function initParallax() {
  const heroShapes = document.querySelector('.hero-shapes');
  if (!heroShapes) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastY = 0;
  window.addEventListener('scroll', () => { lastY = window.scrollY; }, { passive: true });

  function rafLoop() {
    const progress = lastY / (window.innerHeight || 800);
    const offset = Math.min(progress * 40, 40);
    heroShapes.style.transform = `translateY(${offset}px)`;
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);
})();

/* ══════════════════════════════════════════════════
   5. CONTACT FORM — WhatsApp
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

    if (!name || !email) { shakeField(!name ? '#cf-name' : '#cf-email'); return; }
    if (!isValidEmail(email)) { shakeField('#cf-email'); return; }

    submit.disabled = true;
    submit.textContent = 'Opening WhatsApp…';

    const phone = "916238398173";
    const text = `New enquiry:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

    setTimeout(() => {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
      submit.disabled = false;
      submit.textContent = 'Send Enquiry';
      form.reset();
    }, 600);
  });

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function shakeField(selector) {
    const el = form.querySelector(selector);
    if (!el) return;
    el.classList.add('input-error');
    el.addEventListener('animationend', () => el.classList.remove('input-error'), { once: true });
  }
})();

/* ══════════════════════════════════════════════════
   6. FLOATING LABELS
══════════════════════════════════════════════════ */
(function initFloatingLabels() {
  const inputs = document.querySelectorAll('.form-group-modern input, .form-group-modern select, .form-group-modern textarea');

  function checkValue(el) {
    el.parentElement.classList.toggle('filled', el.value !== "");
  }

  inputs.forEach(input => {
    checkValue(input);
    input.addEventListener('input', () => checkValue(input));
    input.addEventListener('change', () => checkValue(input));
  });
})();

/* ══════════════════════════════════════════════════
   7. INPUT SHAKE CSS
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

/* ══════════════════════════════════════════════════
   8. HERO CONTENT FADE ON SCROLL
══════════════════════════════════════════════════ */
(function initHeroParallaxFade() {
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroSection || !heroContent) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  heroContent.style.transition = 'none';
  if (heroVisual) heroVisual.style.transition = 'none';

  let rafId = null;

  function update() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight || window.innerHeight;
    const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
    const opacity = Math.max(0, 1 - progress * 1.4);
    const scale = 1 - progress * 0.04;

    heroContent.style.opacity = opacity;
    heroContent.style.transform = `scale(${scale})`;

    if (heroVisual) {
      heroVisual.style.opacity = opacity;
      heroVisual.style.transform = `scale(${scale})`;
    }
    rafId = null;
  }

  window.addEventListener('scroll', () => {
    if (!rafId) rafId = requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

/* ══════════════════════════════════════════════════
   9. RIBBON ENTRANCE OBSERVER
══════════════════════════════════════════════════ */
(function initRibbonEntrance() {
  const ribbon = document.querySelector('.ribbon');
  if (!ribbon) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ribbon.classList.add('ribbon-surfaced');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ribbon.classList.add('ribbon-surfaced');
        observer.disconnect();
      }
    });
  }, { threshold: 0.01 });

  observer.observe(ribbon);
})();

/* ══════════════════════════════════════════════════
   9.5 ABOUT CINEMATIC REVEAL
══════════════════════════════════════════════════ */
(function initAboutCinematic() {
  const aboutSection = document.querySelector('.about');
  if (!aboutSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutSection.classList.add('active');
        observer.unobserve(aboutSection);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  observer.observe(aboutSection);
})();

/* ══════════════════════════════════════════════════
   10. SERVICES HORIZONTAL SCROLL CAROUSEL
══════════════════════════════════════════════════ */
/* ═════════════════════════════════════�  const section = document.querySelector('.reveal-section');
  const logoContainer = document.querySelector('.reveal-logo-container');
  const logoImg = logoContainer ? logoContainer.querySelector('.reveal-logo') : null;
  const mask = document.querySelector('.reveal-content-mask');
  const content = document.querySelector('.reveal-content');
  if (!section || !logoContainer || !logoImg || !content) return;

  function updateReveal() {
    const scrollY = window.scrollY;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportH = window.innerHeight;

    // Progress 0 -> 1 within the section
    const progress = Math.min(Math.max((scrollY - sectionTop) / (sectionHeight - viewportH), 0), 1);

    // 1. Logo Zoom Animation (0.0 -> 0.9)
    const logoProg = Math.min(progress / 0.85, 1);
    const easedLogoProg = Math.pow(logoProg, 3);
    const logoScale = 1 + (easedLogoProg * 29); 
    
    // FADE ONLY THE LOGO IMAGE, NOT THE CONTAINER
    const logoOpacity = progress < 0.6 ? 1 : 1 - ((progress - 0.6) / 0.3);
    
    logoContainer.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
    logoImg.style.opacity = Math.max(logoOpacity, 0);

    // 2. Text Reveal — Stays visible after reveal (textEnd = 0.8)
    const textStart = 0.35;
    const textEnd = 0.8;
    
    if (progress > textStart) {
      const textProg = Math.min((progress - textStart) / (textEnd - textStart), 1);
      const easedTextProg = 1 - Math.pow(1 - textProg, 2);
      
      const targetScale = 0.05 + (easedTextProg * 0.95);
      const relativeScale = targetScale / logoScale;
      
      const opacity = easedTextProg;
      const blur = 15 * (1 - easedTextProg);
      
      content.style.opacity = opacity;
      content.style.filter = `blur(${blur}px)`;
      content.style.transform = `scale(${relativeScale})`;
    } else {
      content.style.opacity = '0';
      content.style.filter = 'blur(15px)';
      content.style.transform = 'scale(0.01)';
    }
  }ow.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      track.style.transform = '';
      cards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; c.style.filter = ''; });
    } else {
      updateCarousel();
    }
  });

  updateCarousel();
})();

/* ══════════════════════════════════════════════════
   11. CINEMATIC REVEAL SECTION
══════════════════════════════════════════════════ */
(function initRevealSection() {
  const section = document.querySelector('.reveal-section');
  const logoContainer = document.querySelector('.reveal-logo-container');
  const mask = document.querySelector('.reveal-content-mask');
  const content = document.querySelector('.reveal-content');
  if (!section || !logoContainer || !mask || !content) return;

  function updateReveal() {
    const scrollY = window.scrollY;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportH = window.innerHeight;

    // Progress 0 -> 1 within the section
    const progress = Math.min(Math.max((scrollY - sectionTop) / (sectionHeight - viewportH), 0), 1);

    // 1. Logo Zoom Animation (0.0 -> 0.9)
    // Dramatic zoom from 1 to 30
    const logoProg = Math.min(progress / 0.85, 1);
    const easedLogoProg = Math.pow(logoProg, 3);
    const logoScale = 1 + (easedLogoProg * 29); 
    
    // Logo fades out late (0.6 -> 0.95)
    const logoOpacity = progress < 0.6 ? 1 : 1 - ((progress - 0.6) / 0.35);
    
    logoContainer.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
    logoContainer.style.opacity = Math.max(logoOpacity, 0);

    // 2. Text Reveal — Delayed until mid-zoom (progress 0.35)
    const textStart = 0.35;
    const textEnd = 0.85;
    
    if (progress > textStart) {
      const textProg = Math.min((progress - textStart) / (textEnd - textStart), 1);
      const easedTextProg = 1 - Math.pow(1 - textProg, 2);
      
      // The text starts extremely tiny and grows to readable size
      // We must counteract the logo's massive scale to keep text size elegant
      const targetScale = 0.05 + (easedTextProg * 0.95); // Absolute screen scale
      const relativeScale = targetScale / logoScale; // Corrected for parent scaling
      
      const opacity = easedTextProg;
      const blur = 15 * (1 - easedTextProg);
      
      content.style.opacity = opacity;
      content.style.filter = `blur(${blur}px)`;
      content.style.transform = `scale(${relativeScale})`;
    } else {
      content.style.opacity = '0';
      content.style.filter = 'blur(15px)';
      content.style.transform = 'scale(0.01)';
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateReveal();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateReveal();
})();