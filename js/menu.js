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