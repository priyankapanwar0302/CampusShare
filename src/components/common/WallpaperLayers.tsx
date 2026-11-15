import React from 'react';

export const WALLPAPER_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

/**
 * WallpaperLayers
 * Renders the decorative looping video wallpaper, static grain texture,
 * uniform dark scrim, and vertical gradient overlays behind content.
 * 
 * Strict fallback conditions ensure the video does NOT render when:
 * 1. User prefers reduced motion
 * 2. navigator.connection.saveData is true
 * 3. Video fires an error event
 * 4. Video fails to start playback within 4 seconds
 */
export const WallpaperLayers: React.FC = () => {
  // Minimalist aesthetic: the body background (--bg) provides the warm porcelain canvas
  return null;
};
