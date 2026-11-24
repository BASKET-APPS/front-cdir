"""Genera variantes ligeras de imágenes de la web pública (sin tocar los originales).

- Escudos de rivales: public/opponents/96/<nombre>.png (máx. 96 px; se muestran a 23-32 px, 3x en móviles).
- Fotos anchas (>= 1300 px): public/club/_v/<nombre>-828.jpg y -1240.jpg, candidatas `srcset` para móviles.
- data/image-variants.json: manifiesto que usa ClubImage para añadir srcset/sizes.

Uso: python scripts/generate-image-variants.py  (requiere Pillow). Idempotente: regenera desde los originales.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
manifest = {}

def crest(path: Path):
    out = PUBLIC / 'opponents' / '96' / path.name
    out.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(path) as im:
        im = im.convert('RGBA')
        im.thumbnail((96, 96), Image.LANCZOS)
        # Paleta de 256 colores con transparencia: imperceptible a 23-32 px y ~10 veces más ligera.
        im.quantize(256, method=Image.Quantize.FASTOCTREE).save(out, 'PNG', optimize=True)
    return out

def photo(path: Path, widths=(828, 1240)):
    """Candidatas para móviles (sizes=100vw): 828 px (pantallas 2x) y 1240 px (pantallas 3x)."""
    with Image.open(path) as im:
        if im.width < 1300:
            return None
        rel = '/' + path.relative_to(PUBLIC).as_posix()
        kept = []
        for width in widths:
            out = PUBLIC / 'club' / '_v' / f'{path.stem}-{width}.jpg'
            out.parent.mkdir(parents=True, exist_ok=True)
            size = (width, round(im.height * width / im.width))
            im.convert('RGB').resize(size, Image.LANCZOS).save(out, 'JPEG', quality=78, optimize=True, progressive=True)
            if out.stat().st_size > path.stat().st_size * 0.75:  # no compensa: se descarta
                out.unlink()
                continue
            kept.append({'src': '/' + out.relative_to(PUBLIC).as_posix(), 'w': width, 'bytes': out.stat().st_size})
        if not kept:
            return None
        manifest[rel] = {'w': im.width, 'h': im.height, 'variants': [{'src': k['src'], 'w': k['w']} for k in kept]}
        return kept

if __name__ == '__main__':
    before = after = 0
    for p in sorted((PUBLIC / 'opponents').glob('*.png')):
        o = crest(p); before += p.stat().st_size; after += o.stat().st_size
    print(f'escudos: {before} -> {after} bytes')
    before = after = 0
    for p in sorted((PUBLIC / 'club').rglob('*')):
        if '_v' in p.parts or p.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        kept = photo(p)
        if kept:
            before += p.stat().st_size; after += kept[-1]['bytes']
    print(f'fotos con variantes: {len(manifest)}; originales {before} bytes -> mayor variante {after} bytes')
    (ROOT / 'data' / 'image-variants.json').write_text(json.dumps(manifest, indent=1, sort_keys=True) + '\n', encoding='utf-8')
