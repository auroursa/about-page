const menuDiv = document.querySelector('.menu-div');
let isAtTop = false;
let rafId;

function checkScroll() {
    const rect = menuDiv.getBoundingClientRect();
    isAtTop = rect.top === 0;

    if (isAtTop) {
        menuDiv.classList.add('at-top');
    } else {
        menuDiv.classList.remove('at-top');
    }

    rafId = requestAnimationFrame(checkScroll);
}

function onScroll() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(checkScroll);
}

window.addEventListener('scroll', onScroll);
