/* ==========================================================================
   NABERAN, Recherche en direct sur les tableaux du catalogue.
   ========================================================================== */
(function () {
  "use strict";

  var input = document.getElementById("nab-search-input");
  var countEl = document.getElementById("nab-search-count");
  var rows = Array.prototype.slice.call(document.querySelectorAll(".nab-table tbody tr"));
  var subs = Array.prototype.slice.call(document.querySelectorAll(".nab-sub"));

  if (input && rows.length) {
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;

      rows.forEach(function (row) {
        var match = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
        row.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });

      subs.forEach(function (sub) {
        var anyVisible = sub.querySelector("tbody tr:not(.is-hidden)");
        sub.style.display = q && !anyVisible ? "none" : "";
      });

      if (countEl) {
        countEl.textContent = q ? visible + " référence" + (visible !== 1 ? "s" : "") : "";
      }
      document.body.classList.toggle("nab-no-results", !!q && visible === 0);
    });
  }

  /* Bouton retour en haut */
  var backBtn = document.querySelector(".nab-back");
  if (backBtn) {
    window.addEventListener("scroll", function () {
      backBtn.classList.toggle("is-visible", window.scrollY > 900);
    }, { passive: true });
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
