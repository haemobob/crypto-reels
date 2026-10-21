#!/bin/bash
# Setup script for the Cryptonite Reels cloud environment (paste into the environment's "Setup script").
# Reinstalls what can't live in the repo: the four plugins and the onetake skill (~200 MB).
# The smaller skills (hypit, design-dna, motion-design, gbro-collage-broll, three.js) are in .claude/skills/.
# Every step is allowed to fail without stopping the session; failures are logged.
set -u
log() { echo "[cryptonite-setup] $*"; }

if command -v claude >/dev/null 2>&1; then
  add_plugin() { # <github owner/repo> <plugin@marketplace> [sparse dirs...]
    local repo=$1 plugin=$2; shift 2
    local sparse=(); [ $# -gt 0 ] && sparse=(--sparse "$@")
    claude plugin marketplace add "$repo" "${sparse[@]}" >/dev/null 2>&1 || log "marketplace $repo: add failed (may already exist)"
    if claude plugin install "$plugin" --scope user >/dev/null 2>&1; then log "installed $plugin"; else log "install $plugin failed"; fi
  }
  add_plugin greensock/gsap-skills gsap-skills@gsap-skills
  add_plugin AThevon/genjutsu genjutsu@genjutsu .claude-plugin skills
  add_plugin heygen-com/hyperframes hyperframes@hyperframes .claude-plugin skills
  add_plugin lemomo-ai/lemo-opuscar lemo-opuscar@lemolab .claude-plugin plugin
else
  log "claude CLI not found; skipping plugins"
fi

if [ ! -d "$HOME/.claude/skills/onetake" ]; then
  mkdir -p "$HOME/.claude/skills"
  if git clone -q --depth 1 https://github.com/feitangyuan/onetake.git "$HOME/.claude/skills/onetake"; then
    rm -rf "$HOME/.claude/skills/onetake/.git"; log "installed onetake"
  else
    log "onetake clone failed"
  fi
fi
exit 0
