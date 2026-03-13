(function () {
  const initArticleTimeline = () => {
    const timeline = document.querySelector('.home-article-scroll');
    const timelineRoot = timeline?.closest('.home-article-timeline');
    const progress = timelineRoot?.querySelector('.home-article-progress');

    if (!(timeline instanceof HTMLElement)) {
      return;
    }

    timeline.__timelineCleanup?.();

    let progressHideTimer = null;

    const updateProgress = () => {
      if (!(progress instanceof HTMLElement)) {
        return;
      }

      const maxScrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
      const ratio = maxScrollLeft > 0 ? timeline.scrollLeft / maxScrollLeft : 0;
      const clamped = Math.min(1, Math.max(0, ratio));

      progress.style.setProperty('--timeline-progress', String(clamped));
      progress.classList.toggle('is-disabled', maxScrollLeft <= 1);
    };

    const revealProgress = () => {
      if (!(progress instanceof HTMLElement) || progress.classList.contains('is-disabled')) {
        return;
      }

      progress.classList.add('is-visible');

      if (progressHideTimer) {
        clearTimeout(progressHideTimer);
      }

      progressHideTimer = window.setTimeout(() => {
        progress.classList.remove('is-visible');
      }, 700);
    };

    const handler = () => {
      updateProgress();
      revealProgress();
    };
    timeline.__scrollHandler = handler;

    const onWheel = (event) => {
      if (event.deltaY === 0) {
        return;
      }

      const maxScrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);

      if (maxScrollLeft <= 0) {
        return;
      }

      const stepBase = event.deltaMode === 1
        ? event.deltaY * 16
        : event.deltaMode === 2
          ? event.deltaY * timeline.clientWidth
          : event.deltaY;

      const step = stepBase * 2.4;
      const nextScrollLeft = Math.min(maxScrollLeft, Math.max(0, timeline.scrollLeft + step));

      if (nextScrollLeft === timeline.scrollLeft) {
        return;
      }

      timeline.scrollLeft = nextScrollLeft;
      event.preventDefault();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
        updateProgress();
      });
    });

    timeline.addEventListener('scroll', handler, { passive: true });
    timeline.addEventListener('wheel', onWheel, { passive: false });

    timeline.__timelineCleanup = () => {
      timeline.removeEventListener('scroll', handler);
      timeline.removeEventListener('wheel', onWheel);

      if (progressHideTimer) {
        clearTimeout(progressHideTimer);
        progressHideTimer = null;
      }

      if (progress instanceof HTMLElement) {
        progress.classList.remove('is-visible');
      }
    };
  };

  initArticleTimeline();

  if (!window.__articleTimelineBound) {
    document.addEventListener('astro:page-load', initArticleTimeline);
    window.__articleTimelineBound = true;
  }
})();
