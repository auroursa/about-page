(function () {
  window.cynosura = window.cynosura ?? {};

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
    let resizeObserver = null;
    let isPointerInside = timeline.matches(':hover');
    const maxScrollLeft = () => Math.max(timeline.scrollWidth - timeline.clientWidth, 0);

    const looksLikeMouseWheel = (event) => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE || event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return true;
      }

      const legacyWheelDeltaY = typeof event.wheelDeltaY === 'number' ? Math.abs(event.wheelDeltaY) : 0;

      return legacyWheelDeltaY >= 120;
    };

    const scheduleScrollFeedback = () => {
      if (scrollRAF !== null) {
        return;
      }

      scrollRAF = requestAnimationFrame(flushScrollState);
    };

    const updateProgress = () => {
      if (!(progress instanceof HTMLElement)) {
        return;
      }

      const scrollLimit = maxScrollLeft();
      const ratio = scrollLimit > 0 ? timeline.scrollLeft / scrollLimit : 0;
      const clamped = Math.min(1, Math.max(0, ratio));

      progress.style.setProperty('--timeline-progress', String(clamped));
      progress.classList.toggle('is-disabled', scrollLimit <= 1);
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
      scheduleScrollFeedback();
    };

    const wheelHandler = (event) => {
      const scrollLimit = maxScrollLeft();

      if (
        scrollLimit <= 1 ||
        !isPointerInside ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        event.ctrlKey ||
        !looksLikeMouseWheel(event)
      ) {
        return;
      }

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? timeline.clientWidth * 0.9
          : event.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? 18
            : 1;
      const nextScrollLeft = Math.min(
        scrollLimit,
        Math.max(0, timeline.scrollLeft + event.deltaY * unit),
      );

      if (Math.abs(nextScrollLeft - timeline.scrollLeft) < 1) {
        return;
      }

      event.preventDefault();
      timeline.scrollLeft = nextScrollLeft;

      scheduleScrollFeedback();
    };

    const handlePointerEnter = () => {
      isPointerInside = true;
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
    };

    const syncTimelineToEnd = () => {
      const targetScrollLeft = maxScrollLeft();

      if (Math.abs(timeline.scrollLeft - targetScrollLeft) > 1) {
        timeline.scrollLeft = targetScrollLeft;
      }

      updateProgress();
    };

    const scheduleInitialSync = () => {
      scheduleAfterLayoutSettled(syncTimelineToEnd);
    };

    scheduleInitialSync();

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        scheduleAfterLayoutSettled(syncTimelineToEnd);
      });
      resizeObserver.observe(timeline);

      if (timelineRoot instanceof HTMLElement) {
        resizeObserver.observe(timelineRoot);
      }
    }

    timeline.addEventListener('scroll', handler, { passive: true });
    timeline.addEventListener('wheel', wheelHandler, { passive: false });
    timeline.addEventListener('pointerenter', handlePointerEnter);
    timeline.addEventListener('pointerleave', handlePointerLeave);

    timeline.__timelineCleanup = () => {
      timeline.removeEventListener('scroll', handler);
      timeline.removeEventListener('wheel', wheelHandler);
      timeline.removeEventListener('pointerenter', handlePointerEnter);
      timeline.removeEventListener('pointerleave', handlePointerLeave);

      if (scrollRAF !== null) {
        cancelAnimationFrame(scrollRAF);
        scrollRAF = null;
      }

      if (progressHideTimer) {
        clearTimeout(progressHideTimer);
        progressHideTimer = null;
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (progress instanceof HTMLElement) {
        progress.classList.remove('is-visible');
      }
    };
  };

  window.cynosura.initArticleTimeline = initArticleTimeline;
  initArticleTimeline();
})();
