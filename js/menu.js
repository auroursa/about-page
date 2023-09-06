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

function startScroll() {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            checkScroll();
            isScrolling = false;
        });
    }
}

function stopScroll() {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            checkScroll();
            isScrolling = false;
        });
    }
}

window.addEventListener('scroll', startScroll);
window.addEventListener('touchstart', startScroll);
window.addEventListener('touchend', stopScroll);