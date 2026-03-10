let menuObserverCleanup = null;
let drawerCleanup = null;

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
    const isDesktop = window.matchMedia('(min-width: 1281px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentState = menu.classList.contains('at-top');
    const animatedElements = [
        menu.querySelector('.desktop-nav-core'),
        menu.querySelector('.desktop-nav-inline-travel'),
    ].filter((element) => element instanceof HTMLElement);

    if (currentState === atTop) {
        syncMenuA11y(menu, atTop);
        return;
    }

    animatedElements.forEach((element) => {
        element.getAnimations().forEach((animation) => animation.cancel());
    });

    if (!animate || !isDesktop || prefersReducedMotion || animatedElements.length === 0) {
        menu.classList.toggle('at-top', atTop);
        syncMenuA11y(menu, atTop);
        return;
    }

    const beforeRects = new Map(animatedElements.map((element) => [element, element.getBoundingClientRect()]));

    menu.classList.toggle('at-top', atTop);
    syncMenuA11y(menu, atTop);

    animatedElements.forEach((element) => {
        const before = beforeRects.get(element);
        const after = element.getBoundingClientRect();
        const deltaX = before.left - after.left;
        const deltaY = before.top - after.top;
        const finalTransform = window.getComputedStyle(element).transform;
        const finalTransformValue = finalTransform === 'none' ? '' : `${finalTransform} `;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
            return;
        }

        element.animate(
            [
                { transform: `${finalTransformValue}translate(${deltaX}px, ${deltaY}px)` },
                { transform: finalTransform === 'none' ? 'none' : finalTransform },
            ],
            {
                duration: 420,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }
        );
    });
}

function initStickyMenu() {
    menuObserverCleanup?.();

    const menu = document.querySelector('.menu');
    const sentinel = document.querySelector('.menu-sentinel');

    if (!menu || !sentinel) {
        menuObserverCleanup = null;
        return;
    }

    let isFirstObservation = true;

    const observer = new IntersectionObserver(
        ([entry]) => {
            const shouldStick = entry.isIntersecting === false;

            setStickyMenuState(menu, shouldStick, { animate: !isFirstObservation });
            isFirstObservation = false;
        },
        { threshold: [0] }
    );

    observer.observe(sentinel);
    menuObserverCleanup = () => observer.disconnect();
}

function initDrawer() {
    drawerCleanup?.();

    const openMenuButton = document.getElementById('open-menu');
    const closeMenuButton = document.getElementById('close-menu');
    const drawer = document.getElementById('drawer');
    const drawerPanel = document.getElementById('drawer-panel');

    if (!openMenuButton || !closeMenuButton || !drawer || !drawerPanel) {
        drawerCleanup = null;
        return;
    }

    const openDrawer = () => {
        drawer.classList.add('open');
        drawerPanel.classList.add('open');
        openMenuButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        drawer.classList.remove('open');
        drawerPanel.classList.remove('open');
        openMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const onBackdropClick = (event) => {
        if (event.target === drawer) {
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

function initColorTooltips() {
    const colorSpans = document.querySelectorAll('.about-color-span');

    colorSpans.forEach((span) => {
        if (span.dataset.tooltipBound === 'true') {
            return;
        }

        let hideTimer;

        const showTooltip = () => {
            if (hideTimer) {
                window.clearTimeout(hideTimer);
            }

            const tooltip = span.querySelector('.about-color-tooltip');
            if (tooltip) {
                tooltip.classList.add('show');
            }
        };

        const hideTooltip = () => {
            if (hideTimer) {
                window.clearTimeout(hideTimer);
            }

            const tooltip = span.querySelector('.about-color-tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        };

        const showTooltipTemporarily = () => {
            showTooltip();
            hideTimer = window.setTimeout(hideTooltip, 900);
        };

        span.addEventListener('mouseenter', showTooltip);
        span.addEventListener('mouseleave', hideTooltip);
        span.addEventListener('touchstart', showTooltip, { passive: true });
        span.addEventListener('click', showTooltipTemporarily);
        span.addEventListener('focus', showTooltip);
        span.addEventListener('blur', hideTooltip);
        span.dataset.tooltipBound = 'true';
    });
}

function initPage() {
    initStickyMenu();
    initDrawer();
    initColorTooltips();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage, { once: true });
} else {
    initPage();
}

document.addEventListener('astro:page-load', initPage);

function copyColor(color) {
    navigator.clipboard.writeText(color);
}

window.copyColor = copyColor;
