let menuObserverCleanup = null;

function bindPageLifecycle(init) {
  document.addEventListener('astro:page-load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
}

function syncMenuA11y(menu, atTop) {
  const brandLinks = menu.querySelectorAll('.desktop-nav-brand-shell, .mobile-nav-brand-shell');

  brandLinks.forEach((link) => {
    if (!(link instanceof HTMLElement)) {
      return;
    }

    if (atTop) {
      link.removeAttribute('aria-hidden');
      link.removeAttribute('tabindex');
    } else {
      link.setAttribute('aria-hidden', 'true');
      link.setAttribute('tabindex', '-1');
    }
  });
}

function setStickyMenuState(menu, atTop, { animate = true } = {}) {
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentState = menu.classList.contains('at-top');

  const desktopElements = [
    menu.querySelector('.desktop-nav-core'),
    menu.querySelector('.desktop-nav-inline-travel'),
  ].filter((element) => element instanceof HTMLElement);

  const mobileElements = [
    menu.querySelector('#open-menu'),
    menu.querySelector('.mobile-nav-current'),
  ].filter((element) => element instanceof HTMLElement);

  const animatedElements = isDesktop ? desktopElements : mobileElements;

  if (currentState === atTop) {
    syncMenuA11y(menu, atTop);
    return;
  }

  animatedElements.forEach((element) => {
    element.getAnimations().forEach((animation) => animation.cancel());
  });

  if (!animate || prefersReducedMotion || animatedElements.length === 0) {
    menu.classList.toggle('at-top', atTop);
    syncMenuA11y(menu, atTop);
    window.cynosura?.navIndicator?.init(false);
    return;
  }

  const indicator = menu.querySelector('.nav-indicator');
  if (indicator instanceof HTMLElement) {
    indicator.style.transition = 'none';
  }

  const beforeRects = new Map(animatedElements.map((element) => [element, element.getBoundingClientRect()]));

  menu.classList.toggle('at-top', atTop);
  syncMenuA11y(menu, atTop);
  window.cynosura?.navIndicator?.init(false);

  animatedElements.forEach((element) => {
    const before = beforeRects.get(element);

    if (!before) {
      return;
    }

    const after = element.getBoundingClientRect();
    const deltaX = before.left - after.left;
    const deltaY = before.top - after.top;
    const finalTransform = window.getComputedStyle(element).transform;
    const finalTransformValue = finalTransform === 'none' ? '' : `${finalTransform} `;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
      return;
    }

    const animation = element.animate(
      [
        { transform: `${finalTransformValue}translate(${deltaX}px, ${deltaY}px)` },
        { transform: finalTransform === 'none' ? 'none' : finalTransform },
      ],
      {
        duration: 480,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    );

    animation.addEventListener('finish', () => {
      const navIndicator = menu.querySelector('.nav-indicator');

      if (navIndicator instanceof HTMLElement) {
        navIndicator.style.transition = '';
      }

      window.cynosura?.navIndicator?.init(false);
    }, { once: true });
  });
}

function initStickyMenu() {
  menuObserverCleanup?.();

  const menu = document.querySelector('.menu');
  const sentinel = document.querySelector('.menu-sentinel');

  if (!(menu instanceof HTMLElement) || !(sentinel instanceof HTMLElement)) {
    menuObserverCleanup = null;
    return;
  }

  let isFirstUpdate = true;
  let currentAtTop = false;
  let scrollRAF = null;
  const HYSTERESIS = 30;

  function update() {
    const rect = sentinel.getBoundingClientRect();

    if (!currentAtTop && rect.bottom < 0) {
      currentAtTop = true;
      setStickyMenuState(menu, true, { animate: !isFirstUpdate });
      isFirstUpdate = false;
    } else if (currentAtTop && rect.bottom > HYSTERESIS) {
      currentAtTop = false;
      setStickyMenuState(menu, false, { animate: !isFirstUpdate });
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

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  menuObserverCleanup = () => {
    window.removeEventListener('scroll', onScroll);

    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF);
      scrollRAF = null;
    }
  };
}

bindPageLifecycle(initStickyMenu);
