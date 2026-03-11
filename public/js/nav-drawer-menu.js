let drawerCleanup = null;

function bindPageLifecycle(init) {
  document.addEventListener('astro:page-load', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }

  init();
}

function initDrawerMenu() {
  drawerCleanup?.();

  const openMenuButton = document.getElementById('open-menu');
  const closeMenuButton = document.getElementById('close-menu');
  const drawer = document.getElementById('drawer');
  const drawerPanel = document.getElementById('drawer-panel');

  if (!(openMenuButton instanceof HTMLElement)
    || !(closeMenuButton instanceof HTMLElement)
    || !(drawer instanceof HTMLElement)
    || !(drawerPanel instanceof HTMLElement)) {
    drawerCleanup = null;
    return;
  }

  const staggerItems = drawerPanel.querySelectorAll('.drawer-stagger');

  const openDrawer = () => {
    drawer.classList.add('open');
    drawerPanel.classList.add('open');
    openMenuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    staggerItems.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }

      item.style.transitionDelay = `${80 + index * 60}ms`;
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    });
  };

  const closeDrawer = () => {
    const lastIndex = staggerItems.length - 1;

    staggerItems.forEach((item, index) => {
      if (!(item instanceof HTMLElement)) {
        return;
      }

      item.style.transitionDelay = `${(lastIndex - index) * 40}ms`;
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
    });

    drawer.classList.remove('open');
    drawerPanel.classList.remove('open');
    openMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const onBackdropClick = (event) => {
    if (!drawerPanel.contains(event.target)) {
      closeDrawer();
    }
  };

  const onKeydown = (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  };

  const links = drawer.querySelectorAll('a');

  openMenuButton.addEventListener('click', openDrawer);
  closeMenuButton.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeydown);
  links.forEach((link) => link.addEventListener('click', closeDrawer));

  drawerCleanup = () => {
    openMenuButton.removeEventListener('click', openDrawer);
    closeMenuButton.removeEventListener('click', closeDrawer);
    drawer.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKeydown);
    links.forEach((link) => link.removeEventListener('click', closeDrawer));
    document.body.style.overflow = '';
  };
}

bindPageLifecycle(initDrawerMenu);
