import json, sys, datetime as dt
h = json.load(open(sys.argv[1]))
def ts(d): return int(dt.datetime.strptime(d, '%Y-%m-%d').replace(tzinfo=dt.timezone.utc).timestamp() * 1000)
def poc(a, b, step):
    bins = {}
    for r in h:
        if not (ts(a) <= r[0] < ts(b) + 86400000): continue
        hi, lo, v = float(r[2]), float(r[3]), float(r[5])
        k0, k1 = int(lo // step), int(hi // step)
        span = max(hi - lo, 1e-9)
        for k in range(k0, k1 + 1):
            ov = min(hi, (k + 1) * step) - max(lo, k * step)
            if hi == lo: ov = 1; span = 1
            if ov > 0: bins[k] = bins.get(k, 0) + v * ov / span
    k = max(bins, key=bins.get)
    return k * step, (k + 1) * step
for name, a, b in [('summer', '2026-06-15', '2026-08-18'), ('summer', '2026-06-01', '2026-08-18'), ('summer', '2026-07-01', '2026-08-18'), ('summer', '2026-06-15', '2026-08-16'),
                   ('bear', '2025-10-06', '2026-01-31'), ('bear', '2025-11-01', '2026-01-31'), ('bear', '2025-10-06', '2026-02-04'), ('bear', '2025-11-15', '2026-01-31')]:
    print(name, a, b, '250:', poc(a, b, 250), '500:', poc(a, b, 500))
