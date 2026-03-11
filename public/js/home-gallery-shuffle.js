(function () {
  const masonry = document.querySelector('.home-gallery-masonry');

  if (!(masonry instanceof HTMLElement)) {
    return;
  }

  const cards = Array.from(masonry.children);

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }

  masonry.replaceChildren(...cards);

  requestAnimationFrame(() => {
    masonry.dataset.shuffleState = 'ready';
  });
})();
