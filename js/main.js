/* Very Good Studio Inc. — shared site behavior: preloader, ember background, nav, reveals */

(function () {
  "use strict";

  /* ---------------- Preloader ---------------- */
  function runPreloader() {
    var bar = document.querySelector(".preloader-bar span");
    var percentEl = document.querySelector(".preloader-percent");
    var pre = document.getElementById("preloader");
    if (!pre) return;

    var progress = 0;
    var duration = 1600; // ms
    var start = performance.now();

    function tick(now) {
      var elapsed = now - start;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (bar) bar.style.width = progress + "%";
      if (percentEl) percentEl.textContent = progress + "%";

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          document.body.classList.add("is-loaded");
          setTimeout(function () {
            if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
          }, 800);
        }, 200);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Menu overlay ---------------- */
  function setupMenu() {
    var btn = document.querySelector(".topbar-menu-btn");
    var overlay = document.querySelector(".menu-overlay");
    var closeBtn = document.querySelector(".menu-close");
    if (!btn || !overlay) return;

    function openMenu() {
      document.body.classList.add("menu-open");
      btn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      document.body.classList.remove("menu-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      if (document.body.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    overlay.querySelectorAll("a[data-page]").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal, .section-reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Logo fallback ---------------- */
  // Shows a text fallback in the topbar badge if the logo image is missing/broken.
  function setupLogoFallback() {
    document.querySelectorAll(".topbar-logo img, .preloader-logo img").forEach(function (img) {
      function showFallback() {
        img.style.display = "none";
        var fallback = img.nextElementSibling;
        if (fallback) fallback.style.display = "block";
      }
      // A 404 can resolve before this script runs, so the "error" event may
      // already have fired — check the already-failed state first.
      if (img.complete && img.naturalWidth === 0) {
        showFallback();
      } else {
        img.addEventListener("error", showFallback);
      }
    });
  }

  /* ---------------- Photo fallback ---------------- */
  // Hides any content photo that fails to load instead of leaving a broken-image icon.
  function setupPhotoFallback() {
    document.querySelectorAll(".about-teaser-photos img, .featured-media img, .concept-tile img, .game-hero-logo-img, .team-tile img").forEach(function (img) {
      function hide() { img.style.display = "none"; }
      if (img.complete && img.naturalWidth === 0) hide();
      else img.addEventListener("error", hide);
    });
  }

  /* ---------------- Video fallback ---------------- */
  // Hides any <video> that fails to load or has no playable source, so a
  // missing/unsupported asset (e.g. an unconverted .MOV) never leaves a
  // broken black box on the page.
  function setupVideos() {
    document.querySelectorAll("video").forEach(function (video) {
      function hide() { video.style.display = "none"; }
      video.addEventListener("canplay", function () {
        video.classList.add("is-ready");
      });
      video.addEventListener("error", hide);
      var sources = video.querySelectorAll("source");
      var hasSrc = Array.prototype.some.call(sources, function (s) {
        return s.getAttribute("src");
      });
      if (!hasSrc || video.error) hide();
    });
  }

  /* ---------------- Scroll effects: topbar solidify, progress bar, parallax ---------------- */
  function setupScrollEffects() {
    var topbar = document.querySelector(".topbar");
    var progressBar = document.querySelector(".scroll-progress");
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!topbar && !progressBar && !parallaxEls.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var scrollTop = window.scrollY;

      if (topbar) {
        if (scrollTop > 40) topbar.classList.add("is-scrolled");
        else topbar.classList.remove("is-scrolled");
      }

      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + "%";
      }

      if (parallaxEls.length && !reduceMotion) {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
          var scale = parseFloat(el.getAttribute("data-parallax-scale")) || 1;
          var center = rect.top + rect.height / 2;
          var offset = (center - vh / 2) * speed;
          el.style.transform = "translateY(" + offset.toFixed(1) + "px) scale(" + scale + ")";
        });
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }

  /* ---------------- Ember particle background ---------------- */
  function setupEmbers() {
    var canvas = document.querySelector(".hero-embers");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = 70;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    }

    function makeParticle() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        r: (Math.random() * 2 + 0.6) * dpr,
        speed: (Math.random() * 0.6 + 0.15) * dpr,
        drift: (Math.random() - 0.5) * 0.4 * dpr,
        alpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.5 ? "226,16,30" : "245,241,232"
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) {
        var p = makeParticle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
      }
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -20) {
          particles[i] = makeParticle();
          particles[i].y = canvas.height + 20;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.hue + "," + p.alpha + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    init();
    step();
    window.addEventListener("resize", resize, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    runPreloader();
    setupMenu();
    setupReveal();
    setupLogoFallback();
    setupPhotoFallback();
    setupVideos();
    setupScrollEffects();
    setupEmbers();
  });
})();
