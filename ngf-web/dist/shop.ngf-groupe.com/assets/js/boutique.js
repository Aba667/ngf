/* ==========================================================================
   GROUPE NGF, Boutique
   Filtres, recherche, tri, panier persistant, commande WhatsApp.
   Dépend de products.js (CATEGORIES, PRODUCTS).
   ========================================================================== */

const WHATSAPP_NUMBER = "221785892986";
const CART_KEY = "ngf.cart.v1";

/* ---------- État --------------------------------------------------------- */
const state = {
  cat: "all",
  query: "",
  sort: "default",
  cart: loadCart(),
};

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    // On ne garde que les références encore au catalogue.
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([ref, qty]) => PRODUCTS.some((p) => p.ref === ref) && qty > 0
      )
    );
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  } catch {
    /* stockage indisponible (navigation privée) : le panier reste en mémoire */
  }
}

/* ---------- Sélecteurs --------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const grid = $("#grid");
const countEl = $("#result-count");
const emptyEl = $("#empty");
const filtersEl = $("#filters");
const searchEl = $("#search");
const sortEl = $("#sort");

const drawer = $("#cart-drawer");
const scrim = $("#scrim");
const cartLines = $("#cart-lines");
const cartEmpty = $("#cart-empty");
const cartCount = $("#cart-count");
const cartFoot = $("#cart-foot");
const devisField = $("#devis-produits");

/* ---------- Catégorie dans l'URL (#securite, #pompes, …) ------------------ */
const CAT_SLUGS = {
  "pompes": "Pompes",
  "bacs-conteneurs": "Bacs & Conteneurs",
  "palettes": "Palettes",
  "cordages": "Cordages",
  "fils": "Fils & ficelles",
  "filets": "Filets",
  "cables": "Câbles",
  "manilles": "Manilles",
  "poulies": "Poulies & réas",
  "emerillons": "Émerillons",
  "maillons": "Maillons & margouillets",
  "cosses": "Cosses & ridoirs",
  "crochets": "Crochets & anneaux de senne",
  "anneaux": "Anneaux",
  "chaines": "Chaînes & connecteurs",
  "manchons": "Manchons & terminaisons",
  "levage": "Levage & manutention",
  "aquaculture": "Aquaculture",
  "flotteurs": "Flotteurs & bouées",
  "anodes": "Anodes",
  "cerclage": "Cerclage",
  "securite": "Sécurité",
};

function slugOf(cat) {
  return Object.keys(CAT_SLUGS).find((k) => CAT_SLUGS[k] === cat) || "";
}

function applyHash() {
  const cat = CAT_SLUGS[location.hash.replace("#", "")];
  selectCategory(cat || "all", { fromHash: true });
  // Arrivée sur une catégorie (lien profond ou pied de page) : montrer le catalogue.
  if (cat) $(".shop-tools")?.scrollIntoView({ block: "start" });
}

function selectCategory(cat, opts = {}) {
  state.cat = cat;
  $$(".chip", filtersEl).forEach((c) => {
    const on = c.dataset.cat === cat;
    c.classList.toggle("is-active", on);
    c.setAttribute("aria-selected", String(on));
  });
  if (!opts.fromHash) {
    const slug = cat === "all" ? "" : slugOf(cat);
    try {
      history.replaceState(null, "", slug ? `#${slug}` : location.pathname);
    } catch {
      /* file:// : l'URL n'est pas réécrite, le filtre fonctionne quand même */
    }
  }
  render();
}

/* ---------- Filtres ------------------------------------------------------ */
function buildFilters() {
  const counts = PRODUCTS.reduce((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1;
    return acc;
  }, {});

  const chips = [["all", "Tout le catalogue", PRODUCTS.length]].concat(
    CATEGORIES.map((c) => [c, c, counts[c] || 0])
  );

  filtersEl.innerHTML = chips
    .map(
      ([value, label, n]) => `
      <button class="chip${value === "all" ? " is-active" : ""}"
              type="button" role="tab" data-cat="${escapeAttr(value)}"
              aria-selected="${value === "all"}">
        ${escapeHtml(label)} <span class="chip__n">${n}</span>
      </button>`
    )
    .join("");

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (btn) selectCategory(btn.dataset.cat);
  });
}

/* ---------- Familles -----------------------------------------------------
   Une famille = les modèles d'une même catégorie qui partagent la même photo.
   Plutôt que d'aligner dix vignettes identiques, on n'en montre qu'une : on
   ouvre la famille pour choisir son modèle sur ses caractéristiques.
   Le critère est la photo elle-même : dès qu'un modèle reçoit sa propre photo,
   il quitte la famille automatiquement, sans rien changer ici.              */

