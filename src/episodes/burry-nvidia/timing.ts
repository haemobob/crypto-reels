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
  payoff: C('payoff'), panik: W('panik'), ambil: W('ambil'), hasil: W('hasil'), kalau: W('kalau'), untungnya: W('untungnya'), kemudian: W('kemudian'), balik: W('balik'), memantul: W('memantul'),
  // takeaway
  takeaway: C('takeaway'), setengah: W('setengah'), leverage: W('leverage'), futures: W('futures'), tinggal: W('tinggal'), setengahnya: W('setengahnya'), bertahan: W('bertahan'),
  end: Math.round(cap.durationSec * FPS),
};
