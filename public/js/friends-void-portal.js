(() => {
  window.cynosura = window.cynosura ?? {};

  const state = window.cynosura.friendsVoidPortalState ?? {
    cleanup: null,
    bound: false,
  };
  window.cynosura.friendsVoidPortalState = state;

  const COLLAPSED_MAX_HEIGHT = '9.5rem';
  const COLLAPSED_MASK = 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)';

  const parseTimeToMs = (value) => {
    const normalized = value.trim();
    if (normalized.endsWith('ms')) {
      return Number.parseFloat(normalized);
    }
    if (normalized.endsWith('s')) {
      return Number.parseFloat(normalized) * 1000;
    }
    return 0;
  };

  const getMaxHeightTransitionMs = (element) => {
    const styles = window.getComputedStyle(element);
    const properties = styles.transitionProperty.split(',').map((value) => value.trim());
    const durations = styles.transitionDuration.split(',').map(parseTimeToMs);
    const delays = styles.transitionDelay.split(',').map(parseTimeToMs);
    const totalItems = Math.max(properties.length, durations.length, delays.length);

    let maxMatched = 0;
    let maxFallback = 0;

    for (let index = 0; index < totalItems; index += 1) {
      const property = properties[index % properties.length] ?? 'all';
      const duration = durations[index % durations.length] ?? 0;
      const delay = delays[index % delays.length] ?? 0;
      const total = duration + delay;

      if (total > maxFallback) {
        maxFallback = total;
      }

      if (property === 'max-height' || property === 'all') {
        if (total > maxMatched) {
          maxMatched = total;
        }
      }
    }

    return maxMatched || maxFallback;
  };

  const initFriendsVoidPortal = () => {
    state.cleanup?.();
    state.cleanup = null;

    const toggle = document.querySelector('.void-portal-toggle');
    const content = document.querySelector('.void-portal-content');

    if (!(toggle instanceof HTMLButtonElement) || !(content instanceof HTMLElement)) {
      return;
    }

    let expanded = toggle.getAttribute('aria-expanded') === 'true';
    let collapseFrame = 0;
    let settleTimer = 0;

    const clearPending = () => {
      if (collapseFrame) {
        window.cancelAnimationFrame(collapseFrame);
        collapseFrame = 0;
      }
      if (settleTimer) {
        window.clearTimeout(settleTimer);
        settleTimer = 0;
      }
    };

    const applyState = () => {
      clearPending();
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.style.transform = expanded ? 'rotate(180deg)' : '';

      if (expanded) {
        content.style.overflow = 'hidden';
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.maskImage = 'none';
        content.style.webkitMaskImage = 'none';

        const settleMs = getMaxHeightTransitionMs(content);
        settleTimer = window.setTimeout(() => {
          settleTimer = 0;
          if (!expanded) {
            return;
          }
          content.style.maxHeight = 'none';
          content.style.overflow = 'visible';
        }, settleMs);
      } else {
        content.style.overflow = 'hidden';
        content.style.maxHeight = COLLAPSED_MAX_HEIGHT;
        content.style.maskImage = COLLAPSED_MASK;
        content.style.webkitMaskImage = COLLAPSED_MASK;
      }
    };

    const onClick = () => {
      clearPending();

      if (expanded) {
        expanded = false;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.style.transform = '';

        if (content.style.maxHeight === 'none') {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
        content.style.overflow = 'hidden';
        content.style.maskImage = 'none';
        content.style.webkitMaskImage = 'none';

        collapseFrame = window.requestAnimationFrame(() => {
          collapseFrame = 0;
          applyState();
        });
        return;
      }

      expanded = true;
      applyState();
    };

    toggle.addEventListener('click', onClick);
    applyState();

    state.cleanup = () => {
      clearPending();
      toggle.removeEventListener('click', onClick);
    };
  };

  if (!state.bound) {
    document.addEventListener('astro:page-load', initFriendsVoidPortal);
    document.addEventListener('astro:before-swap', () => {
      state.cleanup?.();
      state.cleanup = null;
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFriendsVoidPortal, { once: true });
    } else {
      initFriendsVoidPortal();
    }

    state.bound = true;
    return;
  }

  initFriendsVoidPortal();
})();
