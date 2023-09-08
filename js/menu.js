// 菜单吸顶逻辑
const menu = document.querySelector('.menu');
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.intersectionRatio < 1) {
      menu.classList.add('at-top');
    } else {
      menu.classList.remove('at-top');
    }
  },
  { threshold: [1] }
);

observer.observe(menu);

// 移动端抽屉菜单
const openMenuButton = document.getElementById("open-menu");
const drawer = document.getElementById("drawer");

openMenuButton.addEventListener("click", () => {
    drawer.classList.add("open");
});

window.addEventListener("click", (e) => {
    if (!drawer.contains(e.target) && !openMenuButton.contains(e.target)) {
        drawer.classList.remove("open");
    }
});
