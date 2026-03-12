(function () {
  const updateEdgeClasses = (el) => {
    const tolerance = 2;
    const noOverflow = el.scrollWidth - el.clientWidth <= tolerance;
    const atStart = el.scrollLeft <= tolerance;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - tolerance;

    el.classList.toggle('is-no-overflow', noOverflow);
    el.classList.toggle('is-at-start', !noOverflow && atStart);
    el.classList.toggle('is-at-end', !noOverflow && atEnd && !atStart);
  };

  const initArticleTimeline = () => {
    const timeline = document.querySelector('.home-article-scroll');

    if (!(timeline instanceof HTMLElement)) {
      return;
    }

    if (timeline.__scrollHandler) {
      timeline.removeEventListener('scroll', timeline.__scrollHandler);
    }

    const handler = () => updateEdgeClasses(timeline);
    timeline.__scrollHandler = handler;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
        updateEdgeClasses(timeline);
      });
    });

    timeline.addEventListener('scroll', handler, { passive: true });
  };

  initArticleTimeline();

  if (!window.__articleTimelineBound) {
    document.addEventListener('astro:page-load', initArticleTimeline);
    window.__articleTimelineBound = true;
  }
})();
