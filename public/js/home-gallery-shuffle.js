(function () {
  const initGalleryShuffle = () => {
    const masonry = document.querySelector('.home-gallery-masonry');

    if (!(masonry instanceof HTMLElement)) {
      return;
    }

    const cards = Array.from(masonry.children);

    if (cards.length === 0) {
      masonry.dataset.shuffleState = 'ready';
      return;
    }

    for (let index = cards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }

    masonry.replaceChildren(...cards);

    requestAnimationFrame(() => {
      masonry.dataset.shuffleState = 'ready';
    });
  };

  initGalleryShuffle();

  if (!window.__homeGalleryShuffleBound) {
    document.addEventListener('astro:page-load', initGalleryShuffle);
    window.__homeGalleryShuffleBound = true;
  }
})();
