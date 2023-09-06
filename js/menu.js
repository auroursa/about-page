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

function onScroll() {
    requestAnimationFrame(checkScroll);
}

window.addEventListener('scroll', onScroll);