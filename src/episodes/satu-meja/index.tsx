import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import captions from '../../../episodes/satu-meja/captions.json';
import config from '../../../episodes/satu-meja/episode.json';
import {Hi} from '../../components/Headline';
import {HeadlineTrack} from '../../components/HeadlineTrack';
import {useCues} from '../../lib/cues';
import type {EpisodeModule} from '../../lib/episode-module';
import type {Captions, EpisodeConfig} from '../../lib/types';
import {colors} from '../../theme/colors';
import {ease} from '../../theme/motion';
import {fonts} from '../../theme/typography';
import {InfoCard, life, PhotoCard, Portrait} from './Cards';
import {Pin, Tag, useView, WorldMap, type Highlight, type ViewDef} from './WorldMap';

// Layout (screen px): micro captions y≈384, headline zone centred at 590, map framed around y 1000,
// map window 740–1270 (photo cards sit in the same band), report cards 1296–1450, source line 1534.
const HEADLINE_Y = 590;
const SOURCE_Y = 1534;
const GOLD = '#FFD166';
const Gold = ({children}: {children: ReactNode}) => <span style={{color: GOLD}}>{children}</span>;

const V: Record<string, ViewDef> = {
  asia: {lon: 118, lat: 28, span: 64},
  shenzhen: {lon: 114.06, lat: 22.54, span: 12},
  pacific: {lon: 190, lat: 42, span: 250},
  japan: {lon: 137.5, lat: 36.5, span: 26},
  atlantic: {lon: -25, lat: 52, span: 150},
  europe: {lon: 14, lat: 51, span: 36},
  ukraine: {lon: 22, lat: 49, span: 44},
  japanSea: {lon: 132, lat: 35.5, span: 18},
  taiwan: {lon: 121, lat: 23.6, span: 14},
};

const OpeningTitle = ({until}: {until: number}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const r = interpolate(frame, [-8, 8], [0, 1], {extrapolateRight: 'clamp', easing: ease.out});
  const out = interpolate(frame, [until - 6, until], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: HEADLINE_Y, transform: `translateY(calc(-50% + ${(1 - r) * 60}px))`, opacity: interpolate(r, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}) * out, textAlign: 'center', fontFamily: fonts.heading, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.0, color: colors.text, fontSize: 104, textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>
      TRUMP, PUTIN, XI:
      <br />
      <Hi>SATU MEJA</Hi>
    </div>
  );
};

/** A dashed route between two points with a dot travelling along it (screen space). */
const Route = ({a, b, o, t, label, color = GOLD, bend = -0.25}: {a: [number, number]; b: [number, number]; o: number; t: number; label?: string; color?: string; bend?: number}) => {
  if (o <= 0.01) return null;
  const mxp = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const myp = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const q = (u: number): [number, number] => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * mxp + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * myp + u * u * b[1]];
  const n = 40;
  const pts = Array.from({length: Math.max(2, Math.round(n * t))}, (_, i) => q((i / n)));
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');
  const [hx, hy] = q(Math.min(1, t));
  const [lx, ly] = q(0.5);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      <path d={d} stroke={color} strokeWidth={4} fill="none" strokeDasharray="12 9" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={9} fill={color} />
      {label && t > 0.5 && (
        <g>
          <rect x={lx - label.length * 8.2 - 14} y={ly - 22} width={label.length * 16.4 + 28} height={40} rx={9} fill="rgba(5,11,24,0.92)" stroke={color} strokeWidth={2} />
          <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={22} fill="#FFFFFF">{label}</text>
        </g>
      )}
    </svg>
  );
};

/** Illustrative ship markers around Taiwan (positions are not real tracks; labelled ILUSTRASI on screen). */
const SHIPS = Array.from({length: 104}, (_, i) => {
  const r1 = Math.sin(i * 12.9898) * 43758.5453;
  const r2 = Math.sin(i * 78.233) * 12345.6789;
  const u = r1 - Math.floor(r1);
  const v = r2 - Math.floor(r2);
  const ang = u * Math.PI * 2;
  const rad = 1.7 + v * 1.6; // degrees from Taiwan's centre
  return {lon: 121 + Math.cos(ang) * rad * 1.15, lat: 23.6 + Math.sin(ang) * rad, order: v};
});

