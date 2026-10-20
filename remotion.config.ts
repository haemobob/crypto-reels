import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
// WebGL for @remotion/three: ANGLE on Windows/macOS, SwiftShader on Linux (override with REMOTION_GL).
Config.setChromiumOpenGlRenderer(
  (process.env.REMOTION_GL as 'angle' | 'swangle' | undefined) ??
    (process.platform === 'linux' ? 'swangle' : 'angle'),
);
