# Sources — Bitcoin akan segera shutdown?

| # | Claim or asset | Source | Published | Checked | Licence or basis |
|---|---|---|---|---|---|
| S1 | UK "three days of disruption" advice, services named, Cabinet Office/Dan Jarvis | https://www.gov.uk/government/news/households-encouraged-to-take-small-simple-steps-to-stay-prepared-in-an-emergency — screenshot `evidence/govuk*.png` | 2026-10-22 | 2026-10-24 | Crown copyright text under the Open Government Licence v3.0 (attribution on screen); the page photo is not used |
| S2 | PHP flaw: NCSC-NL took its own site offline; other organisations incl. government agencies disabled theirs; no confirmed successful attack; patched versions | https://www.ncsc.nl/en/alerts/update-php-vulnerabilities-remain-a-reason-for-immediate-patching — `evidence/ncsc*.png` | 2026-10-21, updated 2026-10-23 15:45 | 2026-10-24 | Government advisory, unaltered screenshot crop with credit |
| S3 | "Millions of attempts" (Cloudflare/Matthew Prince), PHP ≈ 70% of websites, 32 UK government services offline as a precaution, UK NCSC: no reports of successful hacks | The Guardian, Robert Booth and Aisha Down, https://www.theguardian.com/technology/2026/oct/22/websites-across-world-hit-by-millions-of-attempts-to-exploit-php-code-flaw — `evidence/guardian.png` | 2026-10-22 | 2026-10-24 | Editorial use of the headline/standfirst with credit; the PA photo in the article is not used |
| S4 | Wallet builds → key signs → nodes relay → miner includes in a block | https://help.blockstream.com/education/transactions/transaction-basics/how-does-bitcoin-create-and-broadcast-transactions | live | 2026-10-24 | Fact |
| S5 | Blockstream Satellite broadcasts the blockchain 24/7, free; Telstar 18V 138°E covers Asia Pacific | https://blockstream.com/satellite/ | live | 2026-10-24 | Fact; Blockstream name shown to identify the service, no logo imitation |
| S6 | Satellite link is one-way; transmitting needs an internet connection | https://help.blockstream.com/blockstream-satellite/faqs/how-does-blockstream-satellite-bitcoin-data-differ-from-regular-bitcoin-data | live | 2026-10-24 | Fact |
| S7 | Public Bitcoin node locations: the snapshot's 3,271 coordinates (Bitnodes counted 25,799 reachable nodes in total; many share a location or have none) | Bitnodes API snapshot 1792599991, `https://bitnodes.io/api/v1/snapshots/1792599991/?field=coordinates` (served from btcnodes.io) → `public/episodes/bitcoin-shutdown/btc-nodes-2026-10-21.json` | 2026-10-21 16:26 UTC | 2026-10-24 | Factual data, credited on screen ("TITIK = 3.271 LOKASI NODE PUBLIK · BITNODES, 21 OKT 2026"). The lines between dots are drawn between nearest neighbours: ILUSTRASI, labelled "GARIS KONEKSI = ILUSTRASI" |
| S8 | The ten newest blocks at capture (heights 972.902–972.911 and hashes) | mempool.space API `https://mempool.space/api/v1/blocks` → `btc-blocks-2026-10-24.json` | 2026-10-24 10:40 UTC | 2026-10-24 | Public blockchain data, credited on screen ("BLOK ASLI TERBARU · MEMPOOL.SPACE, 24 OKT 2026") |
| S9 | Blockstream Satellite page header (screenshot crop) | https://blockstream.com/satellite/ → `public/episodes/bitcoin-shutdown/blockstream-hero.png` | live | 2026-10-24 | Editorial use of an unaltered crop to identify the service, credited on screen |

## Assets

