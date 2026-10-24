# Beat sheet — Bitcoin akan segera shutdown?

Topic: news of a UK preparedness advisory and a PHP exploitation wave, used to answer "what happens to my Bitcoin if the internet goes down?"
Viewer payoff: an internet outage doesn't erase Bitcoin (ownership is recorded on the blockchain and proven by the private key), but it can stop you from using it: sending needs a network, satellites only receive, and exchange balances depend on the exchange's systems.
Narrative question: "Kalau internet mati, Bitcoin lo gimana?"
Runtime: 84.8 s of narration + 2 s outro (window 60–88 s in `episode.json`).
Date checked / source links: 24 Oct 2026, `sources.md` S1–S9.

| # | Time (s) | Spoken thought | New information the viewer learns | Visual noun | Proof / qualifier | Main on-screen text |
|---|---|---|---|---|---|---|
| 01 | 0.0–2.4 | Bitcoin akan segera SHUTDOWN? | The question at stake | Coin held by links that snap | — (asked as a question) | BITCOIN AKAN SEGERA SHUTDOWN? |
| 02 | 2.4–7.7 | UK told citizens to prepare for three days of disruption | A real government advisory exists, dated | Real GOV.UK page, highlights | GOV.UK 22 Oct 2026 (S1) | 72 JAM · PERSIAPAN MENGHADAPI GANGGUAN LAYANAN |
| 03 | 7.7–9.4 | …such as power and internet | Which services | Chips LISTRIK / AIR / TELEPON / INTERNET | S1 | (chips) |
| 04 | 9.4–15.8 | Millions of attack attempts on a PHP flaw | The second event, with its scale | Server room, Guardian clipping, red LEDs | Guardian, Cloudflare (S3); "PERCOBAAN · BELUM ADA LAPORAN PERETASAN BERHASIL" | JUTAAN PERCOBAAN EKSPLOITASI |
| 05 | 15.8–19.5 | Some websites were switched off on purpose | Defensive shutdowns happened | NCSC-NL alert, site cards switching to 503 | S2, S3; "SEBAGAI PENCEGAHAN" | WEBSITE SENGAJA DIMATIKAN |
| 06 | 19.5–22.6 | This doesn't mean the internet is about to die | The caveat, at the claim | Calm aisle, few red lights | "IMBAUAN INGGRIS = PERSIAPAN, BUKAN PREDIKSI" | BUKAN BERARTI INTERNET DUNIA MATI |
| 07 | 22.6–30.7 | Imagine it spreading: payments, ATMs, bank apps fail | What an outage feels like day to day | Terminal, ATM, phone | SIMULASI GANGGUAN BESAR | MESIN PEMBAYARAN GAGAL · ATM OFFLINE · APLIKASI BANK NGGAK KEBUKA |
| 08 | 30.7–36.3 | So what about your Bitcoin? | The viewer's own stake | Wallet on the same phone, DISCONNECTED, send locked | SIMULASI · DOMPET CONTOH | BITCOIN JUGA OFFLINE? |
| 09 | 36.3–38.8 | No central server | First answer: no single off switch | 3,271 real node locations on the globe | Bitnodes (S7); lines ILUSTRASI | TANPA SERVER PUSAT |
| 10 | 38.8–44.0 | But a transaction must be sent to the network, then confirmed | The mechanism: sign → relay → block | Packet hops Jakarta → Singapore → Mumbai → Frankfurt; miner block | Blockstream (S4) | TRANSAKSI HARUS DIKIRIM · LALU DIKONFIRMASI |
| 11 | 44.0–47.5 | If your connection drops, the transaction can be delayed | Personal consequence | Wallet links drop, TERTUNDA | SKENARIO A · ILUSTRASI · JARINGAN GLOBAL TETAP JALAN | KONEKSI LO PUTUS: TERTUNDA |
| 12 | 47.5–52.3 | If the global network splits, nodes can't talk | System consequence | Long links break, packet frozen | SKENARIO B · HIPOTESIS · BLOCKCHAIN TIDAK TERHAPUS | JARINGAN TERPECAH · TRANSAKSI TERTUNDA |
| 13 | 52.3–55.5 | But your Bitcoin doesn't automatically disappear | The reversal | The frozen light becomes a hardware wallet; off-white | — | INTERNET MATI ≠ BITCOIN HILANG |
| 14 | 55.5–60.0 | As long as your private key is safe, ownership stays on the blockchain | Why: key + ledger | Key object; ten real blocks | "HARDWARE WALLET MENJAGA KUNCI, BUKAN MENYIMPAN KOIN"; mempool.space (S8) | TETAP TERCATAT DI BLOCKCHAIN |
| 15 | 60.0–64.7 | Satellites can broadcast the blockchain without the normal internet | A surprising, real fallback | Satellite, broadcast cone, ground dish | Blockstream (S5, S9): 24/7, free, Telstar 18V 138°E | BLOCKSTREAM SATELLITE · TERIMA DATA BLOCKCHAIN ✓ |
| 16 | 64.7–68.7 | But sending still needs another path | The limit, at the claim | Blocked return pulse, dashed alternative path | "LINK SATELIT INI SATU ARAH" (S6) | KIRIM TRANSAKSI? PERLU JALUR LAIN |
| 17 | 68.7–73.8 | On an exchange, access depends on their systems | Custody matters | Hardware wallet vs failing exchange | "KIRIM TETAP BUTUH JARINGAN" under self-custody | KALAU DI EXCHANGE? · AKSES = SISTEM MEREKA |
| 18 | 73.8–77.7 | An internet outage doesn't necessarily kill Bitcoin | The answer to the hook | Pull-back, coin rising | — | BITCOIN BISA BERTAHAN. |
| 19 | 77.7–84.8 | But if the whole financial system is offline, what good is money you can't use? | The payoff: surviving ≠ being usable | Lines fade, only the coin lit | — | TAPI BISAKAH LO MENGAKSESNYA? |

## Argument integrity
- **Established fact:** the UK advisory and its wording (S1); the PHP flaw, millions of attempts, precautionary shutdowns and no reported successful hacks (S2, S3); how transactions are relayed and confirmed (S4); Blockstream Satellite's free one-way broadcast (S5, S6); node locations and block heights (S7, S8).
- **Conditional / hypothetical:** the large outage (SIMULASI), scenario A and scenario B (ILUSTRASI / HIPOTESIS). Never presented as happening.
- **Numbers with units and dates:** 72 jam (three days, GOV.UK 22 Oct 2026); 3.271 locations (Bitnodes 21 Oct 2026); block #972.911 (mempool.space 24 Oct 2026); ≈70% of websites use PHP (Guardian, in the source line).
- **Thesis interruption:** the off-white reversal "INTERNET MATI ≠ BITCOIN HILANG" after the blackout.
- **Ending answers the hook:** "Bitcoin akan segera shutdown?" → no: the network has no off switch and the record survives; but access is the real risk.