/* « Manille lyre galvanisée », « Manille droite inox » → « lyre galvanisée »,
   « droite inox ». On retire le mot commun à tous pour que la liste des
   variantes se lise sans répéter le nom de la famille à chaque ligne. */
function sansPrefixeCommun(noms) {
  if (noms.length < 2) return noms;
  const mots = noms.map((n) => n.split(" "));
  let k = 0;
  while (mots[0][k] && mots.every((m) => m[k] === mots[0][k]) && k < mots[0].length - 1) k++;
  if (!k) return noms;
  return mots.map((m) => {
    const s = m.slice(k).join(" ");
    return s.charAt(0).toLowerCase() + s.slice(1);
  });
}

/* Regroupe une liste de produits : renvoie des entrées
   { type:"produit", p } ou { type:"famille", cat, img, items }. */
function grouper(list) {
  const familles = new Map();
  const sortie = [];
  for (const p of list) {
    if (!p.img) {                       // « Photo à venir » : rien à regrouper
      sortie.push({ type: "produit", p });
      continue;
    }
    const cle = `${p.cat}|${p.img}`;
    if (!familles.has(cle)) {
      const f = { type: "famille", cat: p.cat, img: p.img, items: [] };
      familles.set(cle, f);
      sortie.push(f);
    }
    familles.get(cle).items.push(p);
  }
  // Une « famille » d'un seul modèle n'en est pas une : on la remet à plat.
  return sortie.map((e) =>
    e.type === "famille" && e.items.length === 1 ? { type: "produit", p: e.items[0] } : e
  );
}

/* Fourchette de prix d'une famille tarifée (les moteurs) : « de X à Y FCFA ». */
function fourchette(items) {
  const prix = items.map((p) => p.price).filter(Boolean);
  if (prix.length !== items.length || !prix.length) return null;
  const n = (s) => parseInt(String(s).replace(/\s/g, ""), 10);
  const tri = [...prix].sort((a, b) => n(a) - n(b));
  return tri[0] === tri[tri.length - 1] ? tri[0] : `${tri[0]} à ${tri[tri.length - 1]}`;
}

/* Normalise pour la recherche : minuscules + accents retirés, pour que « emerillon »
   trouve « émerillon » et l'inverse. */
