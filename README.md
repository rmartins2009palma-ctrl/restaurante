# Es Racó de Son Verí: web

Web del bar vinoteca **Es Racó de Son Verí** (Son Verí Nou, Llucmajor, Mallorca).
Llonguets, gildas, tablas de embutido y queso, tartas de queso, bodega de Ribera y Rioja, terraza y cenas de grupo.

Publicada en <https://rmartins2009palma-ctrl.github.io/restaurante/> (GitHub Pages, desde la rama `claude/optimistic-hypatia-nqk1yh`).

Es una web estática: HTML, CSS y un poco de JavaScript, sin dependencias ni herramientas de compilación.
Se puede alojar gratis en GitHub Pages, Netlify o Cloudflare Pages.

## Verla en local

```bash
python3 -m http.server 8080
```

Y abrir <http://localhost:8080>. Para otro idioma: `?lang=ca` (mallorquí), `?lang=en` o `?lang=de`.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Todo el contenido en español: carta, horario, dirección. Los títulos de sección van siempre en mallorquín |
| `js/i18n.js` | Traducciones al mallorquí, al inglés y al alemán |
| `js/main.js` | Idioma, aviso de abierto/cerrado, menú móvil, mapa bajo demanda |
| `css/styles.css` | Estilos (los colores están al principio, en `:root`) |
| `css/fonts.css`, `fonts/` | Fuentes Young Serif y Alegreya Sans, alojadas en la web (licencia OFL) |
| `img/fotos/` | Fotos del local (de su Instagram) en WebP y JPG, en dos tamaños |
| `img/logo.png`, `img/logo-blanco.png` | Logo, extraído del cartel de Navidad (versión oscura y blanca) |
| `tools/llengues.py` | Generador del patrón de roba de llengües (ahora no se usa en la web; queda por si se quiere recuperar) |
| `docs/DISENO.md` | Investigación, benchmark de 20 webs y plan de diseño |

## Cambios habituales

- **Precios**: ahora la carta no muestra precios. Para añadirlos, pon en cada plato
  `<span class="dish-price" data-price="6.5">6,50&nbsp;€</span>`: la web ya formatea el precio según el idioma.
- **Platos**: copia un bloque `<li class="dish">…</li>`. Si el texto tiene `data-i18n="clave"`,
  añade esa clave en `js/i18n.js` en mallorquí, inglés y alemán.
- **Horario**: la tabla de `index.html` y, en `js/main.js`, `OPEN_DAYS` (0 = domingo) y `OPEN_HOUR`.
- **Fotos**: van en `img/fotos/`, con un `.webp` y un `.jpg` de cada una.
- **Después de cambiar CSS o JS**: sube el número de versión en `index.html` (`styles.css?v=5` → `?v=6`, igual en `main.js`, `i18n.js` y `fonts.css`), para que los navegadores no usen la copia vieja.

## Antes de publicar: datos a confirmar con el local

- [ ] **Dirección**: Google dice *Rambla 1, local 2 (esquina Ametler)*; la etiqueta de vuestros productos dice *C/ Rambla 4, local 7*.
- [ ] **Horario**: casi todas las fuentes dicen martes a sábado de 19:00 a 24:00; una dice miércoles a domingo.
- [ ] **Carta**: sale de vuestras fotos, del cartel de Navidad y de las reseñas. Falta la lista de **precios**.
- [ ] **Menú de grupo de 35 €**: confirmar que es el de este año (Navidad 2026).
- [ ] **Logo**: está extraído del cartel; si tenéis el archivo original (PNG o SVG), queda más nítido.
- [ ] Si se puede reservar por **WhatsApp** en el 656 55 88 06, se puede añadir un botón.
- [ ] Si se compra un dominio propio, cambiar las URL de `og:image` y `og:url` en `index.html`.
- [ ] Aviso legal y política de privacidad (obligatorios en España para webs de empresa, LSSI y RGPD).

## Privacidad

La web no usa cookies ni rastreadores, así que no necesita banner de cookies.
Las fuentes se sirven desde la propia web y Google Maps solo se carga si el visitante pulsa «Ver el mapa».

## Skills de diseño instaladas

En `.claude/skills/` quedan instaladas las dos skills usadas para diseñar y revisar la web:
- `frontend-design` (Anthropic): dirección visual y tipografía.
- `web-design-guidelines` (Vercel): auditoría de accesibilidad y buenas prácticas.
