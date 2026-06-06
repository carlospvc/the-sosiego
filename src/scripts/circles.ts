// Circles landing — two small behaviours, isolated to this page:
//  1) the studio return bar gains a blurred paper background once scrolled past 24px
//  2) .reveal elements fade + rise in via IntersectionObserver (hero ships .in)

export function initCircles(): void {
  // studio return bar — blurred paper background once scrolled
  const bar = document.getElementById('sosbar');
  if (bar) {
    const onScroll = (): void => bar.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // reveal on scroll — calm fade + rise, the Circles device
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
  if (!els.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach((el) => io.observe(el));
}
