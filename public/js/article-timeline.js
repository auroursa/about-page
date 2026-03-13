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

    timeline.__timelineCleanup?.();

    const handler = () => updateEdgeClasses(timeline);
    timeline.__scrollHandler = handler;
    let wheelFactor = -1;
    let wheelDirectionResolved = false;

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

      let nextScrollLeft = Math.min(maxScrollLeft, Math.max(0, timeline.scrollLeft + step * wheelFactor));

      if (nextScrollLeft === timeline.scrollLeft && !wheelDirectionResolved) {
        const flippedScrollLeft = Math.min(maxScrollLeft, Math.max(0, timeline.scrollLeft - step * wheelFactor));

        if (flippedScrollLeft !== timeline.scrollLeft) {
          wheelFactor *= -1;
          wheelDirectionResolved = true;
          nextScrollLeft = flippedScrollLeft;
        }
      }

      if (nextScrollLeft === timeline.scrollLeft) {
        return;
      }

      wheelDirectionResolved = true;

      timeline.scrollLeft = nextScrollLeft;
      updateEdgeClasses(timeline);
      event.preventDefault();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
        updateEdgeClasses(timeline);
      });
    });

    timeline.addEventListener('scroll', handler, { passive: true });
    timeline.addEventListener('wheel', onWheel, { passive: false });

    timeline.__timelineCleanup = () => {
      timeline.removeEventListener('scroll', handler);
      timeline.removeEventListener('wheel', onWheel);
    };
  };

  initArticleTimeline();

  if (!window.__articleTimelineBound) {
    document.addEventListener('astro:page-load', initArticleTimeline);
    window.__articleTimelineBound = true;
  }
})();
