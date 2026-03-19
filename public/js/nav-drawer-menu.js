let drawerCleanup = null;

const SECTION_LABELS = { '/': '首页', '/posts': '文章', '/friends': '友人', '/about': '关于' };
const DRAG_DISMISS_THRESHOLD = 0.35;
const PANEL_TRANSITION = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)';
const NAVIGATION_FALLBACK_MS = 420;

const onNextFrame = (callback) => {
  requestAnimationFrame(() => requestAnimationFrame(callback));
};

function bindPageLifecycle(init) {
  document.addEventListener('astro:page-load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
}

function trapFocus(container) {
  const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;

    const focusable = [...container.querySelectorAll(selector)].filter(
      (el) => el.offsetParent !== null
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}

function initDrawerMenu() {
  drawerCleanup?.();

  const openMenuButton = document.getElementById('open-menu');
  const closeMenuButton = document.getElementById('close-menu');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerPanel = document.getElementById('drawer-panel');

  if (!(openMenuButton instanceof HTMLElement)
    || !(closeMenuButton instanceof HTMLElement)
    || !(drawer instanceof HTMLElement)
    || !(drawerPanel instanceof HTMLElement)) {
    drawerCleanup = null;
    return;
  }

  const staggerItems = drawerPanel.querySelectorAll('.drawer-stagger');
  const scrollContent = drawerPanel.querySelector('.drawer-scroll-content');
  let focusTrapCleanup = null;

  // ── Scroll overflow indicator ──
  const checkScrollOverflow = () => {
    if (!scrollContent) return;

    const atBottom = scrollContent.scrollHeight - scrollContent.scrollTop - scrollContent.clientHeight < 4;
    const noOverflow = scrollContent.scrollHeight <= scrollContent.clientHeight;
    scrollContent.classList.toggle('at-bottom', atBottom || noOverflow);
  };

  scrollContent?.addEventListener('scroll', checkScrollOverflow, { passive: true });

  // ── Stagger helpers (fixes race condition on rapid open/close) ──
  const resetStagger = () => {
    staggerItems.forEach((item) => {
      if (!(item instanceof HTMLElement)) return;

      item.style.transition = 'none';
      item.style.transitionDelay = '';
      item.style.opacity = '0';
      item.style.transform = 'translateY(12px)';
    });
  };

  const animateStaggerIn = () => {
    onNextFrame(() => {
      staggerItems.forEach((item, index) => {
        if (!(item instanceof HTMLElement)) return;

        item.style.transition = '';
        item.style.transitionDelay = `${80 + index * 60}ms`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    });
  };

  const animateStaggerOut = () => {
    const lastIndex = staggerItems.length - 1;

    staggerItems.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) return;

      item.style.transition = '';
      item.style.transitionDelay = `${(lastIndex - index) * 40}ms`;
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
    });
  };

  // ── Close state cleanup ──
  let restoreFocusOnClose = false;

  const finishClose = () => {
    drawer.classList.remove('open');
    drawerPanel.classList.remove('open');
    clearDragStyles();
    openMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    focusTrapCleanup?.();
    focusTrapCleanup = null;

    if (restoreFocusOnClose) {
      openMenuButton.focus();
      restoreFocusOnClose = false;
    }
  };

  // ── Open / Close ──
  const openDrawer = ({ focusCloseButton = true } = {}) => {
    // Cancel pending close if reopening quickly
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    drawer.style.transition = '';
    drawer.style.backgroundColor = '';
    if (drawerBackdrop instanceof HTMLElement) {
      drawerBackdrop.style.transition = '';
      drawerBackdrop.style.opacity = '0';
    }
    resetStagger();

    drawer.classList.add('open');
    drawerPanel.classList.add('open');
    openMenuButton.setAttribute('aria-expanded', 'true');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    animateStaggerIn();

    if (drawerBackdrop instanceof HTMLElement) {
      onNextFrame(() => {
        drawerBackdrop.style.transition = 'opacity 300ms ease';
        drawerBackdrop.style.opacity = '1';
      });
    }

    focusTrapCleanup = trapFocus(drawerPanel);
    if (focusCloseButton) {
      closeMenuButton.focus();
    }

    onNextFrame(checkScrollOverflow);
  };

  let closeTimer = null;

  const closeDrawer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    drawerPanel.classList.remove('open');
    drawer.style.transition = 'background-color 300ms ease';
    onNextFrame(() => {
      drawer.style.backgroundColor = 'rgb(0 0 0 / 0)';
      if (drawerBackdrop instanceof HTMLElement) {
        drawerBackdrop.style.transition = 'opacity 300ms ease';
        drawerBackdrop.style.opacity = '0';
      }
    });
    animateStaggerOut();

    // Let stagger-out play during the container's 300ms CSS fade
    closeTimer = setTimeout(() => {
      closeTimer = null;
      finishClose();
    }, 300);
  };

  // ── Backdrop click ──
  const onBackdropClick = (event) => {
    if (!drawerPanel.contains(event.target)) {
      closeDrawer();
    }
  };

  // ── Escape key ──
  const onKeydown = (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) {
      restoreFocusOnClose = true;
      closeDrawer();
    }
  };

  // ── Real-time drag to close ──
  let dragState = null;

  const clearDragStyles = () => {
    drawerPanel.style.transition = '';
    drawerPanel.style.transform = '';
    drawer.style.transition = '';
    drawer.style.backgroundColor = '';
    if (drawerBackdrop instanceof HTMLElement) {
      drawerBackdrop.style.transition = '';
      drawerBackdrop.style.opacity = drawer.classList.contains('open') ? '1' : '0';
    }
  };

  const onPanelTouchStart = (e) => {
    if (!drawer.classList.contains('open')) return;

    dragState = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      direction: null,
      active: false,
    };
  };

  const onPanelTouchMove = (e) => {
    if (!dragState) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const dx = x - dragState.startX;
    const dy = y - dragState.startY;

    if (!dragState.direction) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        dragState.direction = (Math.abs(dx) > Math.abs(dy) && dx > 0) ? 'h' : 'v';

        if (dragState.direction === 'h') {
          dragState.active = true;
          drawerPanel.style.transition = 'none';
        }
      }

      return;
    }

    if (!dragState.active) return;

    e.preventDefault();

    const translateX = Math.max(0, dx);
    const panelWidth = drawerPanel.offsetWidth;
    const progress = Math.min(translateX / panelWidth, 1);

    drawerPanel.style.transform = `translateX(${translateX}px)`;
    drawer.style.backgroundColor = `rgb(0 0 0 / ${0.25 * (1 - progress)})`;
    if (drawerBackdrop instanceof HTMLElement) {
      drawerBackdrop.style.opacity = String(1 - progress);
    }
  };

  const onPanelTouchEnd = (e) => {
    if (!dragState?.active) {
      dragState = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - dragState.startX;
    const panelWidth = drawerPanel.offsetWidth;
    const progress = dx / panelWidth;
    dragState = null;

    if (progress > DRAG_DISMISS_THRESHOLD) {
      animateStaggerOut();

      drawerPanel.style.transition = PANEL_TRANSITION;
      drawer.style.transition = 'background-color 300ms ease';
      onNextFrame(() => {
        drawerPanel.style.transform = 'translateX(100%)';
        drawer.style.backgroundColor = 'rgb(0 0 0 / 0)';
        if (drawerBackdrop instanceof HTMLElement) {
          drawerBackdrop.style.transition = 'opacity 300ms ease';
          drawerBackdrop.style.opacity = '0';
        }
      });

      let cleaned = false;

      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        finishClose();
        clearDragStyles();
      };

      drawerPanel.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 400);
    } else {
      drawerPanel.style.transition = PANEL_TRANSITION;
      drawer.style.transition = 'background-color 300ms ease';
      onNextFrame(() => {
        drawerPanel.style.transform = '';
        drawer.style.backgroundColor = '';
        if (drawerBackdrop instanceof HTMLElement) {
          drawerBackdrop.style.transition = 'opacity 300ms ease';
          drawerBackdrop.style.opacity = '1';
        }
      });

      drawerPanel.addEventListener('transitionend', () => {
        drawerPanel.style.transition = '';
        drawer.style.transition = '';
      }, { once: true });
    }
  };

  drawerPanel.addEventListener('touchstart', onPanelTouchStart, { passive: true });
  drawerPanel.addEventListener('touchmove', onPanelTouchMove, { passive: false });
  drawerPanel.addEventListener('touchend', onPanelTouchEnd, { passive: true });

  // ── Edge swipe to open (from right edge) ──
  let edgeStartX = null;
  let edgeStartY = null;

  const onEdgeTouchStart = (e) => {
    if (drawer.classList.contains('open')) return;

    const x = e.touches[0].clientX;

    if (x > window.innerWidth - 20) {
      edgeStartX = x;
      edgeStartY = e.touches[0].clientY;
    }
  };

  const onEdgeTouchEnd = (e) => {
    if (edgeStartX == null) return;

    const deltaX = e.changedTouches[0].clientX - edgeStartX;
    const deltaY = e.changedTouches[0].clientY - edgeStartY;
    edgeStartX = null;
    edgeStartY = null;

    if (deltaX < -60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      openDrawer({ focusCloseButton: false });
    }
  };

  document.addEventListener('touchstart', onEdgeTouchStart, { passive: true });
  document.addEventListener('touchend', onEdgeTouchEnd, { passive: true });

  // ── Close drawer before View Transition swap ──
  const onBeforeSwap = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (drawer.classList.contains('open')) {
      resetStagger();
      clearDragStyles();
      finishClose();
    }
  };

  document.addEventListener('astro:before-swap', onBeforeSwap);

  // ── Sync mobile section title and link ──
  const navCurrentLink = document.querySelector('a.mobile-nav-current');
  const titleEl = navCurrentLink?.querySelector('.mobile-nav-title');

  if (titleEl && navCurrentLink) {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const sectionPath = Object.keys(SECTION_LABELS).find((p) => p !== '/' && path.startsWith(p)) || (path === '/' ? '/' : null);

    if (sectionPath) {
      const label = SECTION_LABELS[sectionPath];

      if (label && titleEl.textContent !== label) {
        titleEl.textContent = label;
      }

      navCurrentLink.setAttribute('href', sectionPath);
    }
  }

  // ── Nav current link: scroll to top if already on that page ──
  const onNavCurrentClick = (e) => {
    if (!navCurrentLink) return;

    const linkPath = navCurrentLink.getAttribute('href') || '/';
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

    if (linkPath === currentPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  navCurrentLink?.addEventListener('click', onNavCurrentClick);

  // ── Event listeners ──
  const links = drawer.querySelectorAll('a');
  let navigationTimer = null;
  let navigationTransitionCleanup = null;

  const clearPendingNavigation = () => {
    if (navigationTimer) {
      clearTimeout(navigationTimer);
      navigationTimer = null;
    }

    navigationTransitionCleanup?.();
    navigationTransitionCleanup = null;
  };

  const performDrawerNavigation = (link, destination) => {
    if (link.hasAttribute('data-astro-reload')) {
      window.location.assign(destination);
      return;
    }

    const astroNavigate = window.cynosura?.navigate;

    if (typeof astroNavigate === 'function') {
      const history = link.getAttribute('data-astro-history') || 'auto';
      astroNavigate(destination, { history });
      return;
    }

    window.location.assign(destination);
  };

  const scheduleNavigationAfterClose = (navigate) => {
    clearPendingNavigation();

    let handled = false;

    const finalizeNavigation = () => {
      if (handled) {
        return;
      }

      handled = true;
      clearPendingNavigation();
      onNextFrame(navigate);
    };

    const onPanelTransitionEnd = (event) => {
      if (event.target !== drawerPanel || event.propertyName !== 'transform') {
        return;
      }

      finalizeNavigation();
    };

    drawerPanel.addEventListener('transitionend', onPanelTransitionEnd);
    navigationTransitionCleanup = () => {
      drawerPanel.removeEventListener('transitionend', onPanelTransitionEnd);
    };

    navigationTimer = setTimeout(finalizeNavigation, NAVIGATION_FALLBACK_MS);
  };

  const shouldDelayNavigation = (link, event) => {
    if (!(link instanceof HTMLAnchorElement)) {
      return null;
    }

    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return null;
    }

    const href = link.getAttribute('href');

    if (!href || href.startsWith('#')) {
      return null;
    }

    if (link.hasAttribute('download')) {
      return null;
    }

    const target = link.getAttribute('target');

    if (target && target.toLowerCase() !== '_self') {
      return null;
    }

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return null;
      }

      return url.href;
    } catch {
      return null;
    }
  };

  const onDrawerLinkClick = (event) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }

    if (!drawer.classList.contains('open')) {
      return;
    }

    const destination = shouldDelayNavigation(target, event);

    if (!destination) {
      closeDrawer();
      return;
    }

    event.preventDefault();
    closeDrawer();
    scheduleNavigationAfterClose(() => {
      performDrawerNavigation(target, destination);
    });
  };

  openMenuButton.addEventListener('click', openDrawer);
  closeMenuButton.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeydown);
  links.forEach((link) => link.addEventListener('click', onDrawerLinkClick));

  drawerCleanup = () => {
    openMenuButton.removeEventListener('click', openDrawer);
    closeMenuButton.removeEventListener('click', closeDrawer);
    drawer.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKeydown);
    links.forEach((link) => link.removeEventListener('click', onDrawerLinkClick));
    drawerPanel.removeEventListener('touchstart', onPanelTouchStart);
    drawerPanel.removeEventListener('touchmove', onPanelTouchMove);
    drawerPanel.removeEventListener('touchend', onPanelTouchEnd);
    document.removeEventListener('touchstart', onEdgeTouchStart);
    document.removeEventListener('touchend', onEdgeTouchEnd);
    document.removeEventListener('astro:before-swap', onBeforeSwap);
    navCurrentLink?.removeEventListener('click', onNavCurrentClick);
    scrollContent?.removeEventListener('scroll', checkScrollOverflow);
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    clearPendingNavigation();
    focusTrapCleanup?.();
    document.body.style.overflow = '';
  };
}

bindPageLifecycle(initDrawerMenu);
