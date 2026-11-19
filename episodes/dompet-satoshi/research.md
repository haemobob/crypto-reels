# Research — dompet-satoshi (checked 19 Nov 2026)

User brief: with the recent cyberattacks, why has Satoshi Nakamoto's ~1M BTC never been hacked? Then break down the holdings (spread across many addresses). Urgency hook, real images and assets, 3D where useful.

## 5W1H

### The hack (news hook)
- **What:** the largest crypto theft on record. About USD 6.3–6.4 billion left Binance hot wallets on ten blockchains:
  - TRM Labs: USD 6.36 bn;
  - Chainalysis: about USD 6.4 bn;
  - NPR and the Washington Post: USD 6.3 bn.
  - It was about four times the USD 1.5 bn Bybit hack of February 2025 (TRM).
- **When:**
  - event: 29 Oct 2026, from 20:05 UTC (TRM) / about 4:20 p.m. ET (Chainalysis);
  - publications: 30 Oct (TRM, Chainalysis) and 3 Nov 2026 (NPR, on Binance's initial assessment).
- **How fast:** "most of it in about 20 minutes starting at 20:05 UTC" (TRM). NPR: "may have taken place in only about twenty minutes — but the attacks were months in the making".
- **Bitcoin part:** at 20:20 UTC a Binance Bitcoin hot wallet sent **18,270 BTC** to an attacker address (TRM).
- **Who:**
  - Attributed to TraderTraitor, a North Korean state-linked group, by TRM ("high confidence"), Chainalysis and Elliptic.
  - North Korea denied involvement.
  - Wording in the Reel: "hacker", with no country claim spoken.
- **How:**
  - Binance's initial assessment (NPR, 3 Nov 2026): an engineer was approached on a job-hunting platform by a fake "project director", interviewed twice, and on his work laptop downloaded an "assignment" that contained malicious code.
  - An earlier attempt in June was detected and stopped.
  - TRM: the evidence "points to a compromise of Binance's hot wallet signing infrastructure". Valid signed transfers left wallets on nine chains, and on Ethereum there was an EIP-7702 delegation with 50 pre-signed authorisations.
  - TRM defines a hot wallet as "a wallet connected to the internet that an exchange uses to process customer withdrawals".
- **Aftermath (context, not used in the script):**
  - About USD 2.7–2.8 bn frozen (TRM; Chainalysis as of 3 Nov).
  - Binance said user funds are safe and that it has covered about 95% (Washington Post, 2 Nov).

### Satoshi's coins (body)
- **Attribution — an estimate, not a confirmed balance.**
  - Sergio Demián Lerner found a mining pattern in early blocks (the "Patoshi" pattern; first published 2013, refined later).
  - Jameson Lopp curated the block list.
  - Public dataset (bensig/patoshi-addresses, commit 414637c): **21,953 blocks**, heights 3 to 49,973. Each coinbase pays the **50 BTC** block reward to its own **P2PK** output (a raw public key), for **1,097,650 BTC** in rewards; four blocks also carry fees, so the outputs hold 1,097,652.49 BTC.
  - Reported as "~1.1 million BTC"; other estimates run from 600,000 BTC.
- **Dates (mempool.space API):**
  - block 3: 9 Jan 2009 03:02 UTC;
  - block 49,973: 10 Apr 2010 12:47 UTC;
  - so "almost 18 years" (Jan 2009 to Nov 2026 is 17 years 10 months).
- **Never moved — our own check, 19 Nov 2026.**
  - Method: 40 random dataset entries (seed 7), plus blocks 3 and 9. For each block, the coinbase was fetched from mempool.space; we checked that the output is P2PK with the dataset's public key and 50 BTC, then read its spend status.
  - **All 42 matched the dataset. Only block 9 is spent:** its coinbase funded the first person-to-person transaction, to Hal Finney in block 170 (12 Jan 2009).
  - Reports agree the Patoshi coins have essentially never moved. Wording: "nggak pernah dipindah" for the holdings as a whole, with the dataset noted on screen.
- **Satoshi's last known messages:** April 2011 ("moved on to other things"). Wording: "menghilang sejak 2011" is not used in the script; it may appear on screen.
- **Ratio:** 1,097,650 / 18,270 ≈ **60×**.
- **Key space:** a Bitcoin private key is an integer from 1 to n−1, where n is the secp256k1 group order:
  - n = 115792089237316195423570985008687907852837564279074904382605163141518161494337, which is **78 digits**;
  - the security level against classical attacks is about 2^128 operations (standard).
  - Wording: "jumlah kemungkinan kuncinya: angka sepanjang 78 digit".

### The quantum caveat
- P2PK outputs show the full public key on-chain. Shor's algorithm on a large fault-tolerant quantum computer could, in theory, derive the private key from the public key.
- **No such machine exists today.** Every source agrees; the 2026 resource estimates (e.g. Google/EF/Stanford, March 2026; IonQ, Sept 2026) are all for machines not yet built.
- The script gives no qubit count (estimates vary by orders of magnitude).
- **BIP-361** "Post Quantum Migration and Legacy Signature Sunset" (Lopp et al., Status: Draft, BIP number assigned 2026-02-11, posted 14 Apr 2026, BSD-3-Clause):
  - Phase A stops sends to quantum-vulnerable addresses.
  - Phase B restricts legacy ECDSA/Schnorr spends behind a quantum-safe rescue protocol. The rescue protocol relies on BIP-32 seeds, which 2009 P2PK coins do not have, so the media describe it as freezing Satoshi's coins.
  - Lopp says it has no path to adoption at present.
  - Wording: "sudah ada draf untuk membekukan koin model lama ini", with "DRAF · BELUM DIADOPSI" on screen.

## Claim types
| Claim | Type |
|---|---|
| USD 6.3 bn, 20 min, 18,270 BTC | Reported fact (on-chain, TRM / Chainalysis) |
| Fake job interview, malware assignment | Binance's own initial assessment (via NPR) |
| ~1.1 M BTC belongs to Satoshi | Estimate (pattern analysis), labelled "PERKIRAAN" |
| 21,953 blocks, 50 BTC each, separate P2PK keys | On-chain fact for the dataset; the attribution is the estimate |
| 78-digit key space | Mathematical fact |
| A quantum computer could derive the keys | Theoretical; no such machine yet |
| BIP-361 | Proposal (draft), not adopted |
| "Kalau kripto lo di exchange, kuncinya dipegang exchange" | Definitional (custodial accounts) |

## Angle
Not "news happened". The hack is the hook: the viewer learns *where* hacks actually happen (keys and people, not Bitcoin's math). The breakdown of Satoshi's coins shows why a dormant, split, offline-signed holding has nothing to phish. The quantum caveat keeps it honest and current.
