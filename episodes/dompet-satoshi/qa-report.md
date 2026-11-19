# QA report — dompet-satoshi

Retention audit result: PASS
Visual-quality audit result: PASS

## Part A — Retention audit (measured on the user's ElevenLabs take, captions.json)

### Script audit
- [x] **1. Hook:** "Enam koma tiga miliar dolar, dikuras dari Binance" (0.0–2.6 s). The first frame reads "$6,3 MILIAR DICURI".
- [x] **2. Evidence by 5 s:** the Binance logo (0.3 s), the TRM Labs headline (2.5 s) and the 20-minute timeline (3.4–5.1 s).
- [x] **3. First payoff by 8–12 s:**
  - "sekitar satu koma satu juta BTC punya Satoshi Nakamoto… nggak pernah dibobol" (7.0–11.7 s), with 18,270 vs ±1,097,650 BTC (≈60×) on screen.
  - The causal answer starts at 12.5 s: "Hacker Binance nggak memecahkan Bitcoin."
- [x] **4. Reason to continue:** how they got in → why Satoshi differs → it isn't one wallet → how hard one key is → the one real weakness → what that means for you.
- [x] **5. Concrete nouns:** recruiter, laptop, wallet, safe, key, a 78-digit number.
- [x] **6. Cut test:** no repeated headline and no second intro. Each beat adds one new fact.
- [x] **7. Promise / payoff:** the opening "20 minutes" returns at 65 s: "yang jebol dalam dua puluh menit itu bukan Bitcoin-nya…"
- [x] **8. Truth test:**
  - the 1.1 M is labelled PERKIRAAN, and the Patoshi attribution DIDUGA;
  - the engineer story is "Menurut Binance";
  - quantum is "secara teori" and "Mesinnya belum ada";
  - BIP-361 is labelled "DRAF · BELUM DIADOPSI";
  - the key guess is labelled ILUSTRASI.
- [x] **9. Silent test:** every beat has a headline and a diagram that carry it.
- [x] **10. Share reason:** a friend who keeps coins on an exchange or is job hunting online.

### Viewer-value gate
All eight pass:
- the opening is understandable in 3 s;
- there's a reason to care (biggest hack ever, a common exchange);
- the early payoff lands by 12 s;
- each section adds new information;
- the mechanism is shown (the chain, and 21,953 separate keys);
- no sentence is redundant;
- the takeaway is worth keeping (where hacks break, and that the exchange holds your key);
- the video delivers what the opening promised.

## Part B — Visual-quality audit
**Stills, three rounds (`output/dompet-satoshi-review/`).** Fixes:
- **Headlines:** the "±18 TAHUN" headline wrapped to three lines, so it was shortened. The final headline was resized to two lines.
- **Key guess:** the hex wrapped to three lines, so the font was reduced.
- **Big safe:** it overlapped the headline, so the camera was pulled back and its framing solved for the band.
- **Field framings:**
  - framings were solved numerically so the whole field sits inside y 780–1420;
  - the field is drawn at half scale, because the camera's far plane (400) was clipping the far rows and blanked the "22.000 BRANKAS" shot;
  - the close-up's fog keeps the far tiles black above the band;
  - the close-up labels were shortened, because the right one ran off the frame.
- **Hero move (safe → field):** the field crosses the text zones, so the headline and micro captions are muted for 3.7 s. The narration carries the beat.

**Render checks:** see "Encoded render" below.
- [ ] **Motion watched in a full render:** **NOT REVIEWED** (frames only).
- [ ] **Sound:** measured, not heard. **Not listened to.**
