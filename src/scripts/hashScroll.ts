// Cross-page hash landing (home only). When home is opened with a hash (e.g.
// arriving from /who-behind-it via /#hello), the Work images + web fonts reflow
// the page as they load. Re-pin to the target's live position until images and
// fonts settle, then stop. Cancel on the first user interaction.

export function initHashScroll(): void {
  const id = window.location.hash.replace('#', '');
  if (!id) return;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  let cancelled = false;
  const stop = (): void => { cancelled = true; };
  (['wheel', 'touchstart', 'keydown', 'pointerdown'] as const).forEach((e) =>
    window.addEventListener(e, stop, { once: true, passive: true })
  );

  const start = Date.now();
  let stableSince = 0;
  const settled = (): boolean =>
    Array.from(document.images).every((i) => i.complete) &&
    (!document.fonts || document.fonts.status === 'loaded');

  const iv = window.setInterval(() => {
    if (cancelled || Date.now() - start > 8000) {
      clearInterval(iv);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const target = Math.max(0, el.offsetTop - 72);
      if (Math.abs(window.scrollY - target) > 2) window.scrollTo({ top: target });
    }
    if (settled()) {
      if (!stableSince) stableSince = Date.now();
      else if (Date.now() - stableSince > 400) clearInterval(iv);
    } else {
      stableSince = 0;
    }
  }, 80);
}
