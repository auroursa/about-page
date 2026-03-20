/**
 * Skeleton loading screen for slow page transitions.
 *
 * Shows a shimmer skeleton overlay inside .page-transition-shell when
 * navigation takes longer than SHOW_DELAY ms.  The skeleton is removed
 * automatically when the new page swaps in.
 */

(() => {
  const SHOW_DELAY = 280;

  /* ── Skeleton HTML ─────────────────────────────────────────────── */

  const skeletonHTML = `
<div class="skeleton-overlay" aria-hidden="true">
  <div class="skeleton-card skeleton-card--hero">
    <div class="skeleton-line skeleton-line--title"></div>
    <div class="skeleton-line skeleton-line--subtitle"></div>
  </div>
  <div class="skeleton-card">
    <div class="skeleton-line skeleton-line--full"></div>
    <div class="skeleton-line skeleton-line--3q"></div>
    <div class="skeleton-line skeleton-line--half"></div>
  </div>
  <div class="skeleton-card">
    <div class="skeleton-line skeleton-line--full"></div>
    <div class="skeleton-line skeleton-line--3q"></div>
  </div>
  <div class="skeleton-card skeleton-card--short">
    <div class="skeleton-line skeleton-line--half"></div>
  </div>
</div>`;

  /* ── State ──────────────────────────────────────────────────────── */

  let timer = null;
  let overlay = null;

  /* ── Show / hide ────────────────────────────────────────────────── */

  function show() {
    const shell = document.querySelector('.page-transition-shell');
    if (!shell) return;

    shell.classList.add('skeleton-loading');
    shell.insertAdjacentHTML('beforeend', skeletonHTML);
    overlay = shell.lastElementChild;

    // Force layout so the enter transition plays.
    overlay?.offsetHeight;
    overlay?.classList.add('skeleton-overlay--visible');
  }

  function hide() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (overlay) {
      overlay.remove();
      overlay = null;
    }

    document.querySelector('.page-transition-shell')?.classList.remove('skeleton-loading');
  }

  /* ── Astro lifecycle ────────────────────────────────────────────── */

  document.addEventListener('astro:before-preparation', () => {
    hide();
    timer = setTimeout(show, SHOW_DELAY);
  });

  document.addEventListener('astro:before-swap', hide);
})();
