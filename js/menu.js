const menu = document.querySelector('.menu-div');
let isAtTop = false;

function checkScroll() {
    const rect = menu.getBoundingClientRect();
    isAtTop = rect.top === 0;

    if (isAtTop) {
        menu.classList.add('at-top');
    } else {
        menu.classList.remove('at-top');
    }
}

function onTouchEnd() {
    setTimeout(checkScroll, 0);
}

function onScroll() {
    checkScroll();
}

window.addEventListener('scroll', onScroll);
window.addEventListener('touchend', onTouchEnd);
