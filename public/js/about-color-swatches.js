function initAboutColorSwatches() {
  const swatches = document.querySelectorAll('.about-color-span[data-color]');

  swatches.forEach((swatch) => {
    if (!(swatch instanceof HTMLElement)) {
      return;
    }

    if (swatch.dataset.tooltipBound !== 'true') {
      let hideTimer;

      const showTooltip = () => {
        if (hideTimer) {
          clearTimeout(hideTimer);
        }

        const tooltip = swatch.querySelector('.about-color-tooltip');

        if (tooltip instanceof HTMLElement) {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        }
      };

      const hideTooltip = () => {
        if (hideTimer) {
          clearTimeout(hideTimer);
        }

        const tooltip = swatch.querySelector('.about-color-tooltip');

        if (tooltip instanceof HTMLElement) {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        }
      };

      const showTooltipTemporarily = () => {
        showTooltip();
        hideTimer = setTimeout(hideTooltip, 900);
      };

      swatch.addEventListener('mouseenter', showTooltip);
      swatch.addEventListener('mouseleave', hideTooltip);
      swatch.addEventListener('touchstart', showTooltip, { passive: true });
      swatch.addEventListener('focus', showTooltip);
      swatch.addEventListener('blur', hideTooltip);
      swatch.addEventListener('click', showTooltipTemporarily);
      swatch.dataset.tooltipBound = 'true';
    }

    if (swatch.dataset.copyBound !== 'true') {
      const color = swatch.dataset.color;

      if (!color) {
        return;
      }

      swatch.addEventListener('click', () => { navigator.clipboard.writeText(color).catch(() => {}); });
      swatch.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigator.clipboard.writeText(color).catch(() => {});
        }
      });

      swatch.dataset.copyBound = 'true';
    }

    const input = swatch.querySelector('input');

    if (input instanceof HTMLInputElement && input.dataset.selectBound !== 'true') {
      input.addEventListener('click', (event) => {
        event.stopPropagation();
        input.select();
      });

      input.addEventListener('focus', () => input.select());
      input.dataset.selectBound = 'true';
    }
  });
}

function bindPageLifecycle(init) {
  document.addEventListener('astro:page-load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
}

bindPageLifecycle(initAboutColorSwatches);
