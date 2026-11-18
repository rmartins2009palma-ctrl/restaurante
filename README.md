# Es Racó de Son Verí: web

Web del bar vinoteca **Es Racó de Son Verí** (Son Verí Nou, Llucmajor, Mallorca).
Llonguets, embutidos y quesos de la isla, vinos y cestas de regalo.

Es una web estática: HTML, CSS y un poco de JavaScript, sin dependencias ni herramientas de compilación.
Se puede alojar gratis en GitHub Pages, Netlify o Cloudflare Pages.

## Verla en local

```bash
python3 -m http.server 8080
```

Y abrir <http://localhost:8080>. Para otro idioma: `?lang=en` o `?lang=de`.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Todo el contenido en español: carta, precios, horario, dirección |
| `js/i18n.js` | Traducciones al inglés y al alemán |
| `js/main.js` | Idioma, aviso de abierto/cerrado, menú móvil, mapa bajo demanda |
| `css/styles.css` | Estilos (los colores están al principio, en `:root`) |
| `css/fonts.css`, `fonts/` | Fuentes Young Serif y Alegreya Sans, alojadas en la web (licencia OFL) |
| `img/llengues.svg` | Patrón de roba de llengües (lo genera `tools/llengues.py`; el arco de la portada, `tools/arco.py`) |
| `docs/DISENO.md` | Investigación, benchmark de 20 webs y plan de diseño |

## Cambios habituales

- **Precios**: en `index.html`, cada plato tiene `data-price="6.5"`. Cambia ese número
  (con punto decimal) y el texto de al lado. La web formatea el precio según el idioma.
- **Platos**: copia un bloque `<li class="dish">…</li>`. Si el texto tiene `data-i18n="clave"`,
  añade esa clave en `js/i18n.js` en inglés y alemán.
- **Horario**: la tabla de `index.html` y, en `js/main.js`, `OPEN_DAYS` (0 = domingo) y `OPEN_HOUR`.
- **Fotos**: si queréis usar las vuestras de Instagram, ponedlas en `img/` y avisad para integrarlas.

## Antes de publicar: datos a confirmar con el local

- [ ] **Dirección**: Google dice *Rambla 1, local 2 (esquina Ametler)*; la etiqueta de vuestros productos dice *C/ Rambla 4, local 7*.
- [ ] **Horario**: casi todas las fuentes dicen martes a sábado de 19:00 a 24:00; una dice miércoles a domingo.
- [ ] **Carta y precios**: los platos salen de las fotos y reseñas públicas, pero **los precios son orientativos**.
- [ ] Si se puede reservar por **WhatsApp** en el 656 55 88 06, se puede añadir un botón.
- [ ] Dominio definitivo, para poner la URL absoluta en `og:image` y el `canonical`.
- [ ] Aviso legal y política de privacidad (obligatorios en España para webs de empresa, LSSI y RGPD).

## Privacidad

La web no usa cookies ni rastreadores, así que no necesita banner de cookies.
Las fuentes se sirven desde la propia web y Google Maps solo se carga si el visitante pulsa «Ver el mapa».

## Skills de diseño instaladas

En `.claude/skills/` quedan instaladas las dos skills usadas para diseñar y revisar la web:
- `frontend-design` (Anthropic): dirección visual y tipografía.
- `web-design-guidelines` (Vercel): auditoría de accesibilidad y buenas prácticas.
