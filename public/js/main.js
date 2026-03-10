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
const drawerPanel = document.getElementById("drawer-panel");

const openDrawer = () => {
    if (!drawer || !drawerPanel) return;
    drawer.classList.add("open");
    drawerPanel.classList.add("open");
    document.body.style.overflow = "hidden";
};

const closeDrawer = () => {
    if (!drawer || !drawerPanel) return;
    drawer.classList.remove("open");
    drawerPanel.classList.remove("open");
    document.body.style.overflow = "";
};

if (openMenuButton && closeMenuButton && drawer && drawerPanel) {
    openMenuButton.addEventListener("click", openDrawer);
    closeMenuButton.addEventListener("click", closeDrawer);

    drawer.addEventListener("click", function(event) {
        if (event.target === drawer) {
            closeDrawer();
        }
    });

    drawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && drawer.classList.contains("open")) {
            closeDrawer();
        }
    });
}

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
