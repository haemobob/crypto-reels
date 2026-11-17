import json, sys, datetime as dt, statistics as st
rows = json.load(open(sys.argv[1]))
days = {}
for r in rows:
    d = dt.datetime.fromtimestamp(r[0] / 1000, dt.timezone.utc).date().isoformat()
    days.setdefault(d, []).append((float(r[1]), float(r[2]), float(r[3]), float(r[4]), float(r[5])))
NB = 30
out = []
for d, bars in sorted(days.items()):
    if len(bars) < 280: continue
    o, c = bars[0][0], bars[-1][3]
    H = max(b[1] for b in bars); L = min(b[2] for b in bars); R = H - L
    bins = [0.0] * NB
    for (_, h, l, _, v) in bars:
        k0, k1 = int((l - L) / R * NB), int((h - L) / R * NB)
        k0, k1 = min(k0, NB - 1), min(k1, NB - 1)
        for k in range(k0, k1 + 1): bins[k] += v / (k1 - k0 + 1)
    tot = sum(bins); poc = max(range(NB), key=lambda k: bins[k])
    third = NB // 3
    lo3, mid3, hi3 = sum(bins[:third]) / tot, sum(bins[third:2 * third]) / tot, sum(bins[2 * third:]) / tot
    out.append(dict(d=d, o=o, h=H, l=L, c=c, R=R, poc=(poc + 0.5) / NB, lo3=lo3, mid3=mid3, hi3=hi3, oc=(c - o) / R, pocPrice=L + (poc + 0.5) / NB * R, bins=bins))
for i, x in enumerate(out):
    med = st.median(y['R'] for y in out[max(0, i - 20):i] or [x])
    x['rr'] = x['R'] / med
    s = '?'
    if x['rr'] >= 1.3 and abs(x['oc']) >= 0.7 and max(x['lo3'], x['mid3'], x['hi3']) < 0.5: s = 'THIN' + ('↓' if x['oc'] < 0 else '↑')
    elif x['poc'] >= 0.66 and x['hi3'] >= 0.5: s = 'P'
    elif x['poc'] <= 0.34 and x['lo3'] >= 0.5: s = 'b'
    elif 0.34 < x['poc'] < 0.66 and abs(x['oc']) < 0.4 and x['mid3'] >= 0.45: s = 'D'
    x['s'] = s
json.dump(out, open(sys.argv[2], 'w'))
for x in out[-40:]:
    print(f"{x['d']} {x['s']:5} O{x['o']:>8.0f} H{x['h']:>8.0f} L{x['l']:>8.0f} C{x['c']:>8.0f} rr{x['rr']:.2f} poc{x['poc']:.2f} lo{x['lo3']:.2f} mid{x['mid3']:.2f} hi{x['hi3']:.2f} oc{x['oc']:+.2f}")
from collections import Counter
print(Counter(x['s'] for x in out))
