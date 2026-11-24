import captions from '../../../episodes/burry-nvidia/captions.json';
import type {Captions} from '../../lib/types';

/** Beat and word frames, computed once from captions.json (so logoHide can use them at module level too). */
const cap = captions as Captions;
const FPS = 30;
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const W = (t: string, n = 0) => {
  const hits = cap.words.filter((w) => norm(w.text) === t);
  if (!hits[n]) throw new Error(`burry-nvidia: word "${t}" #${n} not in captions`);
  return Math.round(hits[n].start * FPS);
};
const C = (k: string) => Math.round(cap.cues[k] * FPS);

export const T = {
  // hook
  mundur: W('mundur'), ceo: W('ceo'), sahamnya: W('sahamnya'), delapan: W('delapan'), bitcoin: W('bitcoin'), banyak: W('banyak'), rungkad: W('rungkad'),
  tapi: W('tapi'), trader: W('trader'), cuan: W('cuan'), michael: W('michael'),
  // known
  known: C('known'), film: W('film'), tahun: W('tahun'), bertaruh: W('bertaruh'), jebol: W('jebol'), krisis: W('krisis'), investornya: W('investornya'), tujuh: W('tujuh'),
  // bet
  bet: C('bet'), ketahuan: W('ketahuan'), turun: W('turun'), harganya: W('harganya'),
  // pain
  pain: C('pain'), naik: W('naik'), oktober: W('oktober'), minus: W('minus'),
  // payoff
  payoff: C('payoff'), panik: W('panik'), ambil: W('ambil'), hasil: W('hasil'), kalau: W('kalau'), untungnya: W('untungnya'),
  // timing: the calls on the same day, Huang back three days later
  timing: C('timing'), call: W('call'), naik2: W('naik', 1), kemudian: W('kemudian'), balik: W('balik'), melonjak: W('melonjak'),
  // spec: the timing looked too perfect; it was all disclosed the same day
  spec: C('spec'), pas: W('pas'), berspekulasi: W('berspekulasi'), terbuka: W('terbuka'), kebetulan: W('kebetulan'), insting: W('insting'), benar: W('benar'),
  end: Math.round(cap.durationSec * FPS),
};
