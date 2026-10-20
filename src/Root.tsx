import {Composition} from 'remotion';
import {CryptoReel} from './compositions/CryptoReel';
import {episodes} from './episodes';
import {brand} from './theme/brand';
import {VIDEO} from './theme/layout';
import {loadBrandFonts} from './theme/typography';

loadBrandFonts();

export const RemotionRoot = () => (
  <>
    {Object.entries(episodes).map(([id, ep]) => {
      const seconds = ep.captions.durationSec + (ep.config.tailSeconds ?? 0.6) + (ep.config.outro === false ? 0 : brand.outroSeconds);
      return (
        <Composition
          key={id}
          id={id}
          component={CryptoReel}
          durationInFrames={Math.ceil(seconds * VIDEO.fps)}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
          defaultProps={{episodeId: id}}
        />
      );
    })}
  </>
);
