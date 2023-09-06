const menu = document.querySelector('.menu-div');
let scrollTimeout;

function checkScroll() {
    const rect = menu.getBoundingClientRect();
    if (rect.top === 0) {
        menu.classList.add('at-top');
    } else {
        menu.classList.remove('at-top');
    }
}

function onScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkScroll, 120);
}

window.addEventListener('scroll', onScroll);