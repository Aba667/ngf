/* ==========================================================================
   GROUPE NGF, commander.js
   Modale « Commander » partagée (page moteurs + boutique).
   Le client choisit son canal — WhatsApp ou e-mail — puis le service client
   NGF le recontacte pour le paiement et la livraison. Aucun paiement en ligne.
   Usage :  data-commander='{"name":"…","ref":"…","price":"…"}' sur un bouton,
            ou window.openCommander({name, ref, price}).
   ========================================================================== */
(function () {
  "use strict";
  var WA = "221785892986";
  var MAIL = "depcom@ngomfreres.com";

  var overlay, elKicker, elName, elPrice, elWa, elMail;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "cmd-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Commander un moteur");
    overlay.innerHTML =
      '<div class="cmd-modal">' +
        '<div class="cmd-modal__head">' +
          '<div>' +
            '<span class="cmd-modal__kicker">Commander</span>' +
            '<h3 data-cmd-name>Moteur hors-bord Hidea</h3>' +
            '<div class="cmd-modal__price" data-cmd-price hidden></div>' +
          '</div>' +
          '<button type="button" class="cmd-modal__close" aria-label="Fermer">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<p class="cmd-modal__lead">Choisissez comment nous transmettre votre commande&nbsp;:</p>' +
        '<div class="cmd-modal__choices">' +
          '<a class="cmd-choice cmd-choice--wa" data-cmd-wa target="_blank" rel="noopener">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9.2 8.4 8.6 8.6 0 0 1-3.4-.8L3 21l1.9-5.2a8.4 8.4 0 1 1 16.1-4.3z"/></svg>' +
            '<span>Commander sur WhatsApp<small>Réponse rapide en journée</small></span>' +
          '</a>' +
          '<a class="cmd-choice cmd-choice--mail" data-cmd-mail>' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>' +
            '<span>Commander par e-mail<small>depcom@ngomfreres.com</small></span>' +
          '</a>' +
        '</div>' +
        '<p class="cmd-modal__note">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
          '<span>Aucun paiement en ligne&nbsp;: après votre demande, le service client NGF vous recontacte pour organiser le paiement et la livraison.</span>' +
        '</p>' +
      '</div>';
    document.body.appendChild(overlay);

    elName = overlay.querySelector("[data-cmd-name]");
    elPrice = overlay.querySelector("[data-cmd-price]");
    elWa = overlay.querySelector("[data-cmd-wa]");
    elMail = overlay.querySelector("[data-cmd-mail]");

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".cmd-modal__close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
  }

  function label(data) {
    var l = data.name || "Moteur hors-bord Hidea";
    if (data.ref) l += " (" + data.ref + ")";
    return l;
  }

  function open(data) {
    data = data || {};
    if (!overlay) build();

    elName.textContent = data.name || "Moteur hors-bord Hidea";
    if (data.price) {
      elPrice.innerHTML = data.price + ' <span>FCFA</span>';
      elPrice.hidden = false;
    } else {
      elPrice.hidden = true;
    }

    var item = label(data);
    var priceTxt = data.price ? (" au prix de " + data.price + " FCFA") : "";
    var msg = "Bonjour Groupe NGF, je souhaite commander le moteur hors-bord Hidea " +
              item + priceTxt + ". Merci de me recontacter pour finaliser la commande.";
    elWa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);

    var subject = "Commande moteur Hidea " + (data.ref || data.name || "");
    var body = msg + "\n\nMes coordonnées :\nNom :\nTéléphone :\nAdresse de livraison :";
    elMail.href = "mailto:" + MAIL +
      "?subject=" + encodeURIComponent(subject.trim()) +
      "&body=" + encodeURIComponent(body);

    overlay.classList.add("open");
  }

  function close() {
    if (overlay) overlay.classList.remove("open");
  }

  // Délégation : tout élément avec data-commander='{…}' ouvre la modale.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-commander]");
    if (!t) return;
    e.preventDefault();
    var data = {};
    try { data = JSON.parse(t.getAttribute("data-commander")); } catch (err) {}
    open(data);
  });

  window.openCommander = open;
})();
