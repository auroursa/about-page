(function () {
  const scheduleAfterLayoutSettled = (callback) => {
    const afterLayoutSettled = window.cynosura?.afterLayoutSettled;

    if (typeof afterLayoutSettled === 'function') {
      afterLayoutSettled(callback);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  const initArticleTimeline = () => {
    const timeline = document.querySelector('.home-article-scroll');
    const timelineRoot = timeline?.closest('.home-article-timeline');
    const progress = timelineRoot?.querySelector('.home-article-progress');

    if (!(timeline instanceof HTMLElement)) {
      return;
    }

    timeline.__timelineCleanup?.();

    let progressHideTimer = null;
    let scrollRAF = null;

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

      progressHideTimer = setTimeout(() => {
        progress.classList.remove('is-visible');
      }, 700);
    };

    const flushScrollState = () => {
      scrollRAF = null;
      updateProgress();
      revealProgress();
    };

    const handler = () => {
      if (scrollRAF !== null) {
        return;
      }

      scrollRAF = requestAnimationFrame(flushScrollState);
    };

    const syncTimelineToEnd = () => {
      const targetScrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);

      if (Math.abs(timeline.scrollLeft - targetScrollLeft) > 1) {
        timeline.scrollLeft = targetScrollLeft;
      }

      updateProgress();
    };

    const scheduleInitialSync = () => {
      scheduleAfterLayoutSettled(syncTimelineToEnd);
    };

    scheduleInitialSync();

    timeline.addEventListener('scroll', handler, { passive: true });

    timeline.__timelineCleanup = () => {
      timeline.removeEventListener('scroll', handler);

      if (scrollRAF !== null) {
        cancelAnimationFrame(scrollRAF);
        scrollRAF = null;
      }

      if (progressHideTimer) {
        clearTimeout(progressHideTimer);
        progressHideTimer = null;
      }

      if (progress instanceof HTMLElement) {
        progress.classList.remove('is-visible');
      }
    };
  };

  document.addEventListener('astro:page-load', initArticleTimeline);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticleTimeline, { once: true });
  } else {
    initArticleTimeline();
  }
})();
