let savedIndicatorLeft = null;
let savedIndicatorWidth = null;
let queuedAnimate = false;
let queuedFrame = null;

function applyIndicatorTransition(indicator) {
  indicator.style.transition = [
    'top var(--motion-nav-indicator-duration, 240ms) var(--motion-nav-indicator-easing, cubic-bezier(0.22, 1, 0.36, 1))',
    'left var(--motion-nav-indicator-duration, 240ms) var(--motion-nav-indicator-easing, cubic-bezier(0.22, 1, 0.36, 1))',
    'width var(--motion-nav-indicator-duration, 240ms) var(--motion-nav-indicator-easing, cubic-bezier(0.22, 1, 0.36, 1))',
    'height var(--motion-nav-indicator-duration, 240ms) var(--motion-nav-indicator-easing, cubic-bezier(0.22, 1, 0.36, 1))',
    'opacity 200ms ease',
  ].join(', ');
}

function scheduleAfterLayoutSettled(callback) {
  const afterLayoutSettled = window.cynosura?.afterLayoutSettled;

  if (typeof afterLayoutSettled === 'function') {
    afterLayoutSettled(callback);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

function queueNavIndicatorInit(animate) {
  queuedAnimate = queuedAnimate || animate;

  if (queuedFrame !== null) {
    return;
  }

  queuedFrame = requestAnimationFrame(() => {
    const shouldAnimate = queuedAnimate;
    queuedAnimate = false;
    queuedFrame = null;
    initNavIndicator(shouldAnimate);
  });
}

function scheduleIndicatorInit(animate, { waitForLayout = true } = {}) {
  if (waitForLayout) {
    scheduleAfterLayoutSettled(() => {
      queueNavIndicatorInit(animate);
    });
    return;
  }

  queueNavIndicatorInit(animate);
}

function initNavIndicator(animate) {
  const core = document.querySelector('.desktop-nav-core');
  const indicator = core?.querySelector('.nav-indicator');
  const activeBtn = core?.querySelector('.nav-active-btn');

  if (!core || !indicator || !activeBtn) {
    if (indicator) {
      indicator.style.opacity = '0';
    }

    savedIndicatorLeft = null;
    savedIndicatorWidth = null;
    return;
  }

  const coreRect = core.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const newLeft = btnRect.left - coreRect.left;
  const newWidth = btnRect.width;
  const newTop = btnRect.top - coreRect.top;
  const newHeight = btnRect.height;

  if (animate && savedIndicatorLeft !== null) {
    indicator.style.transition = 'none';
    indicator.style.top = `${newTop}px`;
    indicator.style.left = `${savedIndicatorLeft}px`;
    indicator.style.width = `${savedIndicatorWidth}px`;
    indicator.style.height = `${newHeight}px`;
    indicator.style.opacity = '1';

    requestAnimationFrame(() => {
      applyIndicatorTransition(indicator);
      indicator.style.left = `${newLeft}px`;
      indicator.style.width = `${newWidth}px`;
    });
  } else {
    indicator.style.transition = 'none';
    indicator.style.top = `${newTop}px`;
    indicator.style.left = `${newLeft}px`;
    indicator.style.width = `${newWidth}px`;
    indicator.style.height = `${newHeight}px`;
    indicator.style.opacity = '1';

    requestAnimationFrame(() => {
      applyIndicatorTransition(indicator);
    });
  }

  savedIndicatorLeft = null;
  savedIndicatorWidth = null;
}

function saveNavIndicatorPosition() {
  const core = document.querySelector('.desktop-nav-core');
  const indicator = core?.querySelector('.nav-indicator');

  if (indicator && indicator.style.opacity === '1') {
    savedIndicatorLeft = parseFloat(indicator.style.left);
    savedIndicatorWidth = parseFloat(indicator.style.width);
  }
}

function animateIndicatorTo(indicator, core, targetEl) {
  const coreRect = core.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  applyIndicatorTransition(indicator);
  indicator.style.left = `${targetRect.left - coreRect.left}px`;
  indicator.style.width = `${targetRect.width}px`;
  indicator.style.top = `${targetRect.top - coreRect.top}px`;
  indicator.style.height = `${targetRect.height}px`;
  indicator.style.opacity = '1';
}

function initTravelLinkInterceptor() {
  const travelLink = document.querySelector('.desktop-nav-inline-travel');
  if (!travelLink) return;

  let navigating = false;

  const onClick = (e) => {
    if (navigating || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const core = document.querySelector('.desktop-nav-core');
    const indicator = core?.querySelector('.nav-indicator');
    if (!core || !indicator) return;

    e.preventDefault();
    navigating = true;

    // Deactivate current active button
    const activeBtn = core.querySelector('.nav-active-btn');
    if (activeBtn) {
      activeBtn.classList.remove('nav-active-btn', 'text-[var(--main-color)]', 'hover:bg-transparent');
      activeBtn.querySelectorAll('svg, span').forEach((el) => {
        el.classList.remove('text-[var(--main-color)]');
      });
    }

    // Highlight the travel button
    travelLink.classList.add('text-[var(--main-color)]', 'hover:bg-transparent');
    travelLink.querySelectorAll('svg, span').forEach((el) => {
      el.classList.add('text-[var(--main-color)]');
    });

    animateIndicatorTo(indicator, core, travelLink);

    const duration = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--motion-nav-indicator-duration') || '240',
      10,
    );

    setTimeout(() => {
      window.location.assign(travelLink.href);
    }, duration);
  };

  travelLink.addEventListener('click', onClick);
  return () => travelLink.removeEventListener('click', onClick);
}

let travelCleanup = null;

window.cynosura = window.cynosura ?? {};
window.cynosura.navIndicator = {
  init: initNavIndicator,
};

document.addEventListener('astro:before-swap', saveNavIndicatorPosition);
document.addEventListener('astro:after-swap', () => {
  scheduleIndicatorInit(true, { waitForLayout: false });
  travelCleanup?.();
  travelCleanup = initTravelLinkInterceptor();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scheduleIndicatorInit(false);
    travelCleanup = initTravelLinkInterceptor();
  }, { once: true });
} else {
  scheduleIndicatorInit(false);
  travelCleanup = initTravelLinkInterceptor();
}
