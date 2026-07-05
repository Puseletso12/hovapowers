/* =========================================================
   Hova's Power Solutions — main.js
   Vanilla JS: mobile nav, quote dialog, toasts, FAQ accordion,
   advisor quiz, projects filter, scroll reveal.
   ========================================================= */
 
(function () {
  "use strict";
 
  /* ---------------------------------------------------
     Mobile menu
  --------------------------------------------------- */
  var menuBtn = document.getElementById("mobileMenuBtn");
  var mobileNav = document.getElementById("mobileNav");
 
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

   /* ---------------------------------------------------
     Scroll reveal
  --------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
 
  /* ---------------------------------------------------
     Toasts
  --------------------------------------------------- */
  var toastViewport = document.getElementById("toastViewport");
 
  function showToast(message, type) {
    if (!toastViewport) return;
    var el = document.createElement("div");
    el.className = "toast toast-" + (type || "success");
    el.textContent = message;
    toastViewport.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("is-visible"); });
    setTimeout(function () {
      el.classList.remove("is-visible");
      setTimeout(function () { el.remove(); }, 250);
    }, 4000);
  }
  window.HovaToast = showToast;
 
  /* ---------------------------------------------------
     Quote dialog
  --------------------------------------------------- */
  var quoteOverlay = document.getElementById("quoteOverlay");
  var quoteForm = document.getElementById("quoteForm");
  var quoteProductSelect = document.getElementById("quoteProduct");
  var quoteSubmitBtn = document.getElementById("quoteSubmitBtn");
 
  function openQuoteDialog(defaultProduct) {
    if (!quoteOverlay) return;
    if (defaultProduct && quoteProductSelect) {
      quoteProductSelect.value = defaultProduct;
    }
    quoteOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
 
  function closeQuoteDialog() {
    if (!quoteOverlay) return;
    quoteOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
 
  window.openQuoteDialog = openQuoteDialog;
  window.closeQuoteDialog = closeQuoteDialog;
 
  document.querySelectorAll("[data-open-quote]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openQuoteDialog(btn.getAttribute("data-open-quote") || "");
    });
  });
 
  if (quoteOverlay) {
    quoteOverlay.addEventListener("click", function (e) {
      if (e.target === quoteOverlay) closeQuoteDialog();
    });
    document.querySelectorAll("[data-close-quote]").forEach(function (btn) {
      btn.addEventListener("click", closeQuoteDialog);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && quoteOverlay.classList.contains("is-open")) closeQuoteDialog();
    });
  }
 
  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(quoteForm);
      var fullName = String(fd.get("fullName") || "").trim();
      var email = String(fd.get("email") || "").trim();
      var phone = String(fd.get("phone") || "").trim();
      var product = String(fd.get("product") || "").trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
      if (fullName.length < 2) return showToast("Please enter your full name", "error");
      if (!emailOk) return showToast("Please enter a valid email", "error");
      if (phone.length < 6) return showToast("Please enter a valid phone number", "error");
      if (!product) return showToast("Please select a product / service", "error");
 
      quoteSubmitBtn.disabled = true;
      quoteSubmitBtn.textContent = "Sending…";
      setTimeout(function () {
        quoteSubmitBtn.disabled = false;
        quoteSubmitBtn.textContent = "Submit Request";
        closeQuoteDialog();
        quoteForm.reset();
        showToast("Quotation request received. Our team will contact you shortly.", "success");
      }, 700);
    });
  }
 
  /* ---------------------------------------------------
     Contact form
  --------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var contactSubmitBtn = document.getElementById("contactSubmitBtn");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(contactForm);
      var name = String(fd.get("name") || "").trim();
      var email = String(fd.get("email") || "").trim();
      var message = String(fd.get("message") || "").trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 
      if (name.length < 2 || !emailOk || message.length < 5) {
        showToast("Please fill in name, email and a short message.", "error");
        return;
      }
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = "Sending…";
      setTimeout(function () {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = "Send Message";
        contactForm.reset();
        showToast("Message sent. We'll be in touch shortly.", "success");
      }, 500);
    });
  }
 
  /* ---------------------------------------------------
     FAQ accordion
  --------------------------------------------------- */
  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      item.closest(".accordion").querySelectorAll(".accordion-item").forEach(function (i) {
        i.classList.remove("is-open");
      });
      if (!isOpen) item.classList.add("is-open");
    });
  });
 
  /* ---------------------------------------------------
     Advisor quiz
  --------------------------------------------------- */
  var quizWrap = document.getElementById("advisorQuiz");
  if (quizWrap) {
    var state = { use: null, mode: null, size: null };
    var resultBox = document.getElementById("quizResult");
    var emptyBox = document.getElementById("quizEmpty");
 
    var RECS = {
      "Backup|Small": {
        title: "Portable Generator",
        icon: "zap",
        productKey: "Generators",
        body: "A compact 5–8 kVA petrol or diesel generator will keep essential appliances (lights, Wi-Fi, TV, fridge) running through outages. Ideal for small homes or small offices that don't need automatic switch-over.",
      },
      "Backup|Medium": {
        title: "Standby Generator with AMF",
        icon: "zap",
        productKey: "Generators",
        body: "A silent standby diesel generator (15–50 kVA) with Automatic Mains Failure keeps your site running with zero manual intervention. Ideal when uptime matters.",
      },
      "Backup|Large": {
        title: "Standby Generator with AMF",
        icon: "zap",
        productKey: "Generators",
        body: "A silent standby diesel generator (80–500 kVA+) with Automatic Mains Failure keeps your site running with zero manual intervention. Ideal when uptime matters.",
      },
      "Full-time|Small": {
        title: "Solar + Battery Backup",
        icon: "battery",
        productKey: "Battery Banks",
        body: "A 5 kW hybrid inverter with a 5–10 kWh lithium battery and a small solar array covers most residential needs day-to-day, with the grid as fallback. Silent, clean and load-shed proof.",
      },
      "Full-time|Medium": {
        title: "Hybrid Solar System",
        icon: "sun",
        productKey: "Solar System Units",
        body: "A full hybrid solar system with battery storage sized for your loads. Combines solar generation, battery buffering and grid backup — the most cost-effective long-term energy solution.",
      },
      "Full-time|Large": {
        title: "Hybrid Solar System",
        icon: "sun",
        productKey: "Solar System Units",
        body: "A full hybrid solar system with battery storage sized for commercial or large residential loads. Combines solar generation, battery buffering and grid backup — the most cost-effective long-term energy solution.",
      },
    };
 
    var ICONS = {
      zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
      battery: '<path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    };
 
    function render() {
      quizWrap.querySelectorAll(".quiz-option").forEach(function (btn) {
        var key = btn.getAttribute("data-key");
        var val = btn.getAttribute("data-value");
        btn.classList.toggle("selected", state[key] === val);
      });
 
      if (state.use && state.mode && state.size) {
        var rec = RECS[state.mode + "|" + state.size];
        emptyBox.style.display = "none";
        resultBox.style.display = "block";
        resultBox.innerHTML =
          '<div class="quiz-result-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[rec.icon] + '</svg></div>' +
          '<p class="quiz-result-eyebrow">Our recommendation</p>' +
          '<h2>' + rec.title + '</h2>' +
          '<p>' + rec.body + '</p>' +
          '<div class="hero-actions">' +
          '<button type="button" class="btn btn-brand btn-lg shadow-elegant" data-open-quote="' + rec.productKey + '">Request a Quotation</button>' +
          '<button type="button" class="btn btn-outline-light-2 btn-lg" id="quizReset"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Start over</button>' +
          '</div>';
        resultBox.querySelector("[data-open-quote]").addEventListener("click", function () {
          openQuoteDialog(rec.productKey);
        });
        resultBox.querySelector("#quizReset").addEventListener("click", function () {
          state = { use: null, mode: null, size: null };
          render();
        });
      } else {
        resultBox.style.display = "none";
        emptyBox.style.display = "block";
      }
    }
 
    quizWrap.querySelectorAll(".quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-key");
        var val = btn.getAttribute("data-value");
        state[key] = val;
        render();
      });
    });
 
    render();
  }
 
  /* ---------------------------------------------------
     Projects filter
  --------------------------------------------------- */
  var filterRow = document.getElementById("projectFilters");
  if (filterRow) {
    var chips = filterRow.querySelectorAll(".filter-chip");
    var cards = document.querySelectorAll("[data-project-cat]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var cat = chip.getAttribute("data-cat");
        cards.forEach(function (card) {
          var show = cat === "All" || card.getAttribute("data-project-cat") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();