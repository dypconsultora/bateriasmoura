# Baterías Moura San Andrés — Nota de diseño y entrega

Landing page de una sola página, **HTML + Tailwind (CDN) + JS vanilla**. Sin build, lista para subir a cualquier hosting estático.

---

## 🎨 Paleta — "Energía Moura"

Generada con la skill **ui-ux-pro-max** (patrón *Funnel 3-Step* + estilo *Trust & Authority*) y **ajustada a la identidad real de la marca** (el logo es batería azul + rayo amarillo). Se descartó el rojo genérico que sugería la búsqueda automotor porque no es el color de Moura.

| Rol | HEX | Dónde se usa |
|-----|-----|--------------|
| Carbón (base) | `#0B1220` | Fondo del hero y secciones oscuras premium |
| Navy panel | `#0F1B33` | Header sólido, franja de diferenciales, footer |
| Azul Moura | `#2563EB` | Color de marca: links, detalles, botón "Ver opiniones" |
| Amarillo energía | `#FACC15` | El "rayo": acentos, "SIN CARGO", íconos hover |
| WhatsApp | `#25D366` | **Todos los CTA de conversión** |
| Surface claro | `#F8FAFC` | Secciones de contenido legible |

> Para cambiar toda la paleta, editá los HEX en **`index.html`** (bloque `tailwind.config`) y en **`css/styles.css`** (`:root`).

## 🔤 Tipografía — "Geometric Modern"

- **Títulos:** Outfit (geométrica, moderna, distintiva)
- **Cuerpo:** Work Sans (legible para todo público, incluidos clientes mayores)

Se descartó la sugerencia literal de la skill (EB Garamond + Lato, serif "de estudio de abogados") por no encajar con el pedido de algo *moderno y premium*.

---

## 🖼️ Imágenes

Todas optimizadas a **WebP** con `lazy-loading`. Originales guardados en `assets/raw/` por si se necesitan.

| Archivo en uso | Origen | Estado |
|----------------|--------|--------|
| `logo.webp` / `logo.png` | Logo oficial | ✅ Bien |
| `hero-mecanico.webp` | Mecánico midiendo la batería (hero) | ✅ **Reemplazada** por una foto limpia y profesional (sin texto quemado). Encuadre vía `background-position` en `.hero-photo-img` |
| `local.webp` | Collage del local (sección Nosotros) | 🔴 Es un collage de baja resolución — **reemplazar por 2-3 fotos sueltas y nítidas del local y de un cambio real** |
| `domicilio.webp` | Auto en ruta + WhatsApp (banda parallax) | 🟡 Stock con número quemado — **reemplazar por foto propia de un cambio a domicilio** |
| `google-reviews.webp` | Logo Google Reviews 5★ | ✅ Bien |

**Disponibles sin usar** (placas de marketing con texto quemado, quedaron fuera del diseño premium): `promo-bateria.webp`, `promo-instalacion.webp`.

### Recomendación de fotos a sacar (para llevar el sitio a 10/10)
1. Técnico/equipo haciendo un cambio a domicilio (horizontal y vertical), sin texto encima.
2. Frente del local "a la calle".
3. 2-3 baterías Moura en primer plano.
4. Foto de un cambio real (manos + batería + auto).

---

## ✅ Pre-delivery checklist (anti-patrones de la skill)

- [x] **Sin emojis como íconos** — todo en SVG (el rayo ⚡ se reemplazó por SVG)
- [x] **`cursor-pointer`** en todo lo clickeable (links y botones nativos)
- [x] **Hover states** con transiciones suaves (150-300ms) en botones y cards
- [x] **Contraste** texto ≥ 4.5:1 en modo claro (texto crítico en `#0F172A`)
- [x] **Focus visible** para navegación por teclado (outline amarillo) + skip-link
- [x] **`prefers-reduced-motion`** respetado (desactiva parallax y animaciones)
- [x] **Responsive** verificado a 390 / 768 / 1024 / 1440 px
- [x] **Contacto siempre visible** (no oculto) — WhatsApp en 6 puntos + botón flotante
- [x] **Sin errores de JS** en consola (verificado con DevTools)

## ✨ Animaciones (GSAP 3.13 + ScrollTrigger + ScrollSmoother + SplitText)

