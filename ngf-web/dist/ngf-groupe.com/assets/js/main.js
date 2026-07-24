/* ==========================================================================
   GROUPE NGF, Interactions / main.js
   En-tête compact, menu mobile, apparitions au scroll, compteurs,
   duplication du défilé de logos, année courante.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- En-tête compact au scroll ----------------------------------------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-compact", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Menu mobile --------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Apparition au scroll ------------------------------------------------ */
  var revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealables.length && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

    revealables.forEach(function (el) {
      var delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.transitionDelay = delay + "ms";

      // Déjà dans l'écran au chargement (hero, etc.) : on affiche tout de
      // suite, sans attendre le premier passage de l'observateur ni le
      // fondu, sinon le haut de page reste invisible ~1 s à chaque visite.
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.style.transitionDelay = "0ms";
        el.classList.add("is-in");
      } else {
        io.observe(el);
      }
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* --- Compteurs des chiffres clés ---------------------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString().padStart(2, "0");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --- Section courante soulignée dans la nav (ancres de la même page) ------ */
  var spyLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if ("IntersectionObserver" in window && spyLinks.length) {
    var byId = {};
    spyLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var spied = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.remove("is-active"); });
        byId[entry.target.id].classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spied.forEach(function (s) { spy.observe(s); });
  }

  /* --- Retour en haut de page ---------------------------------------------- */
  /* Les pages du site sont longues (accueil, réalisations, boutique) : on pose
     le bouton en JS pour ne pas avoir à l'ajouter dans chaque fichier HTML.
     Il n'apparaît qu'au-delà d'un écran de défilement, donc jamais sur une
     page courte, sans avoir à mesurer une hauteur encore incomplète (la
     boutique remplit sa grille après ce script).                           */
  (function initToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Revenir en haut de la page");
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    // La boutique a déjà un bouton panier flottant dans ce coin : on empile.
    if (document.querySelector(".cart-fab")) btn.classList.add("to-top--stacked");
    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > window.innerHeight);
    }, { passive: true });
  })();

  /* --- Année courante ------------------------------------------------------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* --- Visionneuse photo (lightbox) --------------------------------------- */
  /* Toute photo de contenu est cliquable : clic → agrandissement plein écran,
     navigation ‹/›, fermeture (croix, fond, Échap). Fonctionne aussi avec les
     images ajoutées dynamiquement (boutique) grâce à la délégation d'événements. */
  (function initLightbox() {
    // Conteneurs "galerie" : les photos y sont navigables ensemble.
    var GROUPS = ".article, .gallery, .mosaic, .locaux-grid, .cases, .pgrid, .motors, .dom-grid";

    function zoomable(img) {
      if (!img || img.tagName !== "IMG") return false;
      if (img.closest("a")) return false;              // un lien : on suit le lien
      if (img.closest(".brand, .topbar, .site-header, .site-footer, .lbox, [aria-hidden='true']")) return false;
      var src = img.getAttribute("src") || "";
      if (/\/brand\/|\/partners\/|favicon|logo-/.test(src)) return false;
      if (img.naturalWidth && img.naturalWidth < 200) return false; // icônes
      return true;
    }

    var overlay, imgEl, capEl, prevBtn, nextBtn, group = [], idx = 0;

    function build() {
      overlay = document.createElement("div");
      overlay.className = "lbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Photo agrandie");
      overlay.innerHTML =
        '<button type="button" class="lbox__close" aria-label="Fermer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<button type="button" class="lbox__nav lbox__prev" aria-label="Photo précédente"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '<figure class="lbox__fig"><img class="lbox__img" alt=""><figcaption class="lbox__cap"></figcaption></figure>' +
        '<button type="button" class="lbox__nav lbox__next" aria-label="Photo suivante"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>';
      document.body.appendChild(overlay);
      imgEl = overlay.querySelector(".lbox__img");
      capEl = overlay.querySelector(".lbox__cap");
      prevBtn = overlay.querySelector(".lbox__prev");
      nextBtn = overlay.querySelector(".lbox__next");
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.closest(".lbox__close")) close();
      });
      prevBtn.addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
      nextBtn.addEventListener("click", function (e) { e.stopPropagation(); step(1); });
      document.addEventListener("keydown", function (e) {
        if (!overlay || !overlay.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
      });
    }

    function caption(img) {
      var fig = img.closest("figure");
      var fc = fig && fig.querySelector("figcaption");
      return (fc && fc.textContent.trim()) || img.getAttribute("alt") || "";
    }

    function show(i) {
      idx = (i + group.length) % group.length;
      var img = group[idx];
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.getAttribute("alt") || "";
      var cap = caption(img);
      capEl.textContent = cap;
      capEl.style.display = cap ? "" : "none";
      var multi = group.length > 1;
      prevBtn.style.display = multi ? "" : "none";
      nextBtn.style.display = multi ? "" : "none";
    }
    function step(d) { show(idx + d); }

    function open(img) {
      if (!overlay) build();
      var container = img.closest(GROUPS);
      var scope = container ? container.querySelectorAll("img") : [img];
      group = Array.prototype.filter.call(scope, zoomable);
      var pos = group.indexOf(img);
      if (pos === -1) { group = [img]; pos = 0; }
      show(pos);
      overlay.classList.add("open");
      document.body.classList.add("lbox-open");
    }
    function close() {
      if (!overlay) return;
      overlay.classList.remove("open");
      document.body.classList.remove("lbox-open");
    }

    document.addEventListener("click", function (e) {
      var img = e.target.closest("img");
      if (img && zoomable(img)) { e.preventDefault(); open(img); }
    });
  })();
})();
