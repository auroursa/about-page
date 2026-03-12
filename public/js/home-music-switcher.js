(function () {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const rgbToHsl = (r, g, b) => {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    const lightness = (max + min) / 2;
    let hue = 0;
    let saturation = 0;

    if (delta > 0) {
      saturation = delta / (1 - Math.abs(2 * lightness - 1));

      if (max === red) {
        hue = ((green - blue) / delta) % 6;
      } else if (max === green) {
        hue = (blue - red) / delta + 2;
      } else {
        hue = (red - green) / delta + 4;
      }

      hue *= 60;

      if (hue < 0) {
        hue += 360;
      }
    }

    return {
      h: Math.round(hue),
      s: Math.round(saturation * 100),
      l: Math.round(lightness * 100),
    };
  };

  const deriveAccentFromImage = (image, fallbackAccent) => {
    if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
      return fallbackAccent;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 26;
    canvas.height = 26;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return fallbackAccent;
    }

    try {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let count = 0;

      for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3] / 255;

        if (alpha < 0.2) {
          continue;
        }

        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 18 || brightness > 238) {
          continue;
        }

        red += r;
        green += g;
        blue += b;
        count += 1;
      }

      if (count === 0) {
        return fallbackAccent;
      }

      const averageRed = red / count;
      const averageGreen = green / count;
      const averageBlue = blue / count;
      const hsl = rgbToHsl(averageRed, averageGreen, averageBlue);
      const saturation = clamp(Math.max(hsl.s, 48), 48, 86);
      const lightness = clamp(hsl.l, 33, 58);
      return `${hsl.h} ${saturation}% ${lightness}%`;
    } catch {
      return fallbackAccent;
    }
  };

  const applyCoverAccent = (coverSurface, coverImage, fallbackAccent) => {
    if (!(coverSurface instanceof HTMLElement)) {
      return;
    }

    const applyDerivedAccent = () => {
      const accent = deriveAccentFromImage(coverImage, fallbackAccent);
      coverSurface.style.setProperty('--music-accent', accent);
    };

    coverSurface.style.setProperty('--music-accent', fallbackAccent);

    if (!(coverImage instanceof HTMLImageElement) || coverImage.hidden || !coverImage.src) {
      return;
    }

    if (coverImage.complete && coverImage.naturalWidth > 0) {
      applyDerivedAccent();
      return;
    }

    coverImage.addEventListener('load', applyDerivedAccent, { once: true });
  };

  const formatTrackCount = (value) => {
    if (!value) {
      return '曲目信息待补充';
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return '曲目信息待补充';
    }

    return `${parsed} 首曲目`;
  };

  const setMusicCover = (root, item) => {
    const coverLink = root.querySelector('[data-music-cover-link]');
    const coverTitle = root.querySelector('[data-music-cover-title]');
    const coverArtist = root.querySelector('[data-music-cover-artist]');
    const coverDetail = root.querySelector('[data-music-cover-detail]');
    const coverTagType = root.querySelector('[data-music-cover-tag-type]');
    const coverTagCount = root.querySelector('[data-music-cover-tag-count]');
    const coverImage = root.querySelector('[data-music-cover-img]');
    const fallback = root.querySelector('[data-music-cover-fallback]');

    if (!(coverLink instanceof HTMLAnchorElement)) {
      return;
    }

    const fallbackAccent = item.accent || '194 88% 46%';

    coverLink.href = item.link;
    coverLink.setAttribute('aria-label', `打开 ${item.title} 的 Apple Music 页面（新窗口）`);

    if (coverTitle instanceof HTMLElement) {
      coverTitle.textContent = item.title;
    }

    if (coverArtist instanceof HTMLElement) {
      coverArtist.textContent = item.artist;
    }

    if (coverDetail instanceof HTMLElement) {
      coverDetail.textContent = `${item.year} · ${item.genre}`;
    }

    if (coverTagType instanceof HTMLElement) {
      coverTagType.textContent = item.releaseType === 'album' ? '专辑' : '单曲';
    }

    if (coverTagCount instanceof HTMLElement) {
      coverTagCount.textContent = formatTrackCount(item.trackCount);
    }

    if (coverImage instanceof HTMLImageElement) {
      if (item.artwork) {
        coverImage.src = item.artwork;
        coverImage.alt = `${item.title} 专辑封面`;
        coverImage.hidden = false;
        applyCoverAccent(root, coverImage, fallbackAccent);

        if (fallback instanceof HTMLElement) {
          fallback.hidden = true;
        }
      } else {
        coverImage.hidden = true;
        applyCoverAccent(root, coverImage, fallbackAccent);

        if (fallback instanceof HTMLElement) {
          fallback.hidden = false;
        }
      }
    } else {
      applyCoverAccent(root, coverImage, fallbackAccent);
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
          year: selected.dataset.year || '年份未知',
          genre: selected.dataset.genre || '流派未标注',
          releaseType: selected.dataset.releaseType || 'single',
          trackCount: selected.dataset.trackCount || '',
          accent: selected.dataset.accent || '194 88% 46%',
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

      const initialSelected = items.find((item) => item.classList.contains('is-active')) || items[0];
      applyActiveItem(initialSelected);
    });
  };

  initMusicSwitcher();

  if (!window.__homeMusicSwitcherBound) {
    document.addEventListener('astro:page-load', initMusicSwitcher);
    window.__homeMusicSwitcherBound = true;
  }
})();
