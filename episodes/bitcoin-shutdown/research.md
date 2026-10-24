# Research — Bitcoin akan segera shutdown?

Checked 24 Oct 2026 against primary sources. Raw text and screenshots (captured 24 Oct 2026, 10:26 UTC) are in `evidence/`.

## 1. UK emergency preparedness (fact)
- **Who/what/when:** Cabinet Office and Security Minister Dan Jarvis MP, news story "Households encouraged to take small, simple steps to stay prepared in an emergency", published **22 October 2026** (GOV.UK).
- **Exact wording:** households are "encouraged" to prepare "if everyday services are temporarily disrupted"; "the advice to be prepared for **three days of disruption** that is at the heart of the UK campaign is also used by France, Ireland and The Netherlands."
- **Services named:** "power, water, phones and the internet". Trigger examples: severe weather (storms last winter, wildfires this summer).
- **Nature:** first stage of a three-year "Be Ready" campaign; general preparedness. **Not** a prediction of an internet shutdown → script says "mengimbau" and the next beat says "Ini bukan berarti internet dunia akan segera mati."

## 2. PHP vulnerability, "PHP2Shell" (fact; attempts ≠ successful hacks)
- **Guardian, 22 Oct 2026** (Robert Booth and Aisha Down): "Websites across world hit by millions of attempts to exploit PHP code flaw". PHP "underpins about 70% of the world's websites".
- **Who counted "millions":** Cloudflare CEO Matthew Prince: tens of thousands of attempts in the first 45 minutes, "hundreds of thousands within two hours, and millions now".
- **Websites deliberately taken offline:** UK: 32 government services taken offline, "largely resulted from precautionary measures" (cybersecurity minister Liz Lloyd); NCSC-NL: "As a precaution, the NCSC-NL had temporarily taken its website offline. Several other organizations, including government agencies, had also proactively disabled their websites."
- **Success:** the UK NCSC had "no reports of successful hacks"; NCSC-NL (update 23 Oct 15:45): "one report of a possible exploit abroad, but it has not been confirmed that the attack was actually successful", and "the likelihood of large-scale exploitation is lower than previously estimated". Patched versions: PHP 8.5.12, 8.4.27, 8.3.36, 8.2.35.
- **Not related to Bitcoin's protocol.** The Reel never implies Bitcoin was hit.

## 3. How a Bitcoin transaction travels (mechanism)
- Blockstream Help, "How does Bitcoin create and broadcast transactions": the wallet builds the transaction, the private key signs it, it "propagates across the network through connected nodes until a miner includes it in a block"; each later block makes it harder to reverse. No central ledger or account database; thousands of independent nodes verify it.
- **Outage logic (explanation, not a claim of a specific event):** if *your* connection drops, you can't broadcast, so the transaction waits. A *local* outage doesn't stop the global network. In a wide *partition*, groups of nodes can't exchange transactions and blocks until they reconnect. Nothing erases the chain.

## 4. Blockstream Satellite (fact)
- blockstream.com/satellite: "broadcasts the Bitcoin blockchain around the world 24/7 for free"; "The Bitcoin blockchain from space. No internet required."
- Help Center FAQ: "The satellite links used by Blockstream Satellite operate through **one-way** communication… your Blockstream Satellite Kit node can only receive data via satellite, but not transmit it. **To transmit data, your node needs an internet connection.**"
- Coverage list includes **Telstar 18V, 138°E, Asia Pacific** (C and Ku band).

## 5. Custody (explanation)
- Self-custody: you hold the private key; the coins stay recorded on-chain even while you're offline, but spending still needs a path to the network.
- Exchange custody: your access goes through the exchange's website/app and systems; if they're offline, you wait.

## Claim types on screen
| Claim | Type | On-screen label |
|---|---|---|
| UK "three days" advice | Fact, dated | GOV.UK · 22 OKT 2026 |
| Millions of attempts | Fact (Cloudflare count via Guardian) | PERCOBAAN — BELUM ADA LAPORAN PERETASAN BERHASIL (NCSC UK) |
| Sites taken offline | Fact | NCSC-NL / GUARDIAN · 22–23 OKT 2026 |
| Wide outage: payments, ATMs, bank apps | Hypothetical | SIMULASI GANGGUAN BESAR |
| Network partition, pending transaction | Illustration of mechanism | ILUSTRASI |
| Satellite broadcast, one-way | Fact | BLOCKSTREAM · SATELIT SATU ARAH |
