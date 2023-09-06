const menu = document.querySelector('.menu-div');
let isAtTop = false;
let isScrolling = false;

function checkScroll() {
    const rect = menu.getBoundingClientRect();
    const newIsAtTop = rect.top === 0;

    if (newIsAtTop !== isAtTop) {
        isAtTop = newIsAtTop;
        if (isAtTop) {
            menu.classList.add('at-top');
        } else {
            menu.classList.remove('at-top');
        }
    }
}

function onTouchMove() {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            checkScroll();
            isScrolling = false;
        });
    }
}

function onTouchEnd() {
    checkScroll();
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS()) {
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
} else {
    window.addEventListener('scroll', checkScroll);
}
