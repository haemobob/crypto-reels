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
      // Same rounding as CryptoReel (episode until outroFrom, then the outro), so the last frame is never empty.
      const frames = Math.round((ep.captions.durationSec + (ep.config.tailSeconds ?? 0.6)) * VIDEO.fps) + (ep.config.outro === false ? 0 : Math.round(brand.outroSeconds * VIDEO.fps));
      return (
        <Composition
          key={id}
          id={id}
          component={CryptoReel}
          durationInFrames={frames}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
          defaultProps={{episodeId: id}}
        />
      );
    })}
  </>
);
