let heroPhotoInfoCleanup = null;

function initHeroPhotoInfo() {
  heroPhotoInfoCleanup?.();

  const onDocumentClick = (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('[data-hero-photo-info]');

    if (button instanceof HTMLElement) {
      button.classList.toggle('is-open');
      return;
    }

    document.querySelectorAll('[data-hero-photo-info].is-open').forEach((item) => {
      item.classList.remove('is-open');
    });
  };

  document.addEventListener('click', onDocumentClick);

  heroPhotoInfoCleanup = () => {
    document.removeEventListener('click', onDocumentClick);
  };
}

document.addEventListener('astro:page-load', initHeroPhotoInfo);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroPhotoInfo, { once: true });
} else {
  initHeroPhotoInfo();
}
