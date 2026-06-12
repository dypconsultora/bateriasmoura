# Baterías Moura San Andrés

Landing page de una sola página para **Baterías Moura San Andrés** — cambio de baterías a domicilio con entrega e instalación sin cargo.

**Stack:** HTML + Tailwind (CDN) + JavaScript vanilla. Sin build, lista para hostear en cualquier servidor estático.

## Características
- Hero a pantalla completa con **parallax en capas**
- **Scroll reveal** al entrar cada sección (IntersectionObserver)
- **Carrusel de opiniones** reales de Google (4 por vista, responsive)
- **Header sticky**, smooth scroll y **botón flotante de WhatsApp**
- Mobile-first · SEO on-page · datos estructurados `LocalBusiness`

## Verlo localmente
```bash
python3 -m http.server 8000
```
Abrí http://localhost:8000

## Estructura
```
index.html          Página única (comentada por secciones)
css/styles.css      Parallax, animaciones, micro-interacciones
js/main.js          Header, menú, parallax, reveal, carrusel, WhatsApp
assets/img/         Imágenes optimizadas (WebP)
assets/raw/         Originales de origen
robots.txt · sitemap.xml
```

Detalles de diseño (paleta, tipografía, decisiones) en [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

---
Hecho por [DyP Consultora](http://dypconsultora.com/).
