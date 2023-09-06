const menu = document.querySelector('.menu-div');
let isAtTop = false;
let scrollTimeout;

function checkScroll() {
    const rect = menu.getBoundingClientRect();
    isAtTop = rect.top === 0;
    if (!isAtTop) {
        menu.classList.remove('at-top');
    }
}

function onScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        checkScroll();
        if (isAtTop) {
            menu.classList.add('at-top');
        }
    }, 120);
}

window.addEventListener('scroll', onScroll);
