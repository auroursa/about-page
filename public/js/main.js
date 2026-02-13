// 菜单吸顶逻辑
const menu = document.querySelector('.menu');
const sentinel = document.querySelector('.menu-sentinel');

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting === false) {
      menu.classList.add('at-top'); 
    } else {
      menu.classList.remove('at-top');
    }
  },
  { threshold: [0] } 
);

observer.observe(sentinel);

// 移动端抽屉菜单
const openMenuButton = document.getElementById("open-menu");
const closeMenuButton = document.getElementById("close-menu");
const drawer = document.getElementById("drawer");

openMenuButton.addEventListener("click", function() {
    drawer.classList.add("open");
});

closeMenuButton.addEventListener("click", function() {
    drawer.classList.remove("open");
});

// 关于页颜色复制提示
function copyColor(color) {
    navigator.clipboard.writeText(color);
}

const colorSpans = document.querySelectorAll('.about-color-span');
colorSpans.forEach(span => {
    span.addEventListener('mouseenter', () => {
        const tooltip = span.querySelector('.about-color-tooltip');
        if (tooltip) tooltip.classList.add('show');
    });
    span.addEventListener('mouseleave', () => {
        const tooltip = span.querySelector('.about-color-tooltip');
        if (tooltip) tooltip.classList.remove('show');
    });
    span.addEventListener('touchstart', () => {
        const tooltip = span.querySelector('.about-color-tooltip');
        if (tooltip) tooltip.classList.add('show');
    });
});