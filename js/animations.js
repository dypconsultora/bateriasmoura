/* =================================================================
   BATERÍAS MOURA SAN ANDRÉS — animations.js
   Animaciones con GSAP + ScrollTrigger (cargados por CDN antes que
   este archivo). Se agregan ENCIMA del diseño: no cambian contenido,
   enlaces ni SEO.

   Buenas prácticas aplicadas:
   - Respeta prefers-reduced-motion (muestra todo en estado final).
   - Anima SOLO transform y opacity (sin layout shift / CLS).
   - ScrollTrigger con once:true en los reveals (no se repiten).
   - Ajustá la intensidad desde el objeto CFG de abajo.
   ================================================================= */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Si GSAP no cargó o el usuario pidió menos movimiento: quitamos
     'gsap-on' (todo se ve en su estado final) y salimos. */
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    docEl.classList.remove("gsap-on");
    return;
  }

  /* ===================== CONFIG — ajustá la intensidad acá ===================== */
  var CFG = {
    duration:      0.9,           // duración base de los fades (s)
    ease:          "power3.out",  // easing base
    fadeY:         44,            // distancia del fade-up en desktop (px)
    fadeYMobile:   24,            // distancia del fade-up en mobile (px)
    stagger:       0.12,          // separación entre elementos en cascada (s)
    start:         "top 85%",     // cuándo dispara el reveal al scrollear
    countDuration: 1.8,           // duración del conteo de los números (s)
    waPulse:       true,          // latido del botón de WhatsApp (true/false)
    waPulseEvery:  2.6            // pausa entre latidos del WhatsApp (s)
  };

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: CFG.duration, ease: CFG.ease });

  // Distancia del fade según el ancho (se calcula una vez al cargar).
  var DIST = window.innerWidth < 768 ? CFG.fadeYMobile : CFG.fadeY;

  /* Reveal reutilizable. Usa una clase .anim-prep para apagar la
     transición CSS durante el movimiento (así no pelea con el hover),
     y limpia el transform al terminar para no romper estados :hover. */
  function reveal(targets, opts) {
    opts = opts || {};
    gsap.utils.toArray(targets).forEach(function (el, i) {
      el.classList.add("anim-prep");
      gsap.from(el, {
        opacity: 0,
        y: opts.y != null ? opts.y : DIST,
        duration: opts.duration || CFG.duration,
        ease: opts.ease || CFG.ease,
        delay: (opts.stagger != null ? opts.stagger : 0) * i,
        clearProps: "transform",
        scrollTrigger: { trigger: opts.trigger || el, start: opts.start || CFG.start, once: true },
        onComplete: function () { el.classList.remove("anim-prep"); }
      });
    });
  }

  /* Antes de contar, dejamos los números en 0 (pasa off-screen, sin flash). */
  gsap.utils.toArray(".stat-count").forEach(function (el) {
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    el.textContent = (0).toFixed(dec);
  });

  /* ---------------------------------------------------------------
     HERO — timeline de entrada al cargar la página
     --------------------------------------------------------------- */
  var heroTl = gsap.timeline({ defaults: { ease: CFG.ease } });
  heroTl
    .fromTo('[data-hero="badge"]',
      { opacity: 0, scale: 0.8, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.7)" })
    .fromTo('[data-hero="title"]',
      { opacity: 0, y: DIST },
      { opacity: 1, y: 0, duration: 0.9 }, "-=0.15")
    .fromTo('[data-hero="subtitle"]',
      { opacity: 0, y: DIST * 0.7 },
      { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
    .fromTo('[data-hero="photo"]',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.9, clearProps: "transform" }, "-=0.7")
    .fromTo(['[data-hero="cta"]', '[data-hero="rating"]'],
      { opacity: 0, y: DIST * 0.6 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.5")
    .fromTo(".hero-badge",
      { opacity: 0, x: -28, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)",
        onComplete: function () {
          gsap.set(".hero-badge", { clearProps: "transform" });
          var b = document.querySelector(".hero-badge");
          if (b) b.classList.add("is-live"); // arranca el floaty + glow
        }
      }, "-=0.35");

  /* ---------------------------------------------------------------
     DIFERENCIALES — stagger
     --------------------------------------------------------------- */
  reveal("#diferenciales .diff-item", { trigger: "#diferenciales", start: "top 80%", stagger: 0.08, y: DIST * 0.6 });

  /* ---------------------------------------------------------------
     NOSOTROS — reveal de columnas + count-up (lo que más se luce)
     --------------------------------------------------------------- */
  reveal("#nosotros > div > div", { trigger: "#nosotros", stagger: 0.15 });

  ScrollTrigger.create({
    trigger: "#nosotros",
    start: "top 70%",
    once: true,
    onEnter: function () {
      gsap.utils.toArray("#nosotros .stat-count").forEach(function (el) {
        var to = parseFloat(el.getAttribute("data-to")) || 0;
        var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
        var obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: CFG.countDuration,
          ease: "power2.out",
          onUpdate: function () { el.textContent = obj.v.toFixed(dec); }
        });
      });
    }
  });

  /* ---------------------------------------------------------------
     SERVICIOS — header + cards en stagger + realce de los números
     --------------------------------------------------------------- */
  reveal("#servicios .max-w-2xl", { trigger: "#servicios" });

  gsap.utils.toArray("#servicios .service-card").forEach(function (card, i) {
    card.classList.add("anim-prep");
    gsap.from(card, {
      opacity: 0, y: DIST, delay: i * CFG.stagger,
      clearProps: "transform",
      scrollTrigger: { trigger: "#servicios", start: CFG.start, once: true },
      onComplete: function () { card.classList.remove("anim-prep"); }
    });
    // Realce extra del número grande 01/02/03 (scale pop).
    var step = card.querySelector(".service-step");
    if (step) {
      gsap.from(step, {
        opacity: 0, scale: 0.4, y: 8,
        duration: 0.8, delay: i * CFG.stagger + 0.15, ease: "back.out(1.8)",
        clearProps: "transform",
        scrollTrigger: { trigger: "#servicios", start: CFG.start, once: true },
        onStart: function () { step.style.transition = "none"; },
        onComplete: function () { step.style.transition = ""; }
      });
    }
  });

  /* ---------------------------------------------------------------
     BANDA "A DOMICILIO"
     --------------------------------------------------------------- */
  reveal(".domicilio-band [data-reveal]", { trigger: ".domicilio-band", start: "top 75%" });

  /* ---------------------------------------------------------------
     OPINIONES — header, badge con realce y tarjetas en stagger
     --------------------------------------------------------------- */
  reveal("#opiniones .max-w-2xl", { trigger: "#opiniones" });

  var revBadge = document.querySelector("#opiniones .reviews-badge");
  if (revBadge) {
    gsap.from(revBadge, {
      opacity: 0, scale: 0.85,
      duration: 0.7, ease: "back.out(1.7)",
      clearProps: "transform",
      scrollTrigger: { trigger: "#opiniones", start: CFG.start, once: true }
    });
  }

  gsap.utils.toArray("#opiniones .review-card").forEach(function (card, i) {
    card.classList.add("anim-prep");
    gsap.from(card, {
      opacity: 0, y: DIST, delay: i * 0.1,
      clearProps: "transform",
      scrollTrigger: { trigger: ".reviews-carousel", start: CFG.start, once: true },
      onComplete: function () { card.classList.remove("anim-prep"); }
    });
  });

  reveal("#opiniones .text-center", { trigger: "#opiniones .text-center", start: "top 90%" });

  /* ---------------------------------------------------------------
     CONTACTO — bloque + tarjetas + mapa
     --------------------------------------------------------------- */
  reveal("#contacto .max-w-2xl", { trigger: "#contacto" });
  reveal("#contacto .contact-card", { trigger: "#contacto", stagger: 0.1, y: DIST * 0.6 });
  reveal("#contacto .map-frame", { trigger: "#contacto" });

  /* ---------------------------------------------------------------
     BOTÓN FLOTANTE DE WHATSAPP — latido sutil y espaciado
     (se apaga con CFG.waPulse = false o con reduced-motion)
     --------------------------------------------------------------- */
  if (CFG.waPulse) {
    var pulse = document.querySelector(".wa-float-pulse");
    if (pulse) {
      gsap.set(pulse, { scale: 1, opacity: 0.5 });
      gsap.to(pulse, {
        scale: 1.9, opacity: 0,
        duration: 1.4, ease: "power1.out",
        repeat: -1, repeatDelay: CFG.waPulseEvery
      });
    }
  }

  /* Recalcular posiciones cuando terminen de cargar imágenes/fuentes. */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
