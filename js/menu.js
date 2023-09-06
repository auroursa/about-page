const menu = document.querySelector('.menu-div');
let isAtTop = false;
let scrollTimeout;

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

function onScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkScroll, 100); // 设置延迟时间等待滚动停止
}

function onTouchMove() {
    clearTimeout(scrollTimeout); // 用户滚动时清除计时器
}

function onTouchEnd() {
    checkScroll(); // 在touchend事件中进行滚动检测
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS()) {
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
} else {
    window.addEventListener('scroll', onScroll); // 在其他平台上使用scroll事件
}
