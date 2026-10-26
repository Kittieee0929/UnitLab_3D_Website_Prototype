/* UnitLab 3D — entry animation and learning hub controller.
   Progress is read only from the Learning Studio's browser-local demo profile. */
(function () {
  "use strict";
  var intro = document.getElementById("intro");
  var hub = document.getElementById("hub");
  var main = document.getElementById("hubMain");
  var skip = document.getElementById("skipIntro");
  var replay = document.getElementById("replayIntro");
  var bar = document.getElementById("bootFill");
  var percent = document.getElementById("bootPercent");
  var label = document.getElementById("bootLabel");
  var announcement = document.getElementById("introAnnouncement");
  var toggle = document.getElementById("menuToggle");
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("mobileScrim");
  var timers = [];
  var introComplete = false;
  var started = false;
  var INTRO_KEY = "unitlab3d_hub_intro_seen_v1";

  function storeGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
  }
  function queue(fn, ms) {
    var id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }
  function stopTimers() {
    timers.forEach(function (id) { window.clearTimeout(id); window.clearInterval(id); });
    timers = [];
  }
  function showHub(focusMain) {
    if (introComplete) {
      if (focusMain) { main.focus(); }
      return;
    }
    introComplete = true;
    stopTimers();
    intro.classList.remove("is-zooming");
    intro.classList.add("is-fading");
    hub.classList.add("is-visible");
    hub.removeAttribute("aria-hidden");
    storeSet(INTRO_KEY, "yes");
    announcement.textContent = "UnitLab 3D learning hub is ready.";
    queue(function () {
      intro.hidden = true;
      intro.setAttribute("aria-hidden", "true");
      if (focusMain) { main.focus(); }
    }, 620);
  }
  function runZoom() {
    if (introComplete) { return; }
    label.textContent = "WORKSPACE READY";
    announcement.textContent = "Entering the UnitLab 3D learning hub.";
    intro.classList.add("is-zooming");
    queue(function () { showHub(false); }, 1120);
  }
  function runIntro() {
    if (started) { return; }
    started = true;
    introComplete = false;
    intro.hidden = false;
    intro.removeAttribute("aria-hidden");
    intro.classList.remove("is-fading", "is-zooming");
    hub.classList.remove("is-visible");
    hub.setAttribute("aria-hidden", "true");
    label.textContent = "PREPARING YOUR WORKSPACE";
    percent.textContent = "0%";
    bar.style.width = "0%";
    announcement.textContent = "UnitLab 3D is starting. You may skip this introduction.";
    var duration = 2400;
    var start = performance.now();
    function frame(now) {
      if (introComplete) { return; }
      var p = Math.min(100, Math.round((now - start) / duration * 100));
      bar.style.width = p + "%";
      percent.textContent = p + "%";
      if (p >= 100) {
        queue(runZoom, 320);
      } else {
        var id = window.requestAnimationFrame(frame);
        timers.push(id);
      }
    }
    /* One RAF at a time, so interrupted/replayed intros remain safe. */
    var id = window.requestAnimationFrame(frame);
    timers.push(id);
  }
  /* requestAnimationFrame IDs have their own cancel API. */
  var originalStopTimers = stopTimers;
  stopTimers = function () {
    timers.forEach(function (id) {
      window.clearTimeout(id);
      window.clearInterval(id);
      window.cancelAnimationFrame(id);
    });
    timers = [];
  };
  function replayIntro() {
    started = false;
    introComplete = false;
    stopTimers();
    window.scrollTo({ top: 0, behavior: "instant" });
    runIntro();
    skip.focus();
  }
  function closeMenu() {
    sidebar.classList.remove("is-open");
    scrim.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }
  function openMenu() {
    sidebar.classList.add("is-open");
    scrim.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
  }
  function showProgress() {
    var code = storeGet("unitlab3d_student_demo") || "";
    var completed = 0;
    var validCode = /^[a-zA-Z0-9_-]{3,24}$/.test(code);
    if (validCode) {
      try {
        var profile = JSON.parse(localStorage.getItem("unitlab3d_demo_progress_" + code) || "null");
        if (profile && Array.isArray(profile.modules)) {
          var seen = new Set(profile.modules.filter(function (n) {
            return Number.isInteger(n) && n >= 0 && n < 6;
          }));
          completed = seen.size;
        }
      } catch (e) { /* corrupted or unavailable browser-local progress */ }
    }
    var rate = Math.round(completed * 100 / 6);
    document.getElementById("statProgress").textContent = completed + "/6";
    document.getElementById("progressPercent").textContent = rate + "%";
    document.getElementById("progressLabel").textContent = completed + " of 6 studied";
    document.getElementById("progressRing").style.setProperty("--progress", rate + "%");
    document.getElementById("progressNote").textContent = validCode
      ? (completed === 6 ? "You marked all six modules as studied on this device." : "Module completion comes from your local Learning Studio demo profile.")
      : "Sign in using your demo learner code in the Learning Studio to record progress on this device.";
    if (validCode) {
      document.getElementById("avatar").textContent = code.charAt(0).toUpperCase();
      document.getElementById("avatar").setAttribute("aria-label", "Demo learner profile active");
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-module]"), function (card) {
      var index = Number(card.getAttribute("data-module"));
      card.href = "academy.html?module=" + index + "#modules";
      if (validCode && seenHas(index)) {
        card.classList.add("is-studied");
        card.setAttribute("aria-label", "Studied: " + card.querySelector("h3").textContent);
      }
    });
    function seenHas(index) {
      try {
        var item = JSON.parse(localStorage.getItem("unitlab3d_demo_progress_" + code) || "null");
        return Boolean(item && Array.isArray(item.modules) && item.modules.includes(index));
      } catch (e) { return false; }
    }
  }

  toggle.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) { closeMenu(); } else { openMenu(); }
  });
  scrim.addEventListener("click", closeMenu);
  Array.prototype.forEach.call(sidebar.querySelectorAll("a"), function (link) {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) { closeMenu(); }
  });
  skip.addEventListener("click", function () { showHub(true); });
  replay.addEventListener("click", replayIntro);
  document.querySelector(".skip-link").addEventListener("click", function (e) {
    if (!introComplete) {
      e.preventDefault();
      showHub(true);
    }
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) { showProgress(); }
  });
  window.addEventListener("pageshow", showProgress);
  showProgress();

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = storeGet(INTRO_KEY) === "yes";
  var forced = new URLSearchParams(window.location.search).get("intro") === "1";
  if (reduced || (seen && !forced)) {
    introComplete = false;
    showHub(false);
  } else {
    runIntro();
  }
})();
