# Sources — dompet-satoshi

## Facts
| # | Claim | Source | Published | Checked |
|---|---|---|---|---|
| S1 | About USD 6.3–6.4 bn left Binance hot wallets on 29 Oct 2026, most of it in about 20 minutes from 20:05 UTC; it is the largest crypto theft on record. Timeline: XRP 20:05–20:09, 233.46 M XRP; SOL and OP just after 20:10; 18,270 BTC from a Binance Bitcoin hot wallet at 20:20; Tron 612.7 M USDT within two minutes; ETH sweep 167,464 ETH about 3 min 24 s after the 20:20 delegation | TRM Labs, https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history (`evidence/trm-binance-hack-2026-10-30.txt`) | 2026-10-30 | 2026-11-19 |
| S2 | About $6.4 bn; started about 4:20 p.m. ET on 29 Oct; attributed to TraderTraitor | Chainalysis, https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/ (`evidence/chainalysis-binance-hack-2026-10-30.txt`) | 2026-10-30 | 2026-11-19 |
| S3 | (Not used on screen since the 20 Nov cut; background only.) Binance's initial assessment: an engineer was approached by a fake recruiter, interviewed, and downloaded an "assignment" containing malicious code on his work laptop; an earlier attempt in June was stopped; "only about twenty minutes" | NPR, https://www.npr.org/2026/11/03/nx-s1-6027799/binance-crypto-exchange-cyber-heist (`evidence/npr-binance-engineer-2026-11-03.txt`) | 2026-11-03 | 2026-11-19 |
| S4 | The evidence points to a compromise of Binance's hot-wallet signing infrastructure; a hot wallet is "a wallet connected to the internet" | TRM Labs (S1) | 2026-10-30 | 2026-11-19 |
| S5 | 21,953 Patoshi-pattern blocks (heights 3–49,973). Each pays the 50 BTC reward to its own P2PK public key, 1,097,650 BTC in rewards (1,097,652.49 BTC with four blocks' fees). The pattern is Sergio Demián Lerner's; the block list is Jameson Lopp's | Dataset bensig/patoshi-addresses @ 414637c, https://github.com/bensig/patoshi-addresses (`evidence/patoshi-addresses-README.md`); data built into `src/episodes/dompet-satoshi/patoshi.json` | — | 2026-11-19 |
| S6 | Our check: 42 dataset entries against mempool.space (40 random, plus blocks 3 and 9). The public key and 50 BTC match in every case; only block 9 is spent (it paid Hal Finney in block 170, 12 Jan 2009). Block 3: 9 Jan 2009 03:02:53 UTC; block 49,973: 10 Apr 2010 | mempool.space API, https://mempool.space/api/ (method in `research.md`) | — | 2026-11-19 |
| S7 | The ~1.1 M BTC figure is an estimate from the pattern; estimates range from 600,000 BTC | Digital Today, https://www.digitaltoday.co.kr/en/view/75114/; CoinMarketCap Academy on BIP-361 | 2026 | 2026-11-19 |
| S8 | The number of possible private keys is n − 1, where n is the secp256k1 group order, 115792089237316195423570985008687907852837564279074904382605163141518161494337 (78 digits, ≈ 1.16 × 10⁷⁷) | SEC 2 / secp256k1 standard parameters (Bitcoin) | — | 2026-11-19 |
| S9 | P2PK outputs expose the public key, which a large quantum computer could in theory use to recover the private key. No such machine exists; 2026 resource estimates are for machines not yet built | BIP-361 motivation (`evidence/bip-0361.mediawiki`); PostQuantum on IonQ's estimate, https://postquantum.com/post-quantum/ionq-secp256k1-resource-estimate/ | 2026 | 2026-11-19 |
| S10 | BIP-361 "Post Quantum Migration and Legacy Signature Sunset" (Lopp et al.), Status: Draft, BIP number assigned 2026-02-11, BSD-3-Clause. Phase A stops sends to quantum-vulnerable addresses; Phase B restricts legacy spends behind a rescue protocol (reported as freezing such coins). No activation date and no path to adoption at present | https://github.com/bitcoin/bips/blob/master/bip-0361.mediawiki; CoinMarketCap Academy; Cryptotimes, 15 Apr 2026 | 2026-04 | 2026-11-19 |
| S11 | On an exchange, the exchange holds the private keys (custodial account) | Definition | — | — |

The speech doesn't attribute the hack to a country: TRM, Chainalysis and Elliptic attribute it to TraderTraitor (North Korea), and North Korea denies it. TRM's own headline (which names North Korea) is shown in a document panel as TRM's claim, with TRM credited.

## Assets
| Asset (public path) | Origin | Licence / basis |
|---|---|---|
| `binance-logo.svg` | Wikimedia Commons, "File:Binance logo.svg" | Public domain (text logo); identifies the subject, unaltered |
| `whitepaper-p1.jpg` | Page 1 of the Bitcoin whitepaper, https://bitcoin.org/bitcoin.pdf, rendered with pdftoppm at 220 dpi | Public document distributed by bitcoin.org; editorial use |
| `mempool-block3.jpg` | Screenshot of https://mempool.space/tx/999e1c837c76a1b7fbb7e57baf87b309960f5ffefbf2a9b95dd890602272f644 (block 3 coinbase), taken 19 Nov 2026 with Playwright | Screenshot of a public block explorer showing public blockchain data; editorial use, credited |
| `bip361-github.jpg` | Screenshot of https://github.com/bitcoin/bips/blob/master/bip-0361.mediawiki, 19 Nov 2026 | BIP text BSD-3-Clause; page screenshot for editorial use, credited |
| `ibm-quantum-system-one.jpg` | Wikimedia Commons, "File:IBM Quantum System One.jpg" (OJB Quantum, 22 May 2024, IBM TJ Watson Research Center), 1280 px | CC BY 4.0, credited on screen "FOTO: OJB QUANTUM · CC BY 4.0" |
| `src/episodes/dompet-satoshi/patoshi.json` | Built from bensig/patoshi-addresses (S5) | Public blockchain data; credited "LERNER · LOPP" |
| Headline panel (TRM Labs) | The real headline in a Cryptonite-designed panel, no publisher masthead (the NPR panel was cut on 20 Nov) | Quotation for news reporting, credited |

## Illustrative elements (labelled on screen)
- The key-guess counter and hex strings: "ILUSTRASI" (and "TEBAKAN: ILUSTRASI" in the source line).
- The 3D safes: each one is a real Patoshi block in block order, but the safe shape is a metaphor.
