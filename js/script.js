document.addEventListener("DOMContentLoaded", function () {
  // 获取当前页面的 URL 路径，并从中提取文件名
  var urlPath = window.location.pathname;
  var currentPage = urlPath.split("/").pop();

  // 查找菜单中的链接
  var menuLinks = document.querySelectorAll(".menu a");

  // 循环遍历菜单链接，找到与当前页面匹配的链接
  menuLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    var linkFileName = href.split("/").pop();

    // 将链接的文件名与当前页面的文件名进行比较
    if (linkFileName === currentPage) {
      // 如果匹配当前页面，添加 'active' 类到链接上
      link.classList.add("active");
    }
  });
});
