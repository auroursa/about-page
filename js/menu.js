const menu = document.querySelector('.menu-div');
let isScrolling = false;

function checkScroll() {
    const rect = menu.getBoundingClientRect();
    if (rect.top === 0) {
        menu.classList.add('at-top');
    } else {
        menu.classList.remove('at-top');
    }
}

function onScroll() {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            checkScroll();
            isScrolling = false;
        });
    }
}

window.addEventListener('scroll', onScroll);