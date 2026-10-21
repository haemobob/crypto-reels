import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {BrandedOutro} from '../components/BrandedOutro';
import {CornerLogo} from '../components/CornerLogo';
import {MicroCaptions} from '../components/MicroCaptions';
import {episodes} from '../episodes';
import {EpisodeContext} from '../lib/cues';
import {brand} from '../theme/brand';

// The logo bug is on screen from the first frame (user decision, 21 Oct 2026).
const LOGO_AFTER_SEC = 0;

/** Master layers: episode -> logo bug -> captions -> outro, with the narration underneath. */
export const CryptoReel = ({episodeId}: {episodeId: string}) => {
  const {fps} = useVideoConfig();
  const ep = episodes[episodeId];
  if (!ep) throw new Error(`Episode "${episodeId}" is not registered in src/episodes/index.ts`);
  const {config, captions, Scene, captionMute, logoHide} = ep;
  const outroFrom = Math.round((captions.durationSec + (config.tailSeconds ?? 0.6)) * fps);
  const hasVoice = captions.words.length > 0;
  return (
    <EpisodeContext.Provider value={{episode: config, captions}}>
      <AbsoluteFill>
        <Sequence durationInFrames={outroFrom} name="Episode">
          <Scene />
          <CornerLogo from={LOGO_AFTER_SEC * fps} hide={logoHide} />
          {config.captions === 'micro' && <MicroCaptions words={captions.words} mute={captionMute} />}
        </Sequence>
        {config.outro !== false && (
          <Sequence from={outroFrom} durationInFrames={Math.round(brand.outroSeconds * fps)} name="Outro">
            <BrandedOutro />
          </Sequence>
        )}
        {hasVoice && <Audio src={staticFile(`episodes/${episodeId}/narration.wav`)} />}
      </AbsoluteFill>
    </EpisodeContext.Provider>
  );
};
