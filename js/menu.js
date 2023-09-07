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
