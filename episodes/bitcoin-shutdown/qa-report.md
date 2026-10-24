# QA report — Bitcoin akan segera shutdown?

Both audits are done **before final rendering**. `npm run audit -- <id>` reads the two result lines.

Retention audit result: PENDING
Visual-quality audit result: PENDING

## Part A — Retention audit (script, on the final ElevenLabs take; times from captions.json)

### Script audit
- [x] 1. **Hook:** 0.07 s "BITCOIN akan segera... SHUTDOWN?". A stranger can say what's at stake: whether Bitcoin can stop working.
- [x] 2. **Evidence by 5 s:** 2.37 s "Pemerintah Inggris baru saja mengimbau…" over the real GOV.UK page (22 Oct 2026).
- [x] 3. **First payoff by 8–12 s:** 5.68–9.0 s "tiga hari gangguan layanan penting, seperti listrik dan internet". A concrete, sourced fact.
- [x] 4. **Reason to continue:** each answer opens the next question: UK advice → real attack this week (9.4 s) → "not the end of the internet, but imagine" (19.5 s) → money stops (25.5 s) → "Bitcoin lo gimana?" (34.8 s) → how a transaction travels (36.3 s) → what an outage does to it (44.0 s) → "Tapi tunggu… nggak otomatis hilang" (52.3 s) → satellite (60.0 s) → exchange (68.7 s) → ownership vs access (73.8–84.8 s).
- [x] 5. **Concrete nouns:** mesin pembayaran, ATM, aplikasi bank, server, jaringan komputer, satelit, exchange, private key; each one has an object on screen.
- [x] 6. **Cut test:** no sentence repeats the headline; no generic bridge ("Tapi tunggu" is the brief's own deliberate reversal and is followed by the answer within 1.1 s).
- [x] 7. **Promise/payoff:** "Bitcoin akan segera shutdown?" is answered at 73.8 s ("internet mati belum tentu membuat Bitcoin mati"), then deepened into the access question.
- [x] 8. **Truth test:** the opening is a question; "Ini bukan berarti internet dunia akan segera mati" at 19.5 s; UK advice shown as general preparedness, not a prediction; "millions of attempts" shown as attempts, with NCSC UK's "no reports of successful hacks"; outage and partition beats labelled SIMULASI/ILUSTRASI; satellite shown as receive-only; hardware wallet shown as guarding keys, not holding coins.
- [x] 9. **Silent test:** to verify on stills in Part B (headlines carry each turn: SHUTDOWN? · 72 JAM · JUTAAN PERCOBAAN · SIMULASI · BITCOIN JUGA OFFLINE? · TANPA SERVER PUSAT · TRANSAKSI TERTUNDA · INTERNET MATI ≠ BITCOIN HILANG · SATU ARAH · BISAKAH LO MENGAKSESNYA?).
- [x] 10. **Share reason:** for a friend who keeps everything on an exchange app, or who thinks Bitcoin is immune to outages.

### Viewer-value gate
- [x] Opening understandable within 3 s · reason to care · early payoff (8–9 s) · each section adds information · mechanism explained (36–51 s) · no removable sentence · final insight worth keeping (ownership ≠ access) · delivers the promise.
- Ending: per the user's brief it ends on a question, after the answer (73.8 s) and the distinction. No follow/save/share request.

### Retention ladder (a new fact or turn every ~3–8 s)
2.4 UK advice · 5.7 three days · 7.7 power and internet · 9.4 PHP attacks · 15.8 sites switched off · 19.5 caveat · 22.6 imagine · 25.5/27.1/28.3 payments, ATM, bank app · 34.8 the Bitcoin question · 36.3 no central server · 38.8 must be sent · 42.6 confirmed · 44.0 local outage → delay · 47.4 partition · 52.3 reversal · 55.5 key and chain · 60.0 satellite · 64.7 one-way · 68.7 exchange · 73.8 answer · 77.7–84.8 final question.

### Rejection gates
- [x] Unsupported consequence: NO · first frame lacks stake: NO · logo/3D-only opening: NO (real document from 2.4 s) · no return by 8–12 s: NO · padding: NO · disconnected diagrams: NO (one transaction and one node map carry the mechanism) · ending doesn't answer the opening: NO (73.8 s).

## Part B — Visual-quality audit
(after the build)

## Scores (1–5)
| Hook | First 12 s | Real-world opening | Educational payoff | Reward ladder | Understanding | Hierarchy | Camera | Transitions | Rhythm | Brand | Factual accuracy |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

## Known limitations

## Final verified artifact path
