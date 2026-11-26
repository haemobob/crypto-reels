import {Composition} from 'remotion';
import {CryptoReel} from './compositions/CryptoReel';
import {LantaiStyle} from './compositions/LantaiStyle';
import {EmasStyle} from './episodes/emas-bank-sentral/Style';
import {LookTest} from './compositions/LookTest';
import {MotionKitDemo} from './compositions/MotionKitDemo';
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
    {/* Reference for the living-frame kit (src/components/motion.tsx, skill reel-motion). */}
    <Composition id="motion-kit" component={MotionKitDemo} durationInFrames={210} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Premium render pipeline test (drei studio + postprocessing): src/compositions/LookTest.tsx. */}
    <Composition id="look-test" component={LookTest} durationInFrames={150} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Style frames for the lantai-hammer rebuild (stills; input prop shot = hook | crowd | floor | payoff). */}
    <Composition id="lantai-style" component={LantaiStyle} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* Style frames for emas-bank-sentral (input prop shot = chart | vault). */}
    <Composition id="emas-style" component={EmasStyle} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} defaultProps={{shot: 'vault'}} />
    {/* Reel covers (thumbnails): one still per episode that defines a Cover. */}
    {Object.entries(episodes).map(([id, ep]) =>
      ep.Cover ? <Composition key={`cover-${id}`} id={`cover-${id}`} component={ep.Cover} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} /> : null,
    )}
  </>
);
