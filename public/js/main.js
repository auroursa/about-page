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
        initNavIndicator(false);
        return;
    }

    const indicator = menu.querySelector('.nav-indicator');
    if (indicator) {
        indicator.style.transition = 'none';
    }

    const beforeRects = new Map(animatedElements.map((element) => [element, element.getBoundingClientRect()]));

    menu.classList.toggle('at-top', atTop);
    syncMenuA11y(menu, atTop);
    initNavIndicator(false);

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

        const anim = element.animate(
            [
                { transform: `${finalTransformValue}translate(${deltaX}px, ${deltaY}px)` },
                { transform: finalTransform === 'none' ? 'none' : finalTransform },
            ],
            {
                duration: 480,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }
        );
        anim.addEventListener('finish', () => {
            const ind = menu.querySelector('.nav-indicator');
            if (ind) {
                ind.style.transition = '';
            }
            initNavIndicator(false);
        }, { once: true });
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
    let pendingFrame = null;

    const observer = new IntersectionObserver(
        ([entry]) => {
            const shouldStick = entry.isIntersecting === false;

            if (pendingFrame) {
                cancelAnimationFrame(pendingFrame);
            }

            pendingFrame = requestAnimationFrame(() => {
                pendingFrame = null;
                setStickyMenuState(menu, shouldStick, { animate: !isFirstObservation });


                isFirstObservation = false;
            });
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

    const staggerItems = drawerPanel.querySelectorAll('.drawer-stagger');

    const openDrawer = () => {
        drawer.classList.add('open');
        drawerPanel.classList.add('open');
        openMenuButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        staggerItems.forEach((item, index) => {
            item.style.transitionDelay = `${80 + index * 60}ms`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    };

    const closeDrawer = () => {
        const lastIndex = staggerItems.length - 1;

        staggerItems.forEach((item, index) => {
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

let savedIndicatorLeft = null;
let savedIndicatorWidth = null;

function positionNavIndicator(indicator, core, activeBtn) {
    const coreRect = core.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    indicator.style.top = (btnRect.top - coreRect.top) + 'px';
    indicator.style.left = (btnRect.left - coreRect.left) + 'px';
    indicator.style.width = btnRect.width + 'px';
    indicator.style.height = btnRect.height + 'px';
    indicator.style.opacity = '1';
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

    if (animate && savedIndicatorLeft !== null) {
        indicator.style.transition = 'none';
        indicator.style.top = (btnRect.top - coreRect.top) + 'px';
        indicator.style.left = savedIndicatorLeft + 'px';
        indicator.style.width = savedIndicatorWidth + 'px';
        indicator.style.height = btnRect.height + 'px';
        indicator.style.opacity = '1';

        requestAnimationFrame(() => {
            indicator.style.transition = '';
            indicator.style.left = newLeft + 'px';
            indicator.style.width = newWidth + 'px';
        });
    } else {
        indicator.style.transition = 'none';
        positionNavIndicator(indicator, core, activeBtn);
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

function initPage(animate) {
    initStickyMenu();
    initDrawer();
    initColorTooltips();
    initNavIndicator(animate);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initPage(false), { once: true });
} else {
    initPage(false);
}

document.addEventListener('astro:before-swap', saveNavIndicatorPosition);
document.addEventListener('astro:page-load', () => initPage(true));

function copyColor(color) {
    navigator.clipboard.writeText(color);
}

window.copyColor = copyColor;
