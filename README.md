# Cryptonite Reels

Indonesian crypto-education Instagram Reels (1080×1920, 30 fps), built with Remotion. Production rules are in `CLAUDE.md` and `.claude/rules/`.

## Set up on your PC (once)
1. Install [Node.js 22](https://nodejs.org) and [FFmpeg](https://ffmpeg.org/download.html) (make sure `ffmpeg` and `ffprobe` work in a terminal).
2. In this folder: `npm install`
3. Put your Google Cloud Text-to-Speech API key alone in a file named `google-tts-key.txt` here (it is gitignored), or set `GOOGLE_TTS_API_KEY`.

## Make an episode
| Step | Command |
|---|---|
| New episode | `npm run new -- <id> --title "Judul" --min 35 --max 60` |
| Generate the voice and word timings | `npm run voice -- <id>` |
| Preview | `npm run studio` |
| Check a frame / contact sheet | `npm run still -- <id> --sec 3` / `npm run still -- <id> --sheet` |
| Audits must both read PASS | `npm run audit -- <id>` |
| Final MP4 | `make-video.bat <id>` (or `npm run render -- <id>`) → `output/<id>.mp4` |

The first `npm run voice` downloads and builds whisper.cpp and its model (about 500 MB) into `.whisper/`; on Windows it downloads a prebuilt binary.
