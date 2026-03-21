/**
 * Info grid pile effect for mobile.
 *
 * Cards start as a scattered pile. Tap to spread into a normal grid.
 */

(() => {
  const MOBILE_MQ = '(max-width: 768px)';
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  let cleanups = [];

  function initPile() {
    cleanups.forEach((fn) => fn());
    cleanups = [];

    const mq = window.matchMedia(MOBILE_MQ);
    if (!mq.matches) return;

    const piles = document.querySelectorAll('.info-grid-pile');

    piles.forEach((pile) => {
      const cards = [...pile.querySelectorAll('.info-grid-card')];
      if (cards.length === 0) return;

      pile.classList.add('is-piled');
      cards.forEach((card, i) => {
        if (i === 0) {
          card.style.transform = 'rotate(0deg)';
        } else {
          const rot = rand(-5, 5);
          const ox = rand(-8, 8);
          const oy = rand(-3, 3);
          card.style.transform = `rotate(${rot}deg) translate(${ox}px, ${oy}px)`;
        }
        card.style.zIndex = String(cards.length - i);
      });

      function spread() {
        pile.classList.add('is-spreading');

        cards.forEach((card) => {
          card.style.transform = '';
          card.style.zIndex = '';
        });

        requestAnimationFrame(() => {
          pile.classList.remove('is-piled');
          pile.style.height = '';
          pile.classList.remove('is-spreading');
        });
      }

      const onClick = (e) => {
        if (pile.classList.contains('is-piled')) {
          e.preventDefault();
          spread();
          pile.removeEventListener('click', onClick);
        }
      };

      pile.addEventListener('click', onClick);

      cleanups.push(() => {
        pile.classList.remove('is-piled', 'is-spreading');
        pile.style.height = '';
        cards.forEach((card) => {
          card.style.transform = '';
          card.style.zIndex = '';
        });
        pile.removeEventListener('click', onClick);
      });
    });

    const onResize = () => {
      if (!mq.matches) {
        cleanups.forEach((fn) => fn());
        cleanups = [];
      }
    };

    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  initPile();
  document.addEventListener('astro:page-load', initPile);
})();
