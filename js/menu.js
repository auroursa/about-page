const menu = document.querySelector('.menu-div');
let scrollTimer;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        const rect = menu.getBoundingClientRect();
        if (rect.top === 0) {
            menu.classList.add('at-top');
        } else {
            menu.classList.remove('at-top');
        }
    }, 200);
});
