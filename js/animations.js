/* =================================================================
   BATERÍAS MOURA SAN ANDRÉS — animations.js  (GSAP 2.0)
   GSAP + ScrollTrigger + ScrollSmoother + SplitText (CDN 3.13).
   Enfoque moderno: scroll suave, reveals cinemáticos, count-up con
   blur, botones magnéticos, marquee, tilt 3D, clip-path/SplitText.

   Reglas: respeta prefers-reduced-motion (todo en estado final),
   anima sobre todo transform/opacity (clip-path/filter solo donde
   se pidió, sin CLS), once:true en reveals, y baja intensidades /
   desactiva smoother·parallax·tilt·magnético en mobile.
   Ajustá TODO desde el objeto CFG de abajo.
   ================================================================= */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sin GSAP base o con reduced-motion → todo en estado final y salimos.
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    docEl.classList.remove("gsap-on");
    return;
  }

  /* ===================== CONFIG — tuneá la intensidad acá ===================== */
  var CFG = {
    duration:        0.9,            // duración base de los fades (s)
    ease:            "power3.out",   // easing base
    fadeY:           48,             // distancia fade-up desktop (px)
    fadeYMobile:     26,             // distancia fade-up mobile (px)
    stagger:         0.12,           // separación en cascada (s)
    start:           "top 85%",      // disparo de los reveals
    smooth:          1.15,           // inercia de ScrollSmoother (0 = off)
    heroWordDur:     0.9,            // duración de cada palabra del título
    heroWordStagger: 0.055,          // cascada palabra x palabra
    heroPhotoClip:   1.1,            // duración del clip-path reveal de la foto
    kenBurns:        14,             // zoom lento infinito de la foto (s)
    countDuration:   1.9,            // duración del count-up (s)
    magnetStrength:  0.32,           // cuánto sigue el botón al cursor
    tiltMax:         9,              // grados de tilt 3D en opiniones
    marqueeSeconds:  26,             // s por vuelta del marquee
    wipeDuration:    0.9,            // wipe de los títulos de sección
    waPulse:         true,           // latido del WhatsApp (true/false)
    waPulseEvery:    2.6             // pausa entre latidos (s)
  };

  gsap.registerPlugin(ScrollTrigger);
  if (window.ScrollSmoother) gsap.registerPlugin(ScrollSmoother);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  gsap.defaults({ duration: CFG.duration, ease: CFG.ease });

  var isMobile = window.matchMedia("(max-width: 767px)").matches;
  var isTouch  = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var DIST     = isMobile ? CFG.fadeYMobile : CFG.fadeY;

  /* ---------------------------------------------------------------
     1) SCROLL SUAVE (ScrollSmoother) — desktop. Mobile: scroll nativo.
     --------------------------------------------------------------- */
  var smoother = null;
  if (window.ScrollSmoother && !isMobile) {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: CFG.smooth,
      effects: true,        // habilita el parallax por data-speed
      smoothTouch: 0
    });
    docEl.style.scrollBehavior = "auto"; // el smoother maneja el scroll
    // Links internos: scroll suave vía smoother (no rompe WhatsApp/tel/mapa)
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); smoother.scrollTo(target, true, "top 80px"); }
      });
    });
  }

  /* ---------------------------------------------------------------
     2) BARRA DE PROGRESO DE SCROLL
     --------------------------------------------------------------- */
  gsap.set("#scroll-progress", { scaleX: 0 });
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: function (self) { gsap.set("#scroll-progress", { scaleX: self.progress }); }
  });

  /* ---------------------------------------------------------------
     Helpers de reveal
     --------------------------------------------------------------- */
  // Fade-up genérico (apaga la transición CSS durante el movimiento).
  function reveal(targets, opts) {
    opts = opts || {};
    gsap.utils.toArray(targets).forEach(function (el, i) {
      el.classList.add("anim-prep");
      gsap.from(el, {
        autoAlpha: 0,
        y: opts.y != null ? opts.y : DIST,
        duration: opts.duration || CFG.duration,
        ease: opts.ease || CFG.ease,
        delay: (opts.stagger != null ? opts.stagger : 0) * i,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: opts.trigger || el, start: opts.start || CFG.start, once: true },
        onComplete: function () { el.classList.remove("anim-prep"); }
      });
    });
  }

  /* ---------------------------------------------------------------
     3) HERO — entrada cinemática (SplitText + clip-path + Ken Burns)
     --------------------------------------------------------------- */
  var title = document.querySelector('[data-hero="title"]');
  var heroTl = gsap.timeline({ defaults: { ease: CFG.ease } });

  // Título palabra por palabra subiendo detrás de una máscara.
  if (window.SplitText && title) {
    var split = SplitText.create(title, { type: "words", mask: "words" });
    gsap.set(title, { autoAlpha: 1 });
    heroTl.from(split.words, {
      yPercent: 120, duration: CFG.heroWordDur, ease: "power4.out",
      stagger: CFG.heroWordStagger
    }, 0.1);
  } else if (title) {
    heroTl.fromTo(title, { autoAlpha: 0, y: DIST }, { autoAlpha: 1, y: 0 }, 0.1);
  }

  // Estos elementos arrancan ocultos por CSS (gsap-on) → fromTo con destino
  // explícito autoAlpha:1 (un .from() animaría de 0 a 0 y quedarían ocultos).
  heroTl
    .fromTo('[data-hero="badge"]', { autoAlpha: 0, scale: 0.8, y: 8 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, 0)
    .to('.hero-photo', { clipPath: "inset(0 0% 0 0 round 24px)", duration: CFG.heroPhotoClip, ease: "power3.inOut" }, 0.3)
    .fromTo('[data-hero="photo"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.3)
    .fromTo('[data-hero="subtitle"]', { autoAlpha: 0, y: DIST * 0.7 },
      { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.8")
    .fromTo(['[data-hero="cta"]', '[data-hero="rating"]'], { autoAlpha: 0, y: DIST * 0.6 },
      { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.55")
    .fromTo('.hero-badge', { autoAlpha: 0, x: -28, scale: 0.9 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)",
        onComplete: function () {
          gsap.set(".hero-badge", { clearProps: "transform" });
          var b = document.querySelector(".hero-badge");
          if (b) b.classList.add("is-live"); // arranca floaty + glow
        }
      }, "-=0.4");

  // Ken Burns continuo (zoom lento infinito) sobre la imagen.
  if (!isMobile) {
    gsap.to(".hero-photo-img", { scale: 1.12, duration: CFG.kenBurns, ease: "sine.inOut", repeat: -1, yoyo: true });
  }

  /* ---------------------------------------------------------------
     4) TÍTULOS DE SECCIÓN — reveal tipo "wipe" (máscara)
     --------------------------------------------------------------- */
  gsap.utils.toArray(".section-title, .section-title-light").forEach(function (t) {
    gsap.to(t, {
      clipPath: "inset(0 0% 0 0)",
      duration: CFG.wipeDuration, ease: "power3.inOut",
      scrollTrigger: { trigger: t, start: "top 85%", once: true }
    });
  });

  /* ---------------------------------------------------------------
     5) BOTONES MAGNÉTICOS (desktop / no-touch)
     --------------------------------------------------------------- */
  if (!isTouch) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      var xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      var yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * CFG.magnetStrength);
        yTo((e.clientY - (r.top + r.height / 2)) * CFG.magnetStrength);
      });
      btn.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------------------------------------------------------
     6) DIFERENCIALES — marquee infinito
     --------------------------------------------------------------- */
  function makeMarquee(id, seconds, reverse) {
    var track = document.getElementById(id);
    if (!track) return;
    // Clonamos el set para un loop sin cortes.
    Array.prototype.slice.call(track.children).forEach(function (it) {
      var c = it.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c);
    });
    gsap.set(track, { xPercent: reverse ? -50 : 0 });
    var loop = gsap.to(track, { xPercent: reverse ? 0 : -50, duration: seconds, ease: "none", repeat: -1 });
    var box = track.parentNode;
    box.addEventListener("mouseenter", function () { gsap.to(loop, { timeScale: 0.25, duration: 0.4 }); });
    box.addEventListener("mouseleave", function () { gsap.to(loop, { timeScale: 1, duration: 0.4 }); });
  }
  makeMarquee("diff-marquee", CFG.marqueeSeconds, false);
  makeMarquee("brand-marquee", CFG.marqueeSeconds * 1.35, true); // marcas: más lento y en sentido opuesto

  /* ---------------------------------------------------------------
     7) NOSOTROS — reveal de columnas + count-up con blur
     --------------------------------------------------------------- */
  reveal("#nosotros > div > div", { trigger: "#nosotros", stagger: 0.15 });

  // Dejamos los números en 0 (off-screen, sin flash).
  gsap.utils.toArray(".stat-count").forEach(function (el) {
    el.textContent = (0).toFixed(parseInt(el.getAttribute("data-dec") || "0", 10));
  });

  ScrollTrigger.create({
    trigger: "#nosotros", start: "top 70%", once: true,
    onEnter: function () {
      gsap.utils.toArray("#nosotros .stat-count").forEach(function (el) {
        var to = parseFloat(el.getAttribute("data-to")) || 0;
        var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
        var obj = { v: 0 };
        gsap.to(obj, {
          v: to, duration: CFG.countDuration, ease: "power2.out",
          onUpdate: function () { el.textContent = obj.v.toFixed(dec); }
        });
        // Blur que se va aclarando mientras sube el número.
        gsap.fromTo(el, { filter: "blur(9px)", opacity: 0.35 },
          { filter: "blur(0px)", opacity: 1, duration: CFG.countDuration * 0.85, ease: "power2.out" });
      });
    }
  });

  /* ---------------------------------------------------------------
     MARCAS — reveal del encabezado (el carrusel se mueve solo)
     --------------------------------------------------------------- */
  reveal(".ps-banner", { trigger: ".ps-banner", start: "top 86%" });
  reveal("#marcas .text-center", { trigger: "#marcas", start: "top 85%" });

  /* ---------------------------------------------------------------
     8) SERVICIOS — cards con rotación/skew + números grandes
     --------------------------------------------------------------- */
  reveal("#servicios .max-w-2xl", { trigger: "#servicios" });

  gsap.utils.toArray("#servicios .service-card").forEach(function (card, i) {
    card.classList.add("anim-prep");
    // Entrada: en mobile cada card entra desde un costado alternado (1ª izq, 2ª
    // der, 3ª izq) al aparecer; en desktop, el rotate/skew de siempre.
    var fromVars = isMobile
      ? { autoAlpha: 0, x: (i % 2 === 0 ? -1 : 1) * 45 }
      : { autoAlpha: 0, y: DIST, rotateZ: i % 2 ? 2.5 : -2.5, skewY: 2, transformPerspective: 800 };
    fromVars.duration = CFG.duration;
    fromVars.ease = CFG.ease;
    fromVars.delay = isMobile ? 0 : i * CFG.stagger;
    fromVars.clearProps = "transform,opacity,visibility";
    fromVars.scrollTrigger = { trigger: isMobile ? card : "#servicios", start: CFG.start, once: true };
    fromVars.onComplete = function () { card.classList.remove("anim-prep"); };
    gsap.from(card, fromVars);

    var step = card.querySelector(".service-step");
    if (step) {
      gsap.from(step, {
        autoAlpha: 0, scale: 0.3, duration: 0.9, delay: (isMobile ? 0 : i * CFG.stagger) + 0.15, ease: "back.out(2)",
        clearProps: "transform", transformOrigin: "top right",
        scrollTrigger: { trigger: isMobile ? card : "#servicios", start: CFG.start, once: true },
        onStart: function () { step.style.transition = "none"; },
        onComplete: function () { step.style.transition = ""; }
      });
    }
  });

  /* En mobile, el efecto "seleccionado" (el del hover) se mueve solo a medida que
     scrolleás: se marca el card que queda centrado en pantalla. Y si tocás uno,
     pasa a ese. En desktop esto lo maneja el hover. */
  if (isMobile) {
    var svcCards = gsap.utils.toArray("#servicios .service-card");
    var setActiveSvc = function (idx) {
      svcCards.forEach(function (c, j) { c.classList.toggle("is-active", j === idx); });
    };
    var spySvc = function () {
      var mid = window.innerHeight / 2, best = -1, bestD = Infinity;
      svcCards.forEach(function (c, j) {
        var r = c.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return; // fuera de pantalla
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = j; }
      });
      if (best >= 0) setActiveSvc(best);
    };
    ScrollTrigger.create({ trigger: "#servicios", start: "top bottom", end: "bottom top", onUpdate: spySvc });
    svcCards.forEach(function (c, j) {
      c.addEventListener("click", function () { setActiveSvc(j); });
    });
    spySvc();
  }

  /* ---------------------------------------------------------------
     9) BANDA "A DOMICILIO" — entrada en cascada + PIN "cover": se fija
        bajo el header y la sección de abajo (Opiniones, opaca) la tapa
        al scrollear, mientras queda fija.
     --------------------------------------------------------------- */
  var domBand = document.querySelector(".domicilio-band");
  if (domBand) {
    // Entrada: eyebrow → título → texto → botón suben en cascada.
    var domKids = gsap.utils.toArray(domBand.querySelectorAll("[data-reveal] > *"));
    gsap.from(domKids, {
      autoAlpha: 0, y: 46, duration: 0.95, ease: "power3.out", stagger: 0.13,
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: domBand, start: "top 78%", once: true }
    });
    // Zoom-out suave del fondo al aparecer.
    var domBg = domBand.querySelector(".domicilio-bg");
    if (domBg) {
      gsap.from(domBg, {
        scale: 1.16, duration: 1.7, ease: "power2.out",
        scrollTrigger: { trigger: domBand, start: "top 88%", once: true }
      });
    }
    // PIN: el banner se fija a 58px del borde (justo bajo el header) y se
    // mantiene fijo mientras Opiniones sube y lo tapa. pinSpacing:false =
    // no reserva espacio, así la sección de abajo lo cubre.
    ScrollTrigger.create({
      trigger: domBand,
      start: "top 58",
      end: function () { return "+=" + domBand.offsetHeight; },
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true
    });
  }

  /* ---------------------------------------------------------------
     10) OPINIONES — reveal 3D + badge + tilt al hover
     --------------------------------------------------------------- */
  reveal("#opiniones .max-w-2xl", { trigger: "#opiniones" });

  var revBadge = document.querySelector("#opiniones .reviews-badge");
  if (revBadge) {
    gsap.from(revBadge, {
      autoAlpha: 0, scale: 0.85, duration: 0.7, ease: "back.out(1.7)", clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: "#opiniones", start: CFG.start, once: true }
    });
  }

  gsap.utils.toArray("#opiniones .review-card").forEach(function (card, i) {
    card.classList.add("anim-prep");
    gsap.from(card, {
      autoAlpha: 0, y: DIST, rotateX: -14, z: -70, transformPerspective: 900, transformOrigin: "center bottom",
      duration: CFG.duration, delay: (i % 4) * 0.1, clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: ".reviews-carousel", start: CFG.start, once: true },
      onComplete: function () { card.classList.remove("anim-prep"); }
    });
  });

  // Tilt 3D siguiendo el mouse (desktop / no-touch).
  if (!isTouch) {
    gsap.utils.toArray("#opiniones .review-card").forEach(function (card) {
      var rX = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power2.out" });
      var rY = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power2.out" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        rY(((e.clientX - r.left) / r.width - 0.5) * CFG.tiltMax * 2);
        rX(-((e.clientY - r.top) / r.height - 0.5) * CFG.tiltMax * 2);
      });
      card.addEventListener("mouseleave", function () { rX(0); rY(0); });
    });
  }

  reveal("#opiniones .text-center", { trigger: "#opiniones .text-center", start: "top 90%" });

  /* ---------------------------------------------------------------
     FAQ — cada pregunta entra desde un costado alternado
     (1ª desde la izquierda, 2ª derecha, 3ª izquierda...) al aparecer
     en pantalla. Funciona en desktop y mobile (con menos distancia).
     --------------------------------------------------------------- */
  gsap.utils.toArray("#faq .faq-item").forEach(function (item, i) {
    item.classList.add("anim-prep");
    gsap.from(item, {
      autoAlpha: 0,
      x: (i % 2 === 0 ? -1 : 1) * (isMobile ? 45 : 90),
      duration: CFG.duration,
      ease: CFG.ease,
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: item, start: "top 88%", once: true },
      onComplete: function () { item.classList.remove("anim-prep"); }
    });
  });

  /* ---------------------------------------------------------------
     11) CONTACTO
     --------------------------------------------------------------- */
  reveal("#contacto .max-w-2xl", { trigger: "#contacto" });
  reveal("#contacto .contact-card", { trigger: "#contacto", stagger: 0.1, y: DIST * 0.6 });
  reveal("#contacto .map-frame", { trigger: "#contacto" });

  /* ---------------------------------------------------------------
     12) WHATSAPP FLOTANTE — latido sutil y espaciado
     (la entrada con bounce ya la hace el CSS al aparecer)
     --------------------------------------------------------------- */
  if (CFG.waPulse) {
    var pulse = document.querySelector(".wa-float-pulse");
    if (pulse) {
      gsap.set(pulse, { scale: 1, opacity: 0.5 });
      gsap.to(pulse, { scale: 1.9, opacity: 0, duration: 1.4, ease: "power1.out", repeat: -1, repeatDelay: CFG.waPulseEvery });
    }
  }

  /* Recalcular tras cargar imágenes/fuentes. */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
