/* VGSTUDIO — shared site behavior: preloader, ember background, nav, reveals */

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

  /* ---------------- Nav ---------------- */
  function setupNav() {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("is-open");
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
        });
      });
    }

    // highlight active link
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === path) a.classList.add("is-active");
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
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

  /* ---------------- Hero video fallback ---------------- */
  function setupHeroVideo() {
    var video = document.querySelector(".hero-video");
    if (!video) return;
    video.addEventListener("canplay", function () {
      video.classList.add("is-ready");
    });
    video.addEventListener("error", function () {
      video.style.display = "none";
    });
    // if there's no usable source, hide gracefully
    if (!video.querySelector("source") || !video.querySelector("source").getAttribute("src")) {
      video.style.display = "none";
    }
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
    setupNav();
    setupReveal();
    setupHeroVideo();
    setupEmbers();
  });
})();
