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
    scrollTimeout = setTimeout(checkScroll, 120);
}

window.addEventListener('scroll', onScroll);