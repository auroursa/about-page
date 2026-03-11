(function () {
  const timeline = document.querySelector('.home-article-scroll');

  if (!(timeline instanceof HTMLElement)) {
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
    });
  });
})();
