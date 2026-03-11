(function () {
  const initArticleTimeline = () => {
    const timeline = document.querySelector('.home-article-scroll');

    if (!(timeline instanceof HTMLElement)) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
      });
    });
  };

  initArticleTimeline();

  if (!window.__articleTimelineBound) {
    document.addEventListener('astro:page-load', initArticleTimeline);
    window.__articleTimelineBound = true;
  }
})();
