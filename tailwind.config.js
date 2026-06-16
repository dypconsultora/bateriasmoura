/* Config de Tailwind para COMPILAR el CSS estático (reemplaza el CDN runtime).
   Rebuild:  npx tailwindcss@3.4.17 -c tailwind.config.js -i src/tailwind.css -o css/tailwind.css --minify
   (este archivo se bloquea desde .htaccess; no se sirve en producción) */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        carbon:  { DEFAULT: '#0B1220', 900: '#0B1220', 800: '#0F1B33', 700: '#13234A' },
        moura:   { DEFAULT: '#2563EB', 700: '#1D4ED8', 600: '#2563EB', 500: '#3B82F6' },
        energy:  { DEFAULT: '#FACC15', 500: '#EAB308', 400: '#FACC15' },
        wa:      { DEFAULT: '#25D366', 700: '#128C7E', 900: '#06351B' },
        surface: '#F8FAFC',
        ink:     '#0F172A',
      },
      fontFamily: {
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        nav:     ['"Space Grotesk"', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
};
