// .reveal — soft fade + tiny rise once an element crosses into view.
// Inline styles win the cascade; CSS supplies the transition + initial state.

export function initReveal(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  if (!els.length) return;

  const show = (e: HTMLElement): void => {
    e.style.opacity = '1';
    e.style.transform = 'none';
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach(show);
    return;
  }

  let ticking = false;
  const update = (): void => {
    ticking = false;
    const vh = window.innerHeight;
    for (const e of els) {
      if (e.getBoundingClientRect().top < vh * 0.84) show(e);
    }
  };
  const onScroll = (): void => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  // Re-run once layout settles (images/fonts can reflow after first paint).
  requestAnimationFrame(update);
  setTimeout(update, 200);
  window.addEventListener('load', update);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
