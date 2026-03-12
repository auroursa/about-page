function initHeroPhotoInfo() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hero-photo-info]');

    if (btn) {
      btn.classList.toggle('is-open');
      return;
    }

    document.querySelectorAll('[data-hero-photo-info].is-open').forEach((el) => {
      el.classList.remove('is-open');
    });
  });
}

initHeroPhotoInfo();
