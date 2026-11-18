"""Genera el patrón SVG de roba de llengües (ikat mallorquín).
Uso:
  python3 tools/llengues.py img/llengues.svg            rojo y blanco (franja del pie)
  python3 tools/llengues.py img/llengues-suau.svg suau  granate tono sobre tono (mantel de la carta)
"""
import math, random, sys
out = sys.argv[1]
paleta = sys.argv[2] if len(sys.argv) > 2 else "clar"
W, H = 64, 176          # tamaño de la tesela
STEP = 4                # alto de cada "hilo"
rnd = random.Random(7)

def flame(cx, cy, half_w, half_h, jitter):
    """Rombo alargado con perfil de llama y bordes en escalera (efecto ikat)."""
    left, right = [], []
    n = int(2 * half_h / STEP)
    for i in range(n + 1):
        y = cy - half_h + i * STEP
        t = (y - (cy - half_h)) / (2 * half_h)          # 0..1
        prof = math.sin(math.pi * t) ** 0.9
        # punta superior más afilada que la inferior: llama
        prof *= 1 - 0.18 * (1 - t)
        w = half_w * prof
        jl = rnd.uniform(-jitter, jitter) if 0 < i < n else 0
        jr = rnd.uniform(-jitter, jitter) if 0 < i < n else 0
        left.append((cx - w + jl, y)); right.append((cx + w + jr, y))
    pts = []
    # escalones: cada punto se duplica para formar peldaños horizontales
    for k, (x, y) in enumerate(left):
        if k: pts.append((x, left[k-1][1]))
        pts.append((x, y))
    for k, (x, y) in enumerate(reversed(right)):
        if k: pts.append((x, list(reversed(right))[k-1][1]))
        pts.append((x, y))
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z'

PALETES = {
    # contraste alto: rojo sobre blanco, como la tela clásica
    'clar': dict(fons='#F6EFE2', grana='#9E1221', mig='#F6EFE2', rosa='#D2606F', vi='#5A0D18'),
    # tono sobre tono: granate sobre granate, para superficies grandes (no «raya» la vista)
    'suau': dict(fons='#64101A', grana='#741521', mig='#6A111C', rosa='#7F1B27', vi='#5A0D17'),
}
C = PALETES[paleta]
paths = []
for cx, cy in [(W/2, H/2), (0, 0), (W, 0), (0, H), (W, H)]:
    paths.append((C['grana'], flame(cx, cy, 20, 88, 2.6)))
    paths.append((C['mig'], flame(cx, cy, 12.5, 64, 2.0)))
    paths.append((C['rosa'], flame(cx, cy, 8.5, 50, 1.6)))
    paths.append((C['vi'], flame(cx, cy, 3.5, 32, 1.0)))
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<rect width="{W}" height="{H}" fill="{C["fons"]}"/>']
svg += [f'<path fill="{c}" d="{d}"/>' for c, d in paths]
svg.append('</svg>')
open(out, 'w').write('\n'.join(svg))
print('ok', out)