const Scene = () => {
  const f = useCurrentFrame();
  const {cue, word, narrationEnd} = useCues();
  const c = (k: string) => cue(k);
  const b = {
    hook: c('hook'), where: c('where'), decl: c('decl'), turn: c('turn'), japan: c('japan'), russia: c('russia'), europe: c('europe'), macron: c('macron'), jets: c('jets'), taiwan: c('taiwan'), pay: c('pay'), watch: c('watch'), end: narrationEnd,
    nuklir: word('nuklir', 0), trump: word('trump', 0), putin: word('putin', 0), xi: word('xi', 0), hampir: word('hampir', 0), sanksi: word('sanksi', 0), palantir: word('palantir', 0), wilayah: word('wilayah', 0), seratus: word('seratus', 0), deklarasi2: word('deklarasi', 1),
  };
  const view = useView([
    [0, V.asia], [b.where, V.shenzhen], [b.turn, V.pacific], [b.japan, V.japan], [b.russia, V.atlantic], [b.europe, V.europe], [b.macron, V.ukraine], [b.jets, V.japanSea], [b.taiwan, V.taiwan], [b.pay, V.pacific],
  ]);
  const on = (ranges: Array<[number, number]>) => Math.max(0, ...ranges.map(([a, z]) => life(f, a, z)));
  const highlights: Highlight[] = [
    {code: 'CHN', color: GOLD, o: on([[b.hook + 20, b.where], [b.turn, b.japan], [b.pay, b.end + 30]]) + 0.4 * on([[b.taiwan, b.pay]])},
    {code: 'USA', color: colors.electric, o: on([[b.turn, b.japan], [b.russia, b.europe], [b.pay, b.end + 30]])},
    {code: 'RUS', color: '#FFFFFF', o: on([[b.turn, b.japan], [b.russia, b.europe], [b.jets, b.taiwan], [b.pay, b.end + 30]])},
    {code: 'JPN', color: colors.light, o: on([[b.japan, b.russia], [b.jets, b.taiwan]])},
    {code: 'TWN', color: colors.negative, o: on([[b.taiwan, b.pay]])},
    {code: 'KOR', color: '#A8BDD8', o: on([[b.jets, b.taiwan]]) * 0.6},
    {code: 'FRA', color: colors.light, o: on([[b.europe, b.jets]])},
    {code: 'DEU', color: colors.light, o: on([[b.europe, b.macron]])},
    {code: 'NLD', color: colors.light, o: on([[b.europe, b.macron]])},
    {code: 'DNK', color: colors.light, o: on([[b.europe, b.macron]])},
    {code: 'UKR', color: GOLD, o: on([[b.macron, b.jets]])},
  ];
  const source =
    f < b.where ? 'FOTO: KREMLIN.RU (CC BY 4.0) · NUKLIR: SIPRI YEARBOOK 2026'
      : f < b.turn ? 'KREMLIN.RU, 19 NOV 2026 · FOTO: KREMLIN.RU (CC BY 4.0)'
        : f < b.japan ? 'PETA: NASA BLUE MARBLE · BATAS: NATURAL EARTH'
          : f < b.russia ? 'LAPORAN SCMP & NIKKEI, 13–14 NOV 2026 · FOTO: KORPS MARINIR AS (2024)'
            : f < b.europe ? 'NEWSWEEK, S&P GLOBAL · OKT 2026 · RUTE: ILUSTRASI'
              : f < b.macron ? 'REUTERS, 16 NOV 2026'
                : f < b.jets ? 'MACRON, DUBLIN, 12 NOV 2026 · FOTO: C. LICOPPE / UNI EROPA (CC BY 4.0)'
                  : f < b.taiwan ? 'KEMENHAN JEPANG, 17 NOV 2026 · JALUR: ILUSTRASI'
                    : f < b.pay ? 'REUTERS, 13 NOV 2026 · POSISI KAPAL: ILUSTRASI'
                      : 'FOTO: KREMLIN.RU (CC BY 4.0) · PETA: NASA, NATURAL EARTH';
  return (
    <AbsoluteFill style={{backgroundColor: '#03070F'}}>
      <WorldMap view={view} highlights={highlights}>
        {(cam) => (
          <>
            <Pin cam={cam} lon={114.06} lat={22.54} label="SHENZHEN" sub="APEC · 19 NOV 2026" o={life(f, b.where + 24, b.decl)} color={GOLD} />
            <Pin cam={cam} lon={139.69} lat={35.69} label="TOKYO" o={life(f, b.japan + 24, b.hampir)} color={colors.light} />
            <Route a={cam.toScreen(28.6, 60.35)} b={cam.toScreen(-74.0, 40.7)} o={life(f, b.russia + 20, b.europe)} t={interpolate(f, [b.russia + 24, b.russia + 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut})} label="DIESEL RUSIA → AS" bend={0.18} />
            <Pin cam={cam} lon={3} lat={56.5} label="PALANTIR (AS)" sub="DICARI PENGGANTINYA" o={life(f, b.palantir, b.macron)} color={GOLD} />
            <Pin cam={cam} lon={130.1} lat={34.24} label="OKINOSHIMA" sub="17 NOV · 2 PESAWAT DIDUGA RUSIA" o={life(f, b.wilayah, b.taiwan)} color={colors.negative} side="left" />
            {[0, 1].map((i) => (
              <Route key={i} a={cam.toScreen(133.5 + i * 0.8, 39.5 + i * 0.3)} b={cam.toScreen(129.6 + i * 0.6, 34.1 - i * 0.2)} o={life(f, b.jets + 16, b.taiwan)} t={interpolate(f, [b.jets + 20 + i * 6, b.jets + 70 + i * 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut})} color={colors.negative} bend={0.12} />
            ))}
            {f >= b.seratus - 10 && f < b.pay + 10 && (
              <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: life(f, b.seratus - 10, b.pay + 10)}}>
                {SHIPS.map((s, i) => {
                  const [x, y] = cam.toScreen(s.lon, s.lat);
                  const a = interpolate(f, [b.seratus - 10 + s.order * 40, b.seratus + s.order * 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                  return a <= 0.01 ? null : <circle key={i} cx={x} cy={y} r={6} fill={colors.negative} opacity={0.85 * a} stroke="#03070F" strokeWidth={1.5} />;
                })}
              </svg>
            )}
            <Pin cam={cam} lon={121} lat={23.6} label="TAIWAN" o={life(f, b.taiwan + 20, b.pay)} color={colors.negative} />
            {/* Country names in the wide views. */}
            <Tag cam={cam} lon={-100} lat={40} label="AS" o={life(f, b.turn + 20, b.japan)} color={colors.electric} />
            <Tag cam={cam} lon={260} lat={40} label="AS" o={life(f, b.turn + 20, b.japan)} color={colors.electric} />
            <Tag cam={cam} lon={95} lat={63} label="RUSIA" o={life(f, b.turn + 20, b.japan)} />
            <Tag cam={cam} lon={104} lat={34} label="CHINA" o={life(f, b.turn + 20, b.japan)} color={GOLD} />
            <Tag cam={cam} lon={60} lat={60} label="RUSIA" o={life(f, b.russia + 20, b.europe)} />
            <Tag cam={cam} lon={-86} lat={42} label="AS" o={life(f, b.russia + 20, b.europe)} color={colors.electric} />
            <Tag cam={cam} lon={138.5} lat={37.5} label="JEPANG" o={life(f, b.japan + 16, b.hampir)} color={colors.light} />
          </>
        )}
      </WorldMap>

      {/* Real people and places. */}
      <PhotoCard src="k01.jpg" from={b.hook + 28} to={b.where} credit="FOTO: KREMLIN.RU · SHENZHEN, 19 NOV 2026" focus="50% 45%" />
      <Portrait src="k10.jpg" from={b.trump} to={b.decl} x={250} y={1290} name="TRUMP" focus="45% 35%" zoom={1.5} color={colors.electric} />
      <Portrait src="k08.jpg" from={b.putin} to={b.decl} x={540} y={1290} name="PUTIN" focus="50% 30%" zoom={1.9} color="#FFFFFF" />
      <Portrait src="k04.jpg" from={b.xi} to={b.decl} x={830} y={1290} name="XI JINPING" focus="50% 28%" zoom={1.9} color={GOLD} />
      <InfoCard from={b.nuklir} to={b.where} source="SIPRI YEARBOOK 2026 · JANUARI 2026" tag="HULU LEDAK">3 arsenal nuklir terbesar dunia: Rusia, AS, China</InfoCard>
      <PhotoCard src="k09.jpg" from={b.decl} to={b.turn} credit="FOTO: KREMLIN.RU · MEJA TRILATERAL, SHENZHEN" focus="50% 55%" />
      <InfoCard from={b.decl + 16} to={b.turn} source="KREMLIN.RU · 19 NOV 2026" tag="DIADOPSI">"Russia-China-US Heads of State Declaration toward Peace"</InfoCard>
      <PhotoCard src="fuji.jpg" from={b.hampir} to={b.russia} credit="FOTO: KORPS MARINIR AS · JEPANG, 2024 (DOMAIN PUBLIK)" focus="50% 50%" />
      <InfoCard from={b.hampir + 12} to={b.russia} source="SCMP · NIKKEI · 13–14 NOV" tag="LAPORAN · BELUM FINAL">AS minta Jepang bayar ≈ 3× lipat untuk pasukan AS, mulai 2027</InfoCard>
      <InfoCard from={b.sanksi} to={b.europe} source="NEWSWEEK · S&P GLOBAL · OKT 2026" tag="9 OKT">Sanksi diesel Rusia dilonggarkan setelah kesepakatan Trump–Putin</InfoCard>
      <InfoCard from={b.palantir + 6} to={b.macron} source="REUTERS · 16 NOV 2026">Militer Eropa cari pengganti software AI militer Palantir</InfoCard>
      <PhotoCard src="macron.jpg" from={b.macron} to={b.jets} x={90} y={752} w={420} h={490} credit="ARSIP 2024 · C. LICOPPE/UE · CC BY 4.0" focus="64% 30%" zoom={1.7} push={0.05} />
      <div style={{position: 'absolute', left: 536, width: 454, top: 752, height: 490, boxSizing: 'border-box', padding: '40px 34px', borderRadius: 22, background: 'rgba(5,11,24,0.96)', border: `3px solid ${GOLD}`, opacity: life(f, b.macron + 10, b.jets), fontFamily: fonts.heading, fontWeight: 800, fontSize: 56, lineHeight: 1.06, color: '#FFFFFF'}}>
        "No more US support"
        <div style={{marginTop: 18, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: '0.04em'}}>EMMANUEL MACRON · DUBLIN, 12 NOV 2026</div>
        <div style={{marginTop: 10, fontFamily: fonts.body, fontWeight: 600, fontSize: 26, color: '#D7E3F4', lineHeight: 1.3}}>soal dukungan AS untuk Ukraina</div>
      </div>
      <InfoCard from={b.wilayah} to={b.taiwan} source="KEMENHAN JEPANG · 17 NOV 2026" accent={colors.negative} tag="DIDUGA RUSIA">2 pesawat masuk wilayah udara Jepang, ±3 menit masing-masing</InfoCard>
      <InfoCard from={b.seratus + 10} to={b.pay} source="REUTERS · 13 NOV 2026" accent={colors.negative} tag="ILUSTRASI POSISI">Lebih dari 100 kapal militer & penjaga pantai China, menurut pejabat Taiwan</InfoCard>
      <PhotoCard src="k03.jpg" from={b.pay + 20} to={b.end + 30} credit="FOTO: KREMLIN.RU · SHENZHEN, 19 NOV 2026" focus="55% 40%" push={0.05} />

      <OpeningTitle until={b.where} />
      <HeadlineTrack
        centerY={HEADLINE_Y}
        until={narrationEnd + 18}
        cues={[
          {from: b.where, content: <>SHENZHEN, CHINA<br /><Gold>19 NOV 2026</Gold></>, size: 92},
          {from: b.decl, content: <>DEKLARASI BERSAMA<br /><Hi>SOAL PERDAMAIAN</Hi></>, size: 86},
          {from: b.turn, content: <>TAPI PETA DUNIA<br /><Hi>BERGESER</Hi></>, size: 96},
          {from: b.japan, content: <>AS MINTA JEPANG<br />BAYAR <Gold>≈ 3× LIPAT</Gold></>, size: 84},
          {from: b.russia, content: <>SANKSI DIESEL RUSIA<br /><Gold>DILONGGARKAN</Gold></>, size: 84},
          {from: b.europe, content: <>EROPA CARI<br />PENGGANTI <Gold>PALANTIR</Gold></>, size: 84},
          {from: b.macron, content: <>MACRON: DUKUNGAN AS<br />UNTUK UKRAINA <Gold>HABIS</Gold></>, size: 76},
          {from: b.jets, content: <>PESAWAT DIDUGA RUSIA<br />MASUK <Hi>UDARA JEPANG</Hi></>, size: 76},
          {from: b.taiwan, content: <><Gold>100+ KAPAL</Gold><br />DI SEKITAR TAIWAN</>, size: 96},
          {from: b.pay, content: <>TATANAN DUNIA BARU?<br /><Hi>BELUM TENTU</Hi></>, size: 78},
          {from: b.deklarasi2, content: <>DEKLARASI = NIAT,<br />BUKAN PERJANJIAN</>, size: 84},
          {from: b.watch, content: <>AWASI: SETELAH<br /><Hi>FOTO JABAT TANGAN</Hi></>, size: 84},
        ]}
      />
      <div style={{position: 'absolute', left: 60, right: 60, top: SOURCE_Y, textAlign: 'center', fontFamily: fonts.mono, fontWeight: 500, fontSize: 18, letterSpacing: '0.03em', color: '#9FB3D6', lineHeight: 1.4, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{source}</div>
    </AbsoluteFill>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
