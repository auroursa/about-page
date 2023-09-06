const menu = document.querySelector('.menu-div');
let isAtTop = false;

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

function onTouchEnd() {
    checkScroll();
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS()) {
    window.addEventListener('touchend', onTouchEnd); // 只在 iOS 上使用touchend事件
} else {
    window.addEventListener('scroll', checkScroll); // 在其他平台上使用scroll事件
}