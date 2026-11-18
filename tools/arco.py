"""Genera el arco de marès con la bodega al fondo (fragmento SVG de la portada). Uso: python3 tools/arco.py"""
import math, random, sys
rnd = random.Random(11)
cx, cy, R, r = 300, 220, 200, 176   # centro, radio exterior e interior
base = 356
out = []
out.append('<!-- arco de marès con la bodega al fondo -->')
out.append('<clipPath id="opening"><path d="M%d %d V%d A%d %d 0 0 1 %d %d V%d Z"/></clipPath>' % (cx-r, base, cy, r, r, cx+r, cy, base))
out.append('<radialGradient id="glow" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#6E3B24"/><stop offset="1" stop-color="#2E1712"/></radialGradient>')
# hueco del arco
out.append('<path d="M%d %d V%d A%d %d 0 0 1 %d %d V%d Z" fill="url(#glow)"/>' % (cx-r, base, cy, r, r, cx+r, cy, base))
# estanterías con botellas
g = ['<g clip-path="url(#opening)">']
colors = ['#1E3627', '#4A0E1A', '#24110F', '#5A4520', '#3A0B16', '#2A3A22']
for shelf_y in (128, 196, 264, 332):
    x = cx - r + 4
    while x < cx + r - 10:
        w = rnd.choice([12, 13, 14])
        h = rnd.randint(40, 50)
        c = rnd.choice(colors)
        top = shelf_y - h
        neck = 4
        g.append(f'<path d="M{x+w/2-neck/2:.1f} {top} h{neck} v{h*0.28:.1f} q{w/2-neck/2:.1f} 2 {w/2-neck/2:.1f} 8 V{shelf_y} h-{w} V{top+h*0.28+8:.1f} q0-6 {w/2-neck/2:.1f}-8z" fill="{c}"/>')
        if rnd.random() < 0.75:
            g.append(f'<rect x="{x+2:.1f}" y="{shelf_y-h*0.45:.1f}" width="{w-4}" height="{h*0.22:.1f}" fill="#E9DAB8" opacity=".55"/>')
        x += w + rnd.choice([3, 4, 5, 6])
    g.append(f'<rect x="{cx-r}" y="{shelf_y}" width="{2*r}" height="5" fill="#7A4A2A"/>')
g.append('</g>')
out += g
# anillo de dovelas (marès)
out.append('<path d="M%d %d V%d A%d %d 0 0 1 %d %d V%d H%d V%d A%d %d 0 0 0 %d %d V%d Z" fill="#D8B77E"/>' % (
    cx-R, base, cy, R, R, cx+R, cy, base, cx+r, cy, r, r, cx-r, cy, base))
# juntas entre dovelas
joints = []
for deg in range(0, 181, 15):
    a = math.radians(180 - deg)
    x1, y1 = cx + r*math.cos(a), cy - r*math.sin(a)
    x2, y2 = cx + R*math.cos(a), cy - R*math.sin(a)
    joints.append(f'M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}')
for y in (262, 304):
    joints.append(f'M{cx-R} {y}h{R-r}M{cx+r} {y}h{R-r}')
out.append('<path d="%s" stroke="#B8955C" stroke-width="2"/>' % ''.join(joints))
out.append('<path d="M%d %d V%d A%d %d 0 0 1 %d %d V%d" fill="none" stroke="#B8955C" stroke-width="2"/>' % (cx-r, base, cy, r, r, cx+r, cy, base))
print('\n'.join('            ' + l for l in out))
