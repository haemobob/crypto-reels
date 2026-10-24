"""
Converts a brand font (woff2/ttf/otf) to a three.js typeface JSON, for extruded 3D type (TextGeometry / Font).

  python scripts/make-typeface.py public/fonts/InterTight-800.woff2 public/fonts/typeface/InterTight-800.json

Needs: pip install fonttools brotli
Covers printable ASCII plus a few symbols used on screen (≈, ×, →, ≠, ✓, ✗, %, ₿ when the font has them).
"""
import json
import sys

from fontTools.pens.basePen import decomposeQuadraticSegment
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

CHARS = [chr(c) for c in range(32, 127)] + list('≈×→≠✓✗•–—₿')


def outline(glyph_set, name):
    pen = RecordingPen()
    glyph_set[name].draw(pen)
    out = []
    cur = (0, 0)
    for op, pts in pen.value:
        if op == 'moveTo':
            cur = pts[0]
            out += ['m', *cur]
        elif op == 'lineTo':
            cur = pts[0]
            out += ['l', *cur]
        elif op == 'qCurveTo':
            # TrueType: implied on-curve points between consecutive off-curve points.
            if pts[-1] is None:  # closed contour of only off-curve points
                pts = pts[:-1]
            for ctrl, end in decomposeQuadraticSegment(pts):
                out += ['q', *end, *ctrl]
                cur = end
        elif op == 'curveTo':
            c1, c2, end = pts
            out += ['b', *end, *c1, *c2]
            cur = end
        elif op in ('closePath', 'endPath'):
            out += ['z']
    return ' '.join(str(round(v)) if isinstance(v, (int, float)) else v for v in out)


def main(src, dst):
    font = TTFont(src)
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    hmtx = font['hmtx']
    upm = font['head'].unitsPerEm
    glyphs = {}
    for ch in CHARS:
        name = cmap.get(ord(ch))
        if not name:
            continue
        o = outline(glyph_set, name)
        glyphs[ch] = {'ha': hmtx[name][0], 'x_min': 0, 'x_max': hmtx[name][0], 'o': o}
    head = font['head']
    hhea = font['hhea']
    post = font['post']
    data = {
        'glyphs': glyphs,
        'familyName': font['name'].getDebugName(1),
        'ascender': hhea.ascent,
        'descender': hhea.descent,
        'underlinePosition': post.underlinePosition,
        'underlineThickness': post.underlineThickness,
        'boundingBox': {'yMin': head.yMin, 'xMin': head.xMin, 'yMax': head.yMax, 'xMax': head.xMax},
        'resolution': upm,
        'original_font_information': {'source': src},
    }
    with open(dst, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    print(f'{dst}: {len(glyphs)} glyphs, {upm} units/em')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
