// Say hello — front-end only submit. Require a non-empty email, then replace
// the form with a gentle thank-you. No backend is wired.

export function initContact(): void {
  const form = document.querySelector<HTMLFormElement>('.say-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector<HTMLInputElement>('input[type="email"]');
    if (!email || !email.value.trim()) {
      email?.focus();
      return;
    }
    const thanks = document.createElement('p');
    thanks.className = 'say-thanks';
    thanks.innerHTML =
      '<span class="say-tick">✓</span> Thank you — I\'ll be in touch, gently.';
    form.replaceWith(thanks);
  });
}