En `js/animations.js` (CDN al final del body). **Toda la intensidad se ajusta desde el objeto `CFG`** al inicio: duración, easing, distancias, stagger, `smooth` (inercia), Ken Burns, count, fuerza magnética, tilt, segundos del marquee, wipe y el latido del WhatsApp.

- **Scroll suave global** con ScrollSmoother (inercia leve). Requiere el wrapper `#smooth-wrapper > #smooth-content` (header, barra de progreso y WhatsApp quedan afuera, son `fixed`). Desactivado en mobile.
- **Barra de progreso** de scroll arriba de todo (degradado azul→amarillo).
- **Hero cinemático**: título con **SplitText** palabra por palabra subiendo detrás de una máscara; badge/subtítulo/CTAs/rating en cascada; la foto entra con **clip-path reveal** + **Ken Burns** (zoom lento infinito) + parallax (`data-speed`).
- **Botones CTA magnéticos** (siguen al cursor) — solo desktop/no-touch.
- **Nosotros**: **count-up** (20 / 4.9 / $0) con **blur** que se aclara.
- **Servicios**: cards con rotación/skew + números 01/02/03 con scale marcado.
- **Diferenciales**: **marquee infinito** (cinta), pausa al hover.
- **Opiniones**: cards con desplazamiento 3D + **tilt** siguiendo el mouse (desktop).
- **Títulos de sección**: reveal tipo **wipe** (clip-path).
- **WhatsApp**: entrada con bounce + latido sutil y espaciado.
- **Reglas respetadas**: sobre todo `transform`/`opacity` (clip-path/filter solo donde se pidió, sin CLS); `ScrollTrigger` con `once:true`; en mobile se bajan intensidades y se apagan smoother/parallax/tilt/magnético; **`prefers-reduced-motion`** → todo en estado final, sin movimiento ni marquee ni latido. Si GSAP no carga, el contenido se ve igual (degradación segura).
- **Parallax**: ahora vía `data-speed` de ScrollSmoother (ya no en `main.js`).

## ⚙️ Efectos implementados

- **Parallax en capas**: hero (glow + grilla + rayo a 3 velocidades) y banda "A domicilio" (foto de fondo). JS liviano con `requestAnimationFrame` + `translate3d` (GPU).
- **Scroll reveal**: fade + slide al entrar cada sección (`IntersectionObserver`).
- **Header sticky** que pasa de transparente a sólido al scrollear.
- **Micro-interacciones**: hover/scale en botones, lift + borde animado en cards de servicio.
- **Smooth scroll** + botón flotante de WhatsApp con pulso.
- **Progressive enhancement**: si el JS falla o está desactivado, **todo el contenido se ve igual** (la animación solo se aplica con la clase `.js`).

## 🔍 SEO

- `title`, `meta description`, Open Graph + Twitter Card, `canonical`.
- `alt` en todas las imágenes, `lang="es-AR"`, landmarks semánticos.
- **Datos estructurados** `AutoPartsStore` (LocalBusiness) con dirección, teléfono y `aggregateRating` 4.9.
- `robots.txt` + `sitemap.xml`.

---

## ⚠️ Cosas para revisar antes de publicar

1. **`ratingCount` del JSON-LD** (en `index.html`) está en `100` como **placeholder** → reemplazar por la **cantidad real** de reseñas de Google.
2. ~~Reseñas del carrusel~~ ✅ **Hecho**: el carrusel ya tiene **10 reseñas reales** del perfil de Google (mezcla de recientes + mejores).
2. **Tailwind por CDN**: funciona perfecto y es fácil de editar, pero muestra un warning de "no usar en producción" y carga ~100KB en runtime. Si querés máximo rendimiento, puedo **compilar Tailwind a un CSS estático** (sin CDN ni warning) — avisame.
3. **URLs absolutas** (og:image, canonical, sitemap) apuntan a `https://bateriasmourasanandres.com.ar/` — ajustar si el dominio final es otro.

## 📁 Estructura

```
bateriasmoura/
├── index.html          # Página única (comentada por secciones)
├── css/styles.css       # Parallax, animaciones, micro-interacciones (tokens en :root)
├── js/main.js           # Header, menú, parallax, reveal, WhatsApp flotante
├── assets/
│   ├── img/             # Imágenes optimizadas (WebP)
│   └── raw/             # Originales descargados del sitio actual
├── robots.txt
└── sitemap.xml
```
