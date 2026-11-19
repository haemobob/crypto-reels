# Retention brief — dompet-satoshi

## Viewer reward
- **Who it is for:** Indonesian crypto holders, especially those who keep coins on an exchange, and anyone who saw the Binance hack news.
- **Viewer's problem or misconception:** "If Binance can lose $6.3 billion, Bitcoin itself must be hackable", or "Satoshi's coins are safe because of some secret super-wallet".
- **What exactly they learn:**
  - The record Binance theft didn't break Bitcoin. It went through a person (a fake job interview) and an online hot wallet.
  - Satoshi's ~1.1 M BTC is about 22,000 separate 50-BTC locks that have never been used, so the only attack is guessing a key out of a 78-digit number of possibilities.
  - The one real long-term worry is quantum computers reading exposed public keys, and there is already a draft to freeze such coins.
- **Why it matters to an Indonesian crypto investor:**
  - Most of them hold on exchanges, where the exchange holds the keys.
  - Fake-recruiter job scams are common, and the same trick hit Binance's engineer.
- **What they keep:** a mental model, "hacks break where the key lives and the person who uses it, not Bitcoin's math", plus a check: on an exchange, the exchange holds your keys.

## Discovery sequence
- **Early useful insight (by 8–12 s):** the hack went through a person and an online hot wallet, not through Bitcoin's math.
- **Visual demonstration:**
  - the chain fake recruiter → laptop → hot wallet → funds out;
  - then the 3D field of 21,953 real Patoshi blocks, each a separate 50-BTC lock, built from the actual dataset;
  - then the 78-digit number;
  - then a real P2PK public key from block 3 with "KUNCI PUBLIK TERLIHAT".
- **Final takeaway:** the 20-minute theft broke a key store and a person, not Bitcoin; on an exchange, the exchange holds your keys.
- **Real assets:**
  - Binance logo;
  - TRM Labs / NPR headlines in designed panels;
  - the Bitcoin whitepaper's title page;
  - real block data (mempool.space);
  - the Patoshi dataset;
  - the BIP-361 document (BSD-licensed).
  - None needs to come from the user.

## Concept scorecard
| Criterion | Score | Why |
|---|---|---|
| Viewer relevance | 5 | The biggest crypto hack ever, three weeks old, on the exchange many Indonesians use |
| Educational payoff | 4 | A clear model of where hacks happen, plus how Satoshi's coins are actually stored |
| Retention structure | 4 | Hack → contradiction → how → why Satoshi differs → 22,000 locks → 78 digits → the one real risk → payoff |
| Credibility | 4 | On-chain data we checked ourselves; the attribution is labelled an estimate and the BIP a draft |
| Visual explanation | 4 | The real dataset in 3D, the attack chain and the real public key |

Concept score: 84/100

## V3
- **Audience:** Indonesian retail crypto holders.
- **Consequence:** where your coins sit decides what can be stolen.
- **Counterintuitive fact:** the largest exchange lost 18,270 BTC in minutes, yet about 60 times that amount, sitting in plain view on the blockchain for almost 18 years, has never been touched.
- **Evidence:**
  - TRM Labs and Chainalysis, 30 Oct 2026;
  - Binance's assessment via NPR, 3 Nov 2026;
  - the Patoshi dataset, checked on mempool.space on 19 Nov 2026.
- **One-sentence payoff:** Bitcoin wasn't broken; key storage and people were.
- **Misconception:** "Bitcoin got hacked", or "Satoshi has one super-secure wallet".
- **Share trigger:** a friend who keeps everything on an exchange, or who is job hunting online.
- **Emotional shape:** alarm (20 minutes) → surprise (the untouched coins) → clarity → a sober caveat → a practical check.
- **Chosen length:** 65–80 s. Two linked stories (the hack and Satoshi's storage) plus the honest caveat; the user asked for both the "why" and the breakdown. A shorter cut would drop either the breakdown or the quantum caveat.
