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