| Asset | File | Origin | Licence or basis |
|---|---|---|---|
| ₿ symbol (relief on the 3D coin and the phone/hardware-wallet screens) | `public/episodes/bitcoin-shutdown/bitcoin-symbol.svg` | Wikimedia Commons, File:Bitcoin.svg (`https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg`) | Public domain (released by its author); the coin around it is our own 3D model, not a brand imitation |
| Earth, day | `earth-day-2048.jpg` | NASA Visible Earth, Blue Marble land/ocean/ice (`https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg`) | NASA imagery, public domain (no endorsement implied) |
| Earth, night lights | `earth-night-3600.jpg` | NASA Earth Observatory, Black Marble 2016 (`https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg`) | NASA imagery, public domain |
| Earth, clouds | `earth-clouds-2048.jpg` | NASA Visible Earth, cloud_combined (`https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg`) | NASA imagery, public domain |
| GOV.UK, Guardian and NCSC-NL clippings | `govuk-*.png`, `guardian-*.png`, `ncsc-alert.png` | S1–S3 above | As S1–S3 |
| 3D type ("72 JAM") | `public/fonts/typeface/InterTight-800.json`, `JetBrainsMono-700.json` | Converted from the project's Inter Tight and JetBrains Mono fonts (`scripts/make-typeface.py`) | SIL Open Font License 1.1 (format conversion for rendering) |
| Devices, server room, satellite, dish, hardware wallet, coin, key, blocks | `src/three/*`, `src/episodes/bitcoin-shutdown/worlds/*` | Built in code for this project | Own work. All devices and apps are generic and unbranded; website cards use fictional `.contoh` domains |
| Score | `public/episodes/bitcoin-shutdown/score.mp3` | Synthesized by `scripts/score-bitcoin-shutdown.ts` (sine/noise synthesis in ffmpeg, timed from the narration cues) | Own work, no samples |
| Synthesized effects | `public/episodes/bitcoin-shutdown/sfx/*.wav` (disconnect, crackle, fail-beep, atm-chime, app-error, hop) | Same script | Own work |
| Pack effects | `public/sfx/newest/*` (boom, impact, whooshes, HUD, switch clicks, bell, lock, paper, typing) | The user's SFX pack | User-confirmed free to use (21 Oct 2026), not independently verified; per-sound notes in its `manifest.json` |
| Generated effect | `public/sfx/ping.wav` | `npm run audio` | Own work |
| Voice | `public/episodes/bitcoin-shutdown/narration.wav` | The user's ElevenLabs take ("Ongky Himawan – Calm, Deep", 24 Oct 2026), lightly edited (see `audio-map.md`) | The user's ElevenLabs account and its terms |

## Fact-check notes
- **"Shutdown?"** is asked as a question and answered in the film: the UK advice is general preparedness, not a prediction of a worldwide internet shutdown (on screen: "IMBAUAN INGGRIS = PERSIAPAN, BUKAN PREDIKSI").
- **"Jutaan percobaan"** are attempts. On screen at the claim: "PERCOBAAN · NCSC INGGRIS: BELUM ADA LAPORAN PERETASAN BERHASIL" (S3). NCSC-NL had not confirmed a successful attack either (S2).
- **Websites switched off** were precautions (S2, S3); on screen "SEBAGAI PENCEGAHAN · TERMASUK SITUS PEMERINTAH".
- **The payment, ATM and bank-app failures** are a simulation, labelled "SIMULASI GANGGUAN BESAR" on every device shot; the wallet is labelled "SIMULASI · DOMPET CONTOH" and its balance "SIMULASI".
- **Network scenarios** A (your connection drops: the transaction waits) and B (the global network splits) are labelled ILUSTRASI and HIPOTESIS; "BLOCKCHAIN TIDAK TERHAPUS" is the qualifier.
- **Hardware wallet** guards the keys and does not hold coins: "HARDWARE WALLET MENJAGA KUNCI, BUKAN MENYIMPAN KOIN".
- **Satellite**: receive only; sending needs another path (S6): "LINK SATELIT INI SATU ARAH: HANYA MENERIMA" and "KIRIM TRANSAKSI? PERLU JALUR LAIN".
- **Self-custody** still needs a network to send: "KIRIM TETAP / BUTUH JARINGAN" under SELF-CUSTODY.
- **Exchange**: a custodial exchange holds the keys, so access depends on its systems: "KUNCI DI TANGAN MEREKA", "AKSES = SISTEM MEREKA".
- No prices, dates or statistics beyond S1–S8 appear on screen.
