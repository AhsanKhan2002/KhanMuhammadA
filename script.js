/* ════════════════════════════════════════════════════
   AHSAN KHAN — PORTFOLIO  |  script.js
   ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── THEME TOGGLE ──────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Persist theme across visits
  const savedTheme = localStorage.getItem('ak-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ak-theme', next);
  });

  /* ─── NAVBAR SCROLL BEHAVIOUR ───────────────────── */
  const navbar = document.getElementById('navbar');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastY = y;
  }, { passive: true });

  /* ─── MOBILE HAMBURGER ──────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate hamburger lines to ✕
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ─── SCROLL REVEAL ─────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it stays visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ─── SMOOTH SCROLL (ANCHOR LINKS) ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── ACTIVE NAV LINK HIGHLIGHT ─────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navH = 80;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}`
              ? 'var(--text)'
              : '';
          });
        }
      });
    },
    {
      rootMargin: `-${navH}px 0px -60% 0px`,
      threshold: 0,
    }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── HERO PARALLAX (subtle) ────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const y = window.scrollY;
    heroContent.style.transform = `translateY(${y * 0.25}px)`;
    heroContent.style.opacity = Math.max(0, 1 - y / 500);
    if (orb1) orb1.style.transform = `translate(${y * 0.05}px, ${y * 0.08}px)`;
    if (orb2) orb2.style.transform = `translate(${-y * 0.04}px, ${y * 0.06}px)`;
  }, { passive: true });

  /* ─── CURSOR GLOW (desktop only) ────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: left 0.15s ease, top 0.15s ease;
      will-change: left, top;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    }, { passive: true });
  }

  /* ─── TYPING EFFECT (hero tagline) ─────────────── */
  const tagline   = document.querySelector('.hero-tagline');
  const fullText  = tagline ? tagline.textContent.replace(/\s+/g, ' ').trim() : '';
  let   charIdx   = 0;
  let   started   = false;

  if (tagline) {
    tagline.textContent = '';

    const startTyping = () => {
      if (started) return;
      started = true;

      const interval = setInterval(() => {
        if (charIdx < fullText.length) {
          tagline.textContent += fullText[charIdx];
          charIdx++;
        } else {
          clearInterval(interval);
        }
      }, 28);
    };

    // Start after hero name reveal delay (~800ms)
    setTimeout(startTyping, 900);
  }

  /* ─── PAGE LOAD ENTRY ───────────────────────────── */
  // Immediately reveal elements above fold
  window.addEventListener('load', () => {
    const heroEls = document.querySelectorAll('.hero .reveal');
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 200 + i * 120);
    });
  });

})();
