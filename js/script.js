document.addEventListener("DOMContentLoaded", function () {
  var urlPath = window.location.pathname;
  var currentPage = urlPath.split("/").pop();
  var menuLinks = document.querySelectorAll(".menu a");

  menuLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    var linkFileName = href.split("/").pop();

    if (linkFileName === currentPage) {
      link.classList.add("active");
    }
  });
});