function norm(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ---------- Rendu du catalogue ------------------------------------------- */
function visibleProducts() {
  // Recherche par MOTS : « gilet sauvetage » doit trouver « Gilet de Sauvetage »
  // (les mots n'ont pas besoin d'être adjacents). Chaque mot saisi doit apparaître
  // quelque part dans le nom, la description, la référence ou la catégorie.
  const mots = norm(state.query).split(/\s+/).filter(Boolean);
  let list = PRODUCTS.filter((p) => {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (!mots.length) return true;
    const foin = norm(`${p.name} ${p.desc} ${p.ref} ${p.cat}`);
    return mots.every((m) => foin.includes(m));
  });

  if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else if (state.sort === "ref") list = [...list].sort((a, b) => a.ref.localeCompare(b.ref));

  return list;
}

/* Visuel produit : photo si disponible, sinon tuile de catégorie (les gammes
   techniques n'ont pas toutes une photo, on évite l'image cassée). */
function productMedia(p) {
  if (p.img) {
    return `<img src="../assets/img/products/${escapeAttr(p.img)}" alt="${escapeAttr(p.name)}" loading="lazy" width="400" height="300">`;
  }
  return `<div class="pcard__ph" role="img" aria-label="${escapeAttr(p.name)} (photo à venir)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.6"/></svg>
      <span>Photo à venir</span>
    </div>`;
}

/* Les moteurs sont sur un domaine différent (ngf-groupe.com) que la boutique
   (shop.ngf-groupe.com) : on résout la fiche en absolu en prod, en relatif en local. */
function mainSiteURL(page) {
  const onProd = location.hostname.indexOf("ngf-groupe.com") !== -1;
  return (onProd ? "https://ngf-groupe.com/" : "../") + page;
}

function card(p) {
  const inCart = state.cart[p.ref] || 0;

  /* Produit tarifé (moteurs) : prix affiché + bouton Commander (choix WhatsApp/e-mail). */
  let foot;
  if (p.price) {
    const cmd = escapeAttr(JSON.stringify({ name: p.name.replace(/^Moteur\s+/i, ""), price: p.price }));
    foot = `
      <div class="pcard__price">${escapeHtml(p.price)} <span>FCFA</span></div>
      <div class="pcard__foot pcard__foot--order">
        <button class="btn btn--azure btn--sm" type="button" data-commander="${cmd}">Commander</button>
        ${p.fiche ? `<a class="pcard__fiche" href="${escapeAttr(mainSiteURL(p.fiche))}">Fiche technique</a>` : ""}
      </div>`;
  } else {
    foot = `
      <div class="pcard__foot">
        <button class="btn btn--azure btn--sm js-add" type="button" data-ref="${escapeAttr(p.ref)}">
          ${inCart ? `Dans ma demande (${inCart})` : "Ajouter à ma demande"}
        </button>
      </div>`;
  }

  return `
  <article class="pcard" data-ref="${escapeAttr(p.ref)}">
    <div class="pcard__media">
      ${productMedia(p)}
      ${p.flag ? `<span class="pcard__flag">${escapeHtml(p.flag)}</span>` : ""}
    </div>
    <div class="pcard__body">
      <span class="mono pcard__cat">${escapeHtml(p.cat)} · ${escapeHtml(p.ref)}</span>
      <h3 class="pcard__name">${escapeHtml(p.name)}</h3>
      <p class="pcard__desc">${escapeHtml(p.desc)}</p>
      ${foot}
    </div>
  </article>`;
}

/* Carte de famille : une seule vignette pour N modèles qui partagent la photo. */
function familyCard(f) {
  const n = f.items.length;
  const variantes = sansPrefixeCommun(f.items.map((p) => p.name));
  const apercu = variantes.slice(0, 3).join(", ");
  const reste = n - Math.min(3, n);
  const dansDemande = f.items.reduce((s, p) => s + (state.cart[p.ref] || 0), 0);
  const prix = fourchette(f.items);

  return `
  <article class="pcard pcard--fam" data-fam="${escapeAttr(f.cat + "|" + f.img)}">
    <div class="pcard__media">
      <img src="../assets/img/products/${escapeAttr(f.img)}" alt="${escapeAttr(f.cat)}" loading="lazy" width="400" height="300">
      <span class="pcard__flag pcard__flag--fam">${n} modèles</span>
    </div>
    <div class="pcard__body">
      <span class="mono pcard__cat">${escapeHtml(f.cat)}</span>
      <h3 class="pcard__name">${escapeHtml(f.cat)}</h3>
      <p class="pcard__desc">${escapeHtml(apercu)}${reste > 0 ? ` et ${reste} autre${reste > 1 ? "s" : ""}` : ""}.</p>
      ${prix ? `<div class="pcard__price pcard__price--fam">de ${escapeHtml(prix)} <span>FCFA</span></div>` : ""}
      <div class="pcard__foot">
        <button class="btn btn--azure btn--sm js-fam" type="button" data-fam="${escapeAttr(f.cat + "|" + f.img)}">
          Choisir un modèle
        </button>
        ${dansDemande ? `<span class="pcard__inlist">${dansDemande} dans ma demande</span>` : ""}
      </div>
    </div>
  </article>`;
}

function render() {
  const list = visibleProducts();
  // Pendant une recherche on ne regroupe pas : on cherche un modèle précis,
  // pas une famille. Les fiches sortent donc à plat.
  const entrees = state.query.trim() ? list.map((p) => ({ type: "produit", p })) : grouper(list);

  grid.innerHTML = entrees
    .map((e) => (e.type === "famille" ? familyCard(e) : card(e.p)))
    .join("");

  const nFam = entrees.filter((e) => e.type === "famille").length;
  countEl.textContent =
    list.length === 0
      ? "Aucun produit"
      : `${list.length} produit${list.length > 1 ? "s" : ""}` +
        (nFam ? ` · ${nFam} famille${nFam > 1 ? "s" : ""}` : "");
  emptyEl.hidden = list.length > 0;
  grid.hidden = list.length === 0;

  if (famOuverte) renderFamille(famOuverte);
}

/* ---------- Modale famille -----------------------------------------------
   Ouvre la liste des modèles d'une famille : c'est là qu'on choisit, et là que
   les specs constructeur (tailles, SWL, séries de références) départagent des
   modèles qui partagent la même photo.                                      */
let famOverlay = null;
let famOuverte = null;
let famLastFocus = null;

function buildFamOverlay() {
  famOverlay = document.createElement("div");
  famOverlay.className = "fam-overlay";
  famOverlay.setAttribute("role", "dialog");
  famOverlay.setAttribute("aria-modal", "true");
  famOverlay.setAttribute("aria-labelledby", "fam-titre");
  famOverlay.innerHTML = `
    <div class="fam-modal">
      <div class="fam-modal__head">
        <div>
          <span class="fam-modal__kicker" data-fam-cat></span>
          <h3 id="fam-titre" data-fam-titre></h3>
        </div>
        <button type="button" class="fam-modal__close" aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <ul class="fam-list" data-fam-list></ul>
    </div>`;
  document.body.appendChild(famOverlay);

  famOverlay.addEventListener("click", (e) => {
    if (e.target === famOverlay || e.target.closest(".fam-modal__close")) closeFamille();
    const add = e.target.closest(".js-add");
    if (add) addToCart(add.dataset.ref);
  });
}

function familleParCle(cle) {
  const [cat, img] = cle.split("|");
  const items = PRODUCTS.filter((p) => p.cat === cat && p.img === img);
  return items.length ? { type: "famille", cat, img, items } : null;
}

function renderFamille(cle) {
  const f = familleParCle(cle);
  if (!f) return closeFamille();
  const variantes = sansPrefixeCommun(f.items.map((p) => p.name));

  $("[data-fam-cat]", famOverlay).textContent = `${f.items.length} modèles`;
  $("[data-fam-titre]", famOverlay).textContent = f.cat;
  $("[data-fam-list]", famOverlay).innerHTML = f.items
    .map((p) => {
      const q = state.cart[p.ref] || 0;
      // Modèle tarifé (moteurs) : on garde son prix, son bouton Commander et sa
      // fiche technique, comme sur la carte individuelle.
      let action;
      if (p.price) {
        const cmd = escapeAttr(JSON.stringify({ name: p.name.replace(/^Moteur\s+/i, ""), price: p.price }));
        action = `
          <div class="fam-item__buy">
            <div class="fam-item__price">${escapeHtml(p.price)} <span>FCFA</span></div>
            <button class="btn btn--azure btn--sm" type="button" data-commander="${cmd}">Commander</button>
            ${p.fiche ? `<a class="fam-item__fiche" href="${escapeAttr(mainSiteURL(p.fiche))}">Fiche technique</a>` : ""}
          </div>`;
      } else {
        action = `
          <button class="btn btn--azure btn--sm js-add" type="button" data-ref="${escapeAttr(p.ref)}">
            ${q ? `Dans ma demande (${q})` : "Ajouter à ma demande"}
          </button>`;
      }
      return `
      <li class="fam-item${q ? " is-in" : ""}">
        <div class="fam-item__id">
          <strong>${escapeHtml(p.name)}</strong>
          <span class="mono">${escapeHtml(p.ref)}</span>
        </div>
        <p class="fam-item__desc">${escapeHtml(p.desc)}</p>
        ${action}
      </li>`;
    })
    .join("");
}

function openFamille(cle) {
  if (!famOverlay) buildFamOverlay();
  famLastFocus = document.activeElement;
  famOuverte = cle;
  renderFamille(cle);
  famOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
  $(".fam-modal__close", famOverlay)?.focus();
}

function closeFamille() {
  if (!famOverlay) return;
  famOverlay.classList.remove("open");
  famOuverte = null;
  document.body.style.overflow = "";
  famLastFocus?.focus();
}

/* ---------- Panier ------------------------------------------------------- */
function addToCart(ref) {
  state.cart[ref] = (state.cart[ref] || 0) + 1;
  saveCart();
  renderCart();
  render();
  flash(ref);
}

function setQty(ref, qty) {
  if (qty <= 0) delete state.cart[ref];
  else state.cart[ref] = qty;
  saveCart();
  renderCart();
  render();
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([ref, qty]) => ({ p: PRODUCTS.find((x) => x.ref === ref), qty }))
    .filter((e) => e.p);
}

