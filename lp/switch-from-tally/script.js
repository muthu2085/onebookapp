document.addEventListener("DOMContentLoaded", function () {
  // Header hairline appears once the page scrolls
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      toggle.focus();
    }
  });

  // Pillar accordion: one open at a time (fallback for browsers without <details name>)
  var pillars = document.querySelectorAll(".pillar");
  pillars.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      pillars.forEach(function (other) {
        if (other !== d) other.open = false;
      });
    });
  });

  // Case study video: swap the thumbnail for the YouTube player on click.
  // Opened as a local file, YouTube refuses to embed (error 153), so the
  // link's default behaviour (open on YouTube) is kept there.
  document.querySelectorAll(".case-play").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (location.protocol === "file:") return;
      e.preventDefault();
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube.com/embed/" + link.dataset.videoId + "?autoplay=1&rel=0";
      frame.title = "Client success story: how Onebook solved Contiship's scaling issues";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      link.replaceWith(frame);
    });
  });

  // Lead form: inline validation + success state (no backend wired yet)
  document.querySelectorAll(".lead-form").forEach(function (form) {
    var success = form.parentElement.querySelector(".form-success");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      form.querySelectorAll(".field input, .field select").forEach(function (el) {
        var ok = el.checkValidity();
        el.closest(".field").classList.toggle("has-error", !ok);
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      form.hidden = true;
      success.hidden = false;
      var source = form.elements.source ? form.elements.source.value : "hero";
      if (window.dataLayer) window.dataLayer.push({ event: "book_consultation_submit", form_source: source });
    });
  });

  // Popup form for CTAs outside the hero and header. Falls back to the
  // #consultation anchor where <dialog> isn't supported.
  var modal = document.getElementById("lead-modal");
  if (modal && typeof modal.showModal === "function") {
    var modalForm = modal.querySelector(".lead-form");
    var lastTrigger = null;

    document.querySelectorAll("[data-popup]").forEach(function (cta) {
      cta.addEventListener("click", function (e) {
        e.preventDefault();
        lastTrigger = cta;
        var section = cta.closest("section[id], section[aria-labelledby]");
        var where = section ? section.id || section.getAttribute("aria-labelledby") : "page";
        modalForm.elements.source.value = where + ": " + cta.textContent.trim();
        modal.showModal();
        document.body.classList.add("modal-open");
        modalForm.querySelector("input:not([type=hidden])").focus();
      });
    });

    modal.querySelector(".modal-close").addEventListener("click", function () {
      modal.close();
    });
    // Click on the backdrop closes the popup
    modal.addEventListener("click", function (e) {
      if (e.target !== modal) return;
      var r = modal.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) modal.close();
    });
    modal.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
      if (lastTrigger) lastTrigger.focus();
    });
  }
});
