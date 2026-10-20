export const VIDEO = {width: 1080, height: 1920, fps: 30} as const;

// Instagram Reels UI danger zones.
export const safe = {top: 250, bottom: 350, side: 90} as const;

// One-word micro caption sits about 20% down the frame.
export const captionY = 384;

// Key visuals stay inside this band, clear of the caption and label zones.
export const visualBand = {top: 470, bottom: 1500} as const;