function renderCart() {
  const entries = cartEntries();
  const units = entries.reduce((s, e) => s + e.qty, 0);

  cartCount.textContent = units;
  cartCount.hidden = units === 0;

  const empty = entries.length === 0;
  cartEmpty.hidden = !empty;
  cartFoot.hidden = empty;

  cartLines.innerHTML = entries
    .map(
      ({ p, qty }) => `
      <li class="cline">
        ${p.img
          ? `<img class="cline__img" src="../assets/img/products/${escapeAttr(p.img)}" alt="" loading="lazy">`
          : `<span class="cline__img cline__img--ph" aria-hidden="true"></span>`}
        <div class="cline__id">
          <strong>${escapeHtml(p.name)}</strong>
          <span class="mono">${escapeHtml(p.ref)}</span>
        </div>
        <div class="cline__qty">
          <button type="button" class="js-dec" data-ref="${escapeAttr(p.ref)}" aria-label="Retirer une unité de ${escapeAttr(p.name)}">−</button>
          <span aria-live="polite">${qty}</span>
          <button type="button" class="js-inc" data-ref="${escapeAttr(p.ref)}" aria-label="Ajouter une unité de ${escapeAttr(p.name)}">+</button>
        </div>
        <button type="button" class="cline__del js-del" data-ref="${escapeAttr(p.ref)}" aria-label="Supprimer ${escapeAttr(p.name)}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </li>`
    )
    .join("");

  if (devisField) devisField.value = cartText();
}

