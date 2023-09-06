const menu = document.querySelector('.menu-div');

window.addEventListener('scroll', () => {
    const rect = menu.getBoundingClientRect();
    if (rect.top === 0) {
        menu.classList.add('at-top');
    } else {
        menu.classList.remove('at-top');
    }
});