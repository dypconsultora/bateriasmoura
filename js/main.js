/* =================================================================
   BATERÍAS MOURA SAN ANDRÉS — main.js
   JS vanilla, sin dependencias. Maneja:
   1) Header sticky que cambia al scrollear
   2) Menú mobile
   3) Parallax liviano (requestAnimationFrame)
   4) Scroll reveal (IntersectionObserver)
   5) Botón flotante de WhatsApp
   6) Cierre del menú al navegar
   Respeta prefers-reduced-motion en todo momento.
   ================================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     1) HEADER STICKY — agrega .scrolled tras pasar 40px
     --------------------------------------------------------------- */
  const header = document.getElementById("site-header");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  /* ---------------------------------------------------------------
     2) MENÚ MOBILE
     --------------------------------------------------------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = menuToggle ? menuToggle.querySelector(".icon-open") : null;
  const iconClose = menuToggle ? menuToggle.querySelector(".icon-close") : null;

  function setMenu(open) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.toggle("hidden", !open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (iconOpen) iconOpen.classList.toggle("hidden", open);
    if (iconClose) iconClose.classList.toggle("hidden", !open);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });
    // Cerrar el menú al clickear cualquier link interno
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------------------------------------------------------------
     3) PARALLAX
     Ahora lo maneja ScrollSmoother (atributos data-speed) en
     js/animations.js. Acá ya no se hace parallax para no duplicar.
     --------------------------------------------------------------- */

  /* ---------------------------------------------------------------
     4) SCROLL REVEAL
     Los reveals ahora los maneja GSAP + ScrollTrigger (js/animations.js):
     hero timeline, stagger, count-up, etc. Acá no hacemos nada para no
     duplicar. Si GSAP no carga o hay reduced-motion, el contenido se ve
     en su estado final (lo resuelve styles.css quitando la clase gsap-on).
     --------------------------------------------------------------- */

  /* ---------------------------------------------------------------
     5) BOTÓN FLOTANTE DE WHATSAPP — aparece tras bajar un poco
     --------------------------------------------------------------- */
  const waFloat = document.getElementById("wa-float");
  function updateWaFloat() {
    if (!waFloat) return;
    waFloat.classList.toggle("visible", window.scrollY > 480);
  }

  /* ---------------------------------------------------------------
     SCROLL HANDLER ÚNICO (header + parallax + wa float)
     --------------------------------------------------------------- */
  function onScroll() {
    updateHeader();
    updateWaFloat();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------------------
     INICIALIZACIÓN
     --------------------------------------------------------------- */
  updateHeader();
  updateWaFloat();

  // Año dinámico del footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------
     7) CARRUSEL DE OPINIONES
     Muestra 4 tarjetas en desktop / 2 en tablet / 1 en mobile.
     Navega por "páginas", con dots, autoplay, pausa al hover y swipe.
     --------------------------------------------------------------- */
  (function initReviews() {
    const track = document.getElementById("reviews-track");
    if (!track) return;
    const cards = Array.prototype.slice.call(track.children);
    const total = cards.length;
    const prevBtn = document.getElementById("rev-prev");
    const nextBtn = document.getElementById("rev-next");
    const dotsWrap = document.getElementById("reviews-dots");
    const carousel = document.querySelector(".reviews-carousel");
    let index = 0, perView = 4, autoTimer = null;

    function computePerView() { const w = window.innerWidth; return w >= 1024 ? 4 : w >= 640 ? 2 : 1; }
    function maxIndex() { return Math.max(0, total - perView); }
    function pageCount() { return Math.ceil(total / perView); }
    function currentPage() { return Math.round(index / perView); }

    function step() {
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 20;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function update() {
      if (index > maxIndex()) index = maxIndex();
      if (index < 0) index = 0;
      track.style.transform = "translateX(" + (-index * step()) + "px)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === currentPage());
        d.setAttribute("aria-current", i === currentPage() ? "true" : "false");
      });
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      for (let i = 0; i < pageCount(); i++) {
        const b = document.createElement("button");
        b.className = "rev-dot"; b.type = "button";
        b.setAttribute("aria-label", "Ir al grupo " + (i + 1));
        b.addEventListener("click", function () { index = Math.min(i * perView, maxIndex()); update(); resetAuto(); });
        dotsWrap.appendChild(b);
      }
    }

    function goPage(delta) {
      const pc = pageCount();
      let p = currentPage() + delta;
      if (p < 0) p = pc - 1;        // loop al final
      if (p > pc - 1) p = 0;        // loop al inicio
      index = Math.min(p * perView, maxIndex());
      update();
    }

    function recalc() {
      const np = computePerView();
      if (np !== perView) { perView = np; buildDots(); }
      update();
    }

    function startAuto() { if (prefersReducedMotion || autoTimer) return; autoTimer = setInterval(function () { goPage(1); }, 5000); }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    if (prevBtn) prevBtn.addEventListener("click", function () { goPage(-1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goPage(1); resetAuto(); });

    if (carousel) {
      carousel.addEventListener("mouseenter", stopAuto);
      carousel.addEventListener("mouseleave", startAuto);
      carousel.addEventListener("focusin", stopAuto);
      carousel.addEventListener("focusout", startAuto);
    }

    // Swipe táctil
    let startX = 0, dragging = false;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; dragging = true; stopAuto(); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (!dragging) return; dragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) goPage(dx < 0 ? 1 : -1);
      startAuto();
    }, { passive: true });

    window.addEventListener("resize", recalc, { passive: true });

    perView = computePerView();
    buildDots();
    update();
    startAuto();
  })();

  /* ---------------------------------------------------------------
     5) Compatibilidades: la tarjeta centrada en pantalla pasa a color y el
        resto queda en B/N (igual que el :hover de escritorio, pero al
        scrollear). El CSS (@media hover:none) hace que esto SÓLO se vea en
        touch; en escritorio manda el :hover.
     --------------------------------------------------------------- */
  var compatCards = Array.prototype.slice.call(document.querySelectorAll("#compatibilidades .compat-card"));
  if (compatCards.length) {
    var compatTick = false;
    var spyCompat = function () {
      compatTick = false;
      var mid = window.innerHeight / 2, best = -1, bestD = Infinity;
      compatCards.forEach(function (c, i) {
        var r = c.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return; // fuera de pantalla
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      compatCards.forEach(function (c, i) { c.classList.toggle("is-colored", i === best); });
    };
    window.addEventListener("scroll", function () {
      if (!compatTick) { compatTick = true; requestAnimationFrame(spyCompat); }
    }, { passive: true });
    spyCompat();
  }
})();
