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

      progressHideTimer = setTimeout(() => {
        progress.classList.remove('is-visible');
      }, 700);
    };

    const handler = () => {
      updateProgress();
      revealProgress();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timeline.scrollLeft = Math.max(timeline.scrollWidth - timeline.clientWidth, 0);
        updateProgress();
      });
    });

    timeline.addEventListener('scroll', handler, { passive: true });

    timeline.__timelineCleanup = () => {
      timeline.removeEventListener('scroll', handler);

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
