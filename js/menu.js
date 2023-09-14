// 菜单吸顶逻辑
const menu = document.querySelector('.menu');
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.intersectionRatio < 0.99) {
      menu.classList.add('at-top');
    } else {
      menu.classList.remove('at-top');
    }
  },
  { threshold: [0.99] } // 修复 Edge 浏览器中的判断问题
);

observer.observe(menu);

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