// Honour prefers-reduced-motion: hold background videos on their poster frame
// instead of autoplaying. Otherwise nudge playback (autoplay can be deferred).

export function initVideo(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = document.querySelectorAll<HTMLVideoElement>('.hero-bg, .who-hero-vid');
  videos.forEach((v) => {
    if (reduce) {
      v.removeAttribute('autoplay');
      v.pause();
    } else {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  });
}