/* Liste lisible des articles, pour l'e-mail et WhatsApp */
function cartText() {
  return cartEntries()
    .map(({ p, qty }) => `${qty} × ${p.name} (réf. ${p.ref})`)
    .join("\n");
}

/* Le bouton peut être dans la grille ou dans la modale famille : on cherche
   dans tout le document, pas seulement dans #grid. */
function flash(ref) {
  const btn = document.querySelector(`.js-add[data-ref="${CSS.escape(ref)}"]`);
  if (!btn) return;
  btn.classList.add("is-flash");
  setTimeout(() => btn.classList.remove("is-flash"), 420);
}

/* ---------- Commande WhatsApp -------------------------------------------- */
function whatsappHref() {
  const entries = cartEntries();
  if (!entries.length) return "#";

  const message = [
    "Bonjour Groupe NGF,",
    "",
    "DEMANDE DE DEVIS. J'aimerais recevoir vos prix pour :",
    ...entries.map(({ p, qty }) => `• ${qty} × ${p.name} (réf. ${p.ref})`),
    "",
    "Merci de me confirmer prix et disponibilités.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- Tiroir panier ------------------------------------------------ */
let lastFocus = null;

function openCart() {
  lastFocus = document.activeElement;
  drawer.classList.add("is-open");
  scrim.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".cart__close", drawer)?.focus();
}

function closeCart() {
  drawer.classList.remove("is-open");
  scrim.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocus?.focus();
}

/* ---------- Échappement -------------------------------------------------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const escapeAttr = escapeHtml;

/* ---------- Barre d'outils collante --------------------------------------
   L'en-tête se rétracte au scroll (86px → 66px). On répercute sa hauteur
   réelle sur --header-h pour que la barre de filtres reste collée dessous
   sans laisser passer le contenu.                                          */
function syncHeaderHeight() {
  const header = $(".site-header");
  if (!header) return;
  const set = () =>
    document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
  set();
  new ResizeObserver(set).observe(header);
}

/* ---------- Câblage ------------------------------------------------------ */
syncHeaderHeight();
buildFilters();
applyHash();
renderCart();
window.addEventListener("hashchange", applyHash);

grid.addEventListener("click", (e) => {
  const fam = e.target.closest(".js-fam");
  if (fam) {
    openFamille(fam.dataset.fam);
    return;
  }
  const add = e.target.closest(".js-add");
  if (add) addToCart(add.dataset.ref);
});

cartLines.addEventListener("click", (e) => {
  const ref = e.target.closest("[data-ref]")?.dataset.ref;
  if (!ref) return;
  if (e.target.closest(".js-inc")) setQty(ref, (state.cart[ref] || 0) + 1);
  else if (e.target.closest(".js-dec")) setQty(ref, (state.cart[ref] || 0) - 1);
  else if (e.target.closest(".js-del")) setQty(ref, 0);
});

searchEl.addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

sortEl.addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

$$(".js-open-cart").forEach((b) => b.addEventListener("click", openCart));
$(".cart__close")?.addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  // La modale famille passe avant le tiroir : c'est elle qui est au-dessus.
  if (famOverlay?.classList.contains("open")) closeFamille();
  else if (drawer.classList.contains("is-open")) closeCart();
});

$("#cart-order")?.addEventListener("click", (e) => {
  const href = whatsappHref();
  if (href === "#") {
    e.preventDefault();
    return;
  }
  e.currentTarget.href = href;
});

/* --- Envoi de la demande de devis par e-mail ------------------------------ */
$("#cart-devis-form")?.addEventListener("submit", (e) => {
  if (!cartEntries().length) {
    e.preventDefault();
    return;
  }
  devisField.value = cartText();
});

/* Retour de devis-produits.php (?devis=ok|err) */
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get("devis") === "ok") {
    state.cart = {};
    saveCart();
    renderCart();
    render();
    const el = $("#flash-devis-ok");
    if (el) el.hidden = false;
  } else if (q.get("devis") === "err") {
    const el = $("#flash-devis-err");
    if (el) el.hidden = false;
  }
})();
