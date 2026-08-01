/* TheZaraAI — Agent Reach guide. No dependencies, no tracking, no network calls. */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  var mq = window.matchMedia("(max-width: 860px)");

  function applyNavState() {
    if (!nav || !toggle) return;
    if (mq.matches) {
      nav.hidden = toggle.getAttribute("aria-expanded") !== "true";
    } else {
      nav.hidden = false;
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      applyNavState();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && mq.matches) {
        toggle.setAttribute("aria-expanded", "false");
        applyNavState();
      }
    });
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(applyNavState);
    applyNavState();
  }

  /* ---- Copy buttons ---- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target) return;
      var text = target.innerText.replace(/\u00a0/g, " ");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        btn.setAttribute("data-copied", "true");
        window.setTimeout(function () {
          btn.textContent = original;
          btn.removeAttribute("data-copied");
        }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (err) { btn.textContent = "Copy failed"; }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---- Scroll spy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute("href") === "#" + entry.target.id;
          if (active) { a.setAttribute("aria-current", "true"); }
          else { a.removeAttribute("aria-current"); }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- Checklist state (in-memory only, resets on reload) ---- */
  var boxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  var checklistState = Object.create(null);
  var progress = document.getElementById("checklistProgress");

  function renderProgress() {
    if (!progress || !boxes.length) return;
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    progress.textContent = done + " of " + boxes.length + " complete";
  }

  boxes.forEach(function (box) {
    checklistState[box.id] = box.checked;
    box.addEventListener("change", function () {
      checklistState[box.id] = box.checked;
      renderProgress();
    });
  });
  renderProgress();

  /* ---- Year ---- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
