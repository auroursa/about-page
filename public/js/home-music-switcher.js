(function () {
  const setMusicCover = (root, item) => {
    const coverLink = root.querySelector('[data-music-cover-link]');
    const coverTitle = root.querySelector('[data-music-cover-title]');
    const coverArtist = root.querySelector('[data-music-cover-artist]');
    const coverImage = root.querySelector('[data-music-cover-img]');
    const fallback = root.querySelector('[data-music-cover-fallback]');

    if (!(coverLink instanceof HTMLAnchorElement)) {
      return;
    }

    coverLink.href = item.link;
    coverLink.setAttribute('aria-label', `打开 ${item.title} 的 Apple Music 页面（新窗口）`);

    if (coverTitle instanceof HTMLElement) {
      coverTitle.textContent = item.title;
    }

    if (coverArtist instanceof HTMLElement) {
      coverArtist.textContent = item.artist;
    }

    if (coverImage instanceof HTMLImageElement) {
      if (item.artwork) {
        coverImage.src = item.artwork;
        coverImage.alt = `${item.title} 专辑封面`;
        coverImage.hidden = false;

        if (fallback instanceof HTMLElement) {
          fallback.hidden = true;
        }
      } else {
        coverImage.hidden = true;

        if (fallback instanceof HTMLElement) {
          fallback.hidden = false;
        }
      }
    }
  };

  const initMusicSwitcher = () => {
    const containers = document.querySelectorAll('[data-home-music]');

    containers.forEach((root) => {
      if (!(root instanceof HTMLElement) || root.dataset.musicBound === 'true') {
        return;
      }

      root.dataset.musicBound = 'true';

      const items = Array.from(root.querySelectorAll('[data-music-item]')).filter((item) => item instanceof HTMLButtonElement);

      if (items.length === 0) {
        return;
      }

      const applyActiveItem = (selected) => {
        items.forEach((item) => {
          const isSelected = item === selected;
          item.classList.toggle('is-active', isSelected);
          item.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });

        setMusicCover(root, {
          link: selected.dataset.link ?? '#',
          title: selected.dataset.title ?? 'Music',
          artist: selected.dataset.artist ?? '未知艺术家',
          artwork: selected.dataset.artwork || '',
        });
      };

      items.forEach((item) => {
        item.addEventListener('click', () => {
          applyActiveItem(item);
        });

        item.addEventListener('keydown', (event) => {
          const currentIndex = items.indexOf(item);

          if (currentIndex < 0) {
            return;
          }

          let nextIndex = currentIndex;

          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % items.length;
          } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
          } else if (event.key === 'Home') {
            nextIndex = 0;
          } else if (event.key === 'End') {
            nextIndex = items.length - 1;
          } else {
            return;
          }

          event.preventDefault();
          const target = items[nextIndex];
          target.focus();
          applyActiveItem(target);
        });
      });
    });
  };

  initMusicSwitcher();

  if (!window.__homeMusicSwitcherBound) {
    document.addEventListener('astro:page-load', initMusicSwitcher);
    window.__homeMusicSwitcherBound = true;
  }
})();
