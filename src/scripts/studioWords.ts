// Studio story/principles — scroll-linked word reveal. Each word's opacity is
// mapped to its position: faint (0.16) entering from the bottom, full (1) once
// risen into the reading band. Content at the very bottom can never reach the
// band, so near full-scroll we force everything to full opacity.

export function initStudioWords(): void {
  const words = Array.from(document.querySelectorAll<HTMLElement>('.studio .word'));
  if (!words.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    words.forEach((w) => (w.style.opacity = '1'));
    return;
  }

  let ticking = false;
  const update = (): void => {
    ticking = false;
    const vh = window.innerHeight;
    const start = vh * 0.9; // entering from the bottom — faint
    const end = vh * 0.55; // risen into the reading band — full
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
    for (const w of words) {
      const r = w.getBoundingClientRect().top;
      let o = atBottom ? 1 : (start - r) / (start - end);
      o = o < 0.16 ? 0.16 : o > 1 ? 1 : o;
      w.style.opacity = o.toFixed(3);
    }
  };
  const onScroll = (): void => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
