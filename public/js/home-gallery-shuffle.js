(function () {
  window.cynosura = window.cynosura ?? {};

  const getCardKey = (card, index) => {
    if (!(card instanceof HTMLElement)) {
      return `card-${index}`;
    }

    return card.dataset.galleryId || `card-${index}`;
  };

  const getStoredOrder = () => {
    const cynosura = window.cynosura ?? {};
    return Array.isArray(cynosura.homeGalleryOrder) ? cynosura.homeGalleryOrder : null;
  };

  const loadStoredOrder = (cards) => {
    const order = getStoredOrder();

    if (!Array.isArray(order) || order.length !== cards.length) {
      return null;
    }

    const cardMap = new Map(cards.map((card, index) => [getCardKey(card, index), card]));
    const orderedCards = order.map((key) => cardMap.get(key)).filter(Boolean);

    return orderedCards.length === cards.length ? orderedCards : null;
  };

  const storeOrder = (cards) => {
    const order = cards.map((card, index) => getCardKey(card, index));
    window.cynosura = window.cynosura ?? {};
    window.cynosura.homeGalleryOrder = order;
  };

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

    const storedCards = loadStoredOrder(cards);

    if (storedCards) {
      masonry.replaceChildren(...storedCards);
      requestAnimationFrame(() => {
        masonry.dataset.shuffleState = 'ready';
      });
      return;
    }

    for (let index = cards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }

    masonry.replaceChildren(...cards);
    storeOrder(cards);

    requestAnimationFrame(() => {
      masonry.dataset.shuffleState = 'ready';
    });
  };

  window.cynosura.initHomeGalleryShuffle = initGalleryShuffle;
})();
