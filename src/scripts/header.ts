// Sticky header — toggle solid/over on scroll, page-aware in-page smooth
// scrolling, and (home only) scroll-spy for the "Work" link.

export function initHeader(): void {
  const hdr = document.querySelector<HTMLElement>('.hdr');
  if (!hdr) return;

  const page = hdr.dataset.page === 'who' ? 'who' : 'home';
  const workLink = hdr.querySelector<HTMLElement>('[data-nav="work"]');

  const setSolid = (): void => {
    let solid: boolean;
    if (page === 'home') {
      solid = window.scrollY > window.innerHeight * 0.72;
    } else {
      const hero = document.querySelector<HTMLElement>('.who-hero');
      const h = hero ? hero.offsetHeight : window.innerHeight * 0.6;
      solid = window.scrollY > h - 72;
    }
    hdr.classList.toggle('solid', solid);
    hdr.classList.toggle('over', !solid);
  };

  const scrollToId = (id: string): void => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 72), behavior: 'smooth' });
  };

  // In-page nav: intercept only links that target the current page.
  hdr.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const nav = a.dataset.nav;
      if (page === 'home') {
        if (nav === 'work') { e.preventDefault(); scrollToId('making'); }
        else if (nav === 'hello') { e.preventDefault(); scrollToId('hello'); }
        else if (nav === 'home') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        // nav === 'who' → let the browser navigate to /who-behind-it
      } else {
        if (nav === 'who') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        // nav === 'work' | 'hello' | 'home' → navigate to the home page
      }
    });
  });

  // Scroll-spy (home only): "Work" stays active until you pass #hello.
  let spy = (): void => {};
  if (page === 'home' && workLink) {
    const ids = ['making', 'hello'];
    spy = (): void => {
      const y = window.scrollY + 130;
      let cur = 'making';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      workLink.classList.toggle('act', cur === 'making');
    };
  }

  const onScroll = (): void => { setSolid(); spy(); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  initMobileNav(hdr);
}

// Hamburger → full-screen overlay. Locks body scroll while open; closes on a
// nav click or Escape. (In-page smooth scrolling is handled by the shared
// a[data-nav] handler above, since the overlay lives inside .hdr.)
function initMobileNav(hdr: HTMLElement): void {
  const toggle = hdr.querySelector<HTMLButtonElement>('.nav-toggle');
  const overlay = hdr.querySelector<HTMLElement>('.mobile-nav');
  if (!toggle || !overlay) return;

  const open = (): void => {
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = (): void => {
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () =>
    overlay.classList.contains('open') ? close() : open()
  );
  overlay.querySelectorAll('a[data-nav]').forEach((a) =>
    a.addEventListener('click', close)
  );
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
