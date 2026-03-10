let menuObserverCleanup = null;
let drawerCleanup = null;

function initStickyMenu() {
    menuObserverCleanup?.();

    const menu = document.querySelector('.menu');
    const sentinel = document.querySelector('.menu-sentinel');

    if (!menu || !sentinel) {
        menuObserverCleanup = null;
        return;
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting === false) {
                menu.classList.add('at-top');
            } else {
                menu.classList.remove('at-top');
            }
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
