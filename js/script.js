document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".menu-link");
    const currentPage = location.pathname;

    menuLinks.forEach((link) => {
        const linkUrl = link.getAttribute("href");
        if (currentPage.endsWith(linkUrl)) {
            link.classList.add("active");
        }
    });
});