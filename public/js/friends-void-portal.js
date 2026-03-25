(() => {
  window.cynosura = window.cynosura ?? {};

  const state = window.cynosura.friendsVoidPortalState ?? {
    cleanup: null,
    bound: false,
  };
  window.cynosura.friendsVoidPortalState = state;

  const COLLAPSED_MAX_HEIGHT = '9.5rem';
  const COLLAPSED_MASK = 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)';

  const initFriendsVoidPortal = () => {
    state.cleanup?.();
    state.cleanup = null;

    const toggle = document.querySelector('.void-portal-toggle');
    const content = document.querySelector('.void-portal-content');

    if (!(toggle instanceof HTMLButtonElement) || !(content instanceof HTMLElement)) {
      return;
    }

    let expanded = toggle.getAttribute('aria-expanded') === 'true';

    const applyState = () => {
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.style.transform = expanded ? 'rotate(180deg)' : '';

      if (expanded) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.maskImage = 'none';
        content.style.webkitMaskImage = 'none';
        return;
      }

      content.style.maxHeight = COLLAPSED_MAX_HEIGHT;
      content.style.maskImage = COLLAPSED_MASK;
      content.style.webkitMaskImage = COLLAPSED_MASK;
    };

    const onClick = () => {
      expanded = !expanded;
      applyState();
    };

    toggle.addEventListener('click', onClick);
    applyState();

    state.cleanup = () => {
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
