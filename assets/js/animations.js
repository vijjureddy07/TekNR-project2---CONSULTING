/* ============================== animations.js ============================== */
/* GSAP + ScrollTrigger + Lenis — Omnis-style motion system                  */

(function () {

  /* ============================== Lenis Smooth Scroll ============================== */
  var lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 0.75,
      easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -8 * t); },
      smooth: true,
      smoothTouch: false,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* Sync Lenis with GSAP ScrollTrigger */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ============================== Hero Entrance ============================== */
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-v2__badge')) {
      tl.from('.hero-v2__badge',   { opacity: 0, y: 16, duration: 0.6 })
        .from('.hero-v2__heading', { opacity: 0, y: 48, duration: 0.9 }, '-=0.3')
        .from('.hero-v2__sub',     { opacity: 0, y: 28, duration: 0.7 }, '-=0.5')
        .from('.hero-v2__actions', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-v2__stats .hero-v2__stat', {
          opacity: 0, y: 16, duration: 0.5, stagger: 0.12
        }, '-=0.3')
        .from('.hero-v2__media', {
          opacity: 0, x: 64, duration: 1.1, ease: 'power2.out'
        }, 0.25);
    }

    /* Hero image parallax on scroll */
    if (document.querySelector('.hero-v2__image-wrap img')) {
      gsap.to('.hero-v2__image-wrap img', {
        scrollTrigger: {
          trigger: '.hero-v2',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        },
        y: 90,
        ease: 'none'
      });
    }
  }

  /* ============================== Counter Animation ============================== */
  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = prefix + (Number.isInteger(target)
                ? Math.round(obj.val)
                : obj.val.toFixed(1)) + suffix;
            }
          });
        }
      });
    });
  }

  /* ============================== Section Reveal (Stagger) ============================== */
  function initScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* Section intros */
    gsap.utils.toArray('.section-intro--center, .section-intro').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 0,
        y: 36,
        duration: 0.75,
        ease: 'power2.out'
      });
    });

    /* Staggered card groups */
    var cardGroups = [
      '.services-v2 .service-v2-card',
      '.steps-grid .step-card',
      '.testimonials-grid .testimonial-card',
      '.article-grid .article-card',
      '.article-grid-v2 .article-card-v2',
      '.courses-preview-grid .course-preview-card',
      '.pricing-teaser .pricing-teaser-card',
      '.team-preview-grid .team-preview-card',
      '.industries-grid .industry-card',
      '.about-preview__values .about-preview__value',
      '.case-stats__numbers .case-stat-item',
      '.service-grid .service-card',
      '.case-grid .case-card'
    ];

    cardGroups.forEach(function (selector) {
      var cards = gsap.utils.toArray(selector);
      if (!cards.length) return;

      cards.forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          opacity: 0,
          y: 52,
          duration: 0.7,
          delay: i * 0.1,
          ease: 'power2.out'
        });
      });
    });

    /* Trust strip items */
    gsap.utils.toArray('.trust-strip__item').forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        opacity: 0,
        x: -20,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power2.out'
      });
    });

    /* CTA banner */
    if (document.querySelector('.cta-v2')) {
      var ctaTl = gsap.timeline({
        scrollTrigger: { trigger: '.cta-v2', start: 'top 85%', once: true }
      });
      ctaTl
        .from('.cta-v2__eyebrow', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' })
        .from('.cta-v2 h2',       { opacity: 0, y: 28, duration: 0.7, ease: 'power2.out' }, '-=0.3')
        .from('.cta-v2 p',        { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .from('.cta-v2__actions', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    }

    /* Generic [data-reveal] fallback for non-homepage pages */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      if (el.closest('.hero-v2')) return; /* hero handled separately */
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out'
      });
    });
  }

  /* ============================== Magnetic Buttons ============================== */
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.button, .service-v2-card, .step-card, .testimonial-card').forEach(function (el) {
      var strength = el.classList.contains('button') ? 0.28 : 0.08;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width  / 2) * strength;
        var y = (e.clientY - rect.top  - rect.height / 2) * strength;
        gsap.to(el, { x: x, y: y, duration: 0.4, ease: 'power2.out', overwrite: true });
      });

      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true });
      });
    });
  }

  /* ============================== Marquee Speed Control ============================== */
  function initMarquee() {
    var tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    tracks.forEach(function (track) {
      track.addEventListener('mouseenter', function () {
        track.style.animationPlayState = 'paused';
      });
      track.addEventListener('mouseleave', function () {
        track.style.animationPlayState = 'running';
      });
    });
  }

  /* ============================== Nav scroll state ============================== */
  function initNavScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var scrolled = false;

    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 48;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        header.classList.toggle('is-scrolled', scrolled);
      }
    }, { passive: true });
  }

  /* ============================== Line reveal on headings ============================== */
  function initHeadingLines() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('.hero-v2__heading').forEach(function (el) {
      /* Already handled by hero timeline — skip */
    });

    /* Inner page h1 headings */
    gsap.utils.toArray('.inner-hero h1, .page-hero h1').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: 'power3.out'
      });
    });
  }

  /* ============================== Image hover tilt ============================== */
  function initImageTilt() {
    document.querySelectorAll('.hero-v2__image-wrap, .media-frame--article').forEach(function (el) {
      if (typeof gsap === 'undefined') return;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(el, {
          rotationY: x * 6,
          rotationX: -y * 6,
          transformPerspective: 800,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: true
        });
      });

      el.addEventListener('mouseleave', function () {
        gsap.to(el, {
          rotationX: 0, rotationY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
          overwrite: true
        });
      });
    });
  }

  /* ============================== Boot ============================== */
  function initAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();
    initNavScroll();
    initMarquee();

    /* Defer visual animations until after page paint */
    requestAnimationFrame(function () {
      initHeroAnimations();
      initScrollReveals();
      initCounters();
      initHeadingLines();

      /* Magnetic + tilt — desktop only */
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        initMagneticButtons();
        initImageTilt();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();
