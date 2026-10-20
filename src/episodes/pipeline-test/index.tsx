import {AbsoluteFill, Sequence} from 'remotion';
import captions from '../../../episodes/pipeline-test/captions.json';
import config from '../../../episodes/pipeline-test/episode.json';
import {Ground} from '../../components/Ground';
import {Headline, Hi} from '../../components/Headline';
import {Label} from '../../components/Label';
import {ThesisCard} from '../../components/ThesisCard';
import type {EpisodeModule} from '../../lib/episode-module';
import {useCues} from '../../lib/cues';
import type {Captions, EpisodeConfig} from '../../lib/types';

// Pipeline check only: proves voice, cue timing, captions, fonts, logo and outro work together.
const Scene = () => {
  const {cue, narrationEnd} = useCues();
  return (
    <>
      <Sequence durationInFrames={cue('answer')}>
        <Ground polarity="navy">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 90px'}}>
            <Headline>Harga di layar ≠ harga yang kamu dapat</Headline>
          </AbsoluteFill>
        </Ground>
      </Sequence>
      <Sequence from={cue('answer')} durationInFrames={cue('payoff') - cue('answer')}>
        <Ground polarity="light">
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40, padding: '0 90px'}}>
            <Headline size={96}>
              Pembeli <Hi>tipis</Hi> → harga bergeser
            </Headline>
            <Label text="Tes pipeline" tone="muted" onLight />
          </AbsoluteFill>
        </Ground>
      </Sequence>
      <Sequence from={cue('payoff')} durationInFrames={narrationEnd + 30 - cue('payoff')}>
        <ThesisCard polarity="dark">
          Cek dulu <span style={{color: '#2997FF'}}>order book</span> sebelum beli.
        </ThesisCard>
      </Sequence>
    </>
  );
};

const episode: EpisodeModule = {config: config as EpisodeConfig, captions: captions as Captions, Scene};
export default episode;
