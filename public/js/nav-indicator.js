let savedIndicatorLeft = null;
let savedIndicatorWidth = null;
let queuedAnimate = false;
let queuedFrame = null;

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

function scheduleIndicatorInit(animate) {
  scheduleAfterLayoutSettled(() => {
    queueNavIndicatorInit(animate);
  });
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
      indicator.style.transition = '';
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
      indicator.style.transition = '';
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

window.cynosura = window.cynosura ?? {};
window.cynosura.navIndicator = {
  init: initNavIndicator,
};

document.addEventListener('astro:before-swap', saveNavIndicatorPosition);
document.addEventListener('astro:page-load', () => scheduleIndicatorInit(true));

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => scheduleIndicatorInit(false), { once: true });
} else {
  scheduleIndicatorInit(false);
}
