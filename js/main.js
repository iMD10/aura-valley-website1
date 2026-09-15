// main.js
// Behaviour shared by every page: the navigation bar, the mobile drawer,
// scroll-triggered reveals and a few small progressive enhancements.

(() => {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Navigation: frost the bar once the page leaves the top.
     --------------------------------------------------------------------- */
  const nav = document.querySelector('[data-nav]');

  if (nav) {
    const SCROLLED_AT = 24;
    let ticking = false;

    const syncNav = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > SCROLLED_AT);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncNav);
    }, { passive: true });

    syncNav();
  }

  /* ---------------------------------------------------------------------
     Mobile drawer.
     --------------------------------------------------------------------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const drawer = document.querySelector('[data-nav-drawer]');

  if (toggle && drawer) {
    const setDrawer = (open) => {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
      // The bar is over the cream panel while the drawer is open, so it drops
      // its light-on-photography treatment.
      if (nav) nav.classList.toggle('is-menu-open', open);
    };

    toggle.addEventListener('click', () => {
      setDrawer(!drawer.classList.contains('is-open'));
    });

    // Close on navigation, on Escape, and when the viewport grows past the
    // breakpoint where the drawer no longer exists.
    drawer.querySelectorAll('a').forEach((link, i) => {
      link.style.setProperty('--i', i);
      link.addEventListener('click', () => setDrawer(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setDrawer(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
      if (e.matches) setDrawer(false);
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal. Elements marked [data-reveal] fade up once, the first
     time they enter the viewport.
     --------------------------------------------------------------------- */
  const revealables = document.querySelectorAll('[data-reveal]');

  if (revealables.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealables.forEach((el) => el.classList.add('is-revealed'));
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

      revealables.forEach((el) => {
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);

        // Anything already on screen animates in straight away. Observing it
        // instead would strand elements sitting against the bottom edge, which
        // never satisfy the negative root margin until the page scrolls.
        if (el.getBoundingClientRect().top < window.innerHeight) {
          requestAnimationFrame(() => el.classList.add('is-revealed'));
        } else {
          observer.observe(el);
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Fade media in once it has actually decoded. The project photography is
     large, so without this the tiles pop in abruptly.
     --------------------------------------------------------------------- */
  window.auraFadeIn = (el) => {
    if (!el) return;
    el.classList.add('media-fade');
    const done = () => el.classList.add('is-loaded');
    if (el.complete || el.readyState >= 2) done();
    else el.addEventListener(el.tagName === 'VIDEO' ? 'loadeddata' : 'load', done, { once: true });
    el.addEventListener('error', done, { once: true });
  };

  document.querySelectorAll('[data-fade-in]').forEach(window.auraFadeIn);

  /* ---------------------------------------------------------------------
     Hero film. It plays muted behind the title; visitors who prefer reduced
     motion get the poster frame instead, and anyone can stop it.
     --------------------------------------------------------------------- */
  const heroVideo  = document.querySelector('[data-hero-video]');
  const heroToggle = document.querySelector('[data-hero-toggle]');

  if (heroVideo && heroToggle) {
    const iconPause = heroToggle.querySelector('[data-icon-pause]');
    const iconPlay  = heroToggle.querySelector('[data-icon-play]');

    const syncToggle = () => {
      const playing = !heroVideo.paused && !heroVideo.ended;
      iconPause.hidden = !playing;
      iconPlay.hidden = playing;
      heroToggle.setAttribute('aria-label',
        playing ? 'Pause the background film' : 'Play the background film');
    };

    if (prefersReducedMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    }

    heroToggle.addEventListener('click', () => {
      if (heroVideo.paused) heroVideo.play().catch(() => {});
      else heroVideo.pause();
    });

    heroVideo.addEventListener('play', syncToggle);
    heroVideo.addEventListener('pause', syncToggle);

    // Some browsers refuse autoplay outright; reflect whatever actually happened.
    heroVideo.addEventListener('loadeddata', syncToggle, { once: true });

    // With a <source> child the failure fires on the source, not the video.
    // If the film cannot play at all the poster becomes the hero and the
    // control would do nothing, so it is withdrawn.
    const dropToggle = () => { heroToggle.hidden = true; };
    heroVideo.addEventListener('error', dropToggle, { once: true });
    heroVideo.querySelectorAll('source').forEach((src) => {
      src.addEventListener('error', dropToggle, { once: true });
    });

    syncToggle();
  }

  /* ---------------------------------------------------------------------
     Footer year.
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
