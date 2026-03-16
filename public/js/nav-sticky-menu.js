let menuObserverCleanup = null;

function initStickyMenu() {
  menuObserverCleanup?.();

  const menu = document.querySelector('.menu');
  const sentinel = document.querySelector('.menu-sentinel');

  if (!(menu instanceof HTMLElement) || !(sentinel instanceof HTMLElement)) {
    menuObserverCleanup = null;
    return;
  }

  /* ── Cache DOM references ── */
  const indicator = menu.querySelector('.nav-indicator');
  const brandLinks = Array.from(menu.querySelectorAll('.desktop-nav-brand-shell, .mobile-nav-brand-shell'));

  const desktopElements = [
    menu.querySelector('.desktop-nav-core'),
    menu.querySelector('.desktop-nav-inline-travel'),
  ].filter((el) => el instanceof HTMLElement);

  const mobileElements = [
    menu.querySelector('#open-menu'),
    menu.querySelector('.mobile-nav-current'),
  ].filter((el) => el instanceof HTMLElement);

  /* ── Cache media queries ── */
  const desktopMQ = window.matchMedia('(min-width: 769px)');
  const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── A11y sync ── */
  function syncA11y(atTop) {
    brandLinks.forEach((link) => {
      if (atTop) {
        link.removeAttribute('aria-hidden');
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('aria-hidden', 'true');
        link.setAttribute('tabindex', '-1');
      }
    });
  }

  /* ── State transition ── */
  function setMenuState(atTop, { animate = true } = {}) {
    const currentState = menu.classList.contains('at-top');

    if (currentState === atTop) {
      syncA11y(atTop);
      return;
    }

    const animatedElements = desktopMQ.matches ? desktopElements : mobileElements;

    animatedElements.forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
    });

    if (!animate || reducedMotionMQ.matches || animatedElements.length === 0) {
      menu.classList.toggle('at-top', atTop);
      syncA11y(atTop);
      window.cynosura?.navIndicator?.init(false);
      return;
    }

    if (indicator instanceof HTMLElement) {
      indicator.style.transition = 'none';
    }

    const beforeRects = new Map(animatedElements.map((el) => [el, el.getBoundingClientRect()]));

    menu.classList.toggle('at-top', atTop);
    syncA11y(atTop);

    animatedElements.forEach((el) => {
      const before = beforeRects.get(el);

      if (!before) {
        return;
      }

      const after = el.getBoundingClientRect();
      const deltaX = before.left - after.left;
      const deltaY = before.top - after.top;

      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
        return;
      }

      const finalTransform = window.getComputedStyle(el).transform;
      const prefix = finalTransform === 'none' ? '' : `${finalTransform} `;

      el.animate(
        [
          { transform: `${prefix}translate(${deltaX}px, ${deltaY}px)` },
          { transform: finalTransform === 'none' ? 'none' : finalTransform },
        ],
        {
          duration: 480,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }
      );
    });

    /* Wait for FLIP to settle, then re-sync indicator once */
    const longest = animatedElements.reduce((max, el) => {
      const anims = el.getAnimations();
      return anims.length > 0 ? anims[0] : max;
    }, null);

    const onFinish = () => {
      if (indicator instanceof HTMLElement) {
        indicator.style.transition = '';
      }

      window.cynosura?.navIndicator?.init(false);
    };

    if (longest) {
      longest.finished.then(onFinish);
    } else {
      onFinish();
    }
  }

  /* ── Scroll tracking ── */
  let isFirstUpdate = true;
  let currentAtTop = false;
  let scrollRAF = null;
  const HYSTERESIS = 30;
  let sentinelBottom = 0;

  function refreshSentinelBottom() {
    sentinelBottom = sentinel.offsetTop + sentinel.offsetHeight;
  }

  function update() {
    const scrollY = window.scrollY ?? 0;

    if (!currentAtTop && scrollY > sentinelBottom) {
      currentAtTop = true;
      setMenuState(true, { animate: !isFirstUpdate });
      isFirstUpdate = false;
    } else if (currentAtTop && scrollY < sentinelBottom - HYSTERESIS) {
      currentAtTop = false;
      setMenuState(false, { animate: !isFirstUpdate });
      isFirstUpdate = false;
    }
  }

  const onScroll = () => {
    if (!scrollRAF) {
      scrollRAF = requestAnimationFrame(() => {
        scrollRAF = null;
        update();
      });
    }
  };

  const onResize = () => {
    refreshSentinelBottom();
    onScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  refreshSentinelBottom();
  update();

  menuObserverCleanup = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);

    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF);
      scrollRAF = null;
    }
  };
}

document.addEventListener('astro:page-load', initStickyMenu);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStickyMenu, { once: true });
} else {
  initStickyMenu();
}
