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

  /* ── #1 Median-cut dominant color extraction ── */

  const medianCut = (pixels, depth) => {
    if (depth === 0 || pixels.length === 0) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let i = 0; i < pixels.length; i += 1) {
        rSum += pixels[i][0];
        gSum += pixels[i][1];
        bSum += pixels[i][2];
      }

      const count = pixels.length || 1;
      return [[rSum / count, gSum / count, bSum / count]];
    }

    let rMin = 255;
    let rMax = 0;
    let gMin = 255;
    let gMax = 0;
    let bMin = 255;
    let bMax = 0;

    for (let i = 0; i < pixels.length; i += 1) {
      const [r, g, b] = pixels[i];

      if (r < rMin) rMin = r;
      if (r > rMax) rMax = r;
      if (g < gMin) gMin = g;
      if (g > gMax) gMax = g;
      if (b < bMin) bMin = b;
      if (b > bMax) bMax = b;
    }

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    let channel = 0;

    if (gRange >= rRange && gRange >= bRange) {
      channel = 1;
    } else if (bRange >= rRange && bRange >= gRange) {
      channel = 2;
    }

    pixels.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(pixels.length / 2);
    return [
      ...medianCut(pixels.slice(0, mid), depth - 1),
      ...medianCut(pixels.slice(mid), depth - 1),
    ];
  };

  const deriveAccentFromImage = (image, fallbackAccent) => {
    if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
      return fallbackAccent;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return fallbackAccent;
    }

    try {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const filtered = [];

      for (let index = 0; index < data.length; index += 4) {
        const alpha = data[index + 3] / 255;

        if (alpha < 0.2) {
          continue;
        }

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness < 18 || brightness > 238) {
          continue;
        }

        filtered.push([r, g, b]);
      }

      if (filtered.length === 0) {
        return fallbackAccent;
      }

      const palette = medianCut(filtered, 3);

      let bestColor = palette[0];
      let bestScore = -1;

      for (let i = 0; i < palette.length; i += 1) {
        const [r, g, b] = palette[i];
        const hsl = rgbToHsl(r, g, b);
        const score = hsl.s * 1.6 + Math.abs(hsl.l - 50) * -0.5;

        if (score > bestScore) {
          bestScore = score;
          bestColor = palette[i];
        }
      }

      const hsl = rgbToHsl(bestColor[0], bestColor[1], bestColor[2]);
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

  const formatTrackMeta = (releaseType, trackNumberValue, trackCountValue) => {
    if (releaseType !== 'album') {
      return { count: '', number: '' };
    }

    const trackCount = Number(trackCountValue);
    const trackNumber = Number(trackNumberValue);
    const countLabel = Number.isFinite(trackCount) && trackCount > 1
      ? `共 ${trackCount} 首`
      : '';
    const numberLabel = Number.isFinite(trackNumber) && trackNumber > 0
      ? `#${String(trackNumber).padStart(2, '0')}`
      : '';

    return { count: countLabel, number: numberLabel };
  };

  const updatePlayButton = (button, options) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const { hasPreview, isPlaying, title } = options;
    button.disabled = !hasPreview;
    button.classList.toggle('is-playing', hasPreview && isPlaying);
    button.setAttribute('aria-pressed', hasPreview && isPlaying ? 'true' : 'false');

    if (hasPreview) {
      const actionLabel = isPlaying ? '暂停' : '播放';
      button.setAttribute('aria-label', `${actionLabel} ${title} 的试听片段`);
    } else {
      button.setAttribute('aria-label', '当前曲目暂无试听');
    }
  };

  /* ── #2 Crossfade cover transition ── */

  const setMusicCover = (root, item) => {
    const coverLink = root.querySelector('[data-music-cover-link]');
    const coverTitle = root.querySelector('[data-music-cover-title]');
    const coverArtist = root.querySelector('[data-music-cover-artist]');
    const coverYear = root.querySelector('[data-music-cover-year]');
    const coverGenre = root.querySelector('[data-music-cover-genre]');
    const coverTagType = root.querySelector('[data-music-cover-tag-type]');
    const coverTagCount = root.querySelector('[data-music-cover-tag-count]');
    const coverTagNumber = root.querySelector('[data-music-cover-tag-number]');
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

    if (coverYear instanceof HTMLElement) {
      coverYear.textContent = item.year;
    }

    if (coverGenre instanceof HTMLElement) {
      coverGenre.textContent = item.genre;
    }

    if (coverTagType instanceof HTMLElement) {
      coverTagType.textContent = item.releaseType === 'album' ? '专辑' : '单曲';
    }

    if (coverTagCount instanceof HTMLElement || coverTagNumber instanceof HTMLElement) {
      const trackMeta = formatTrackMeta(item.releaseType, item.trackNumber, item.trackCount);

      if (coverTagCount instanceof HTMLElement) {
        coverTagCount.hidden = !trackMeta.count;
        coverTagCount.textContent = trackMeta.count;
      }

      if (coverTagNumber instanceof HTMLElement) {
        coverTagNumber.hidden = !trackMeta.number;
        coverTagNumber.textContent = trackMeta.number;
      }
    }

      if (coverImage instanceof HTMLImageElement) {
        if (item.artwork) {
          const nextSrc = item.artwork;
          const nextSrcSet = item.artworkSrcSet || '';
          const nextSizes = item.artworkSizes || '';

          if (coverImage.src === nextSrc || coverImage.src.endsWith(new URL(nextSrc, location.href).pathname)) {
            coverImage.srcset = nextSrcSet;
            coverImage.sizes = nextSizes;
            coverImage.hidden = false;

            if (fallback instanceof HTMLElement) {
              fallback.hidden = true;
            }

          applyCoverAccent(root, coverImage, fallbackAccent);
          return;
        }

        const preloader = new Image();
        preloader.crossOrigin = 'anonymous';
        preloader.referrerPolicy = 'no-referrer';

        coverImage.style.transition = 'opacity 180ms ease';
        coverImage.style.opacity = '0';

        const reveal = () => {
          coverImage.src = nextSrc;
          coverImage.srcset = nextSrcSet;
          coverImage.sizes = nextSizes;
          coverImage.alt = `${item.title} 专辑封面`;
          coverImage.hidden = false;

          if (fallback instanceof HTMLElement) {
            fallback.hidden = true;
          }

          requestAnimationFrame(() => {
            coverImage.style.opacity = '1';
          });

          applyCoverAccent(root, coverImage, fallbackAccent);
        };

        preloader.onload = reveal;
        preloader.onerror = reveal;
        preloader.src = nextSrc;
      } else {
        coverImage.hidden = true;
        coverImage.srcset = '';
        coverImage.sizes = '';
        applyCoverAccent(root, coverImage, fallbackAccent);

        if (fallback instanceof HTMLElement) {
          fallback.hidden = false;
        }
      }
    } else {
      applyCoverAccent(root, coverImage, fallbackAccent);
    }
  };

  /* ── #4 Audio fade helpers (volume ramp) ── */

  const FADE_MS = 160;
  const FADE_STEPS = 10;

  const createAudioGraph = () => {
    const audio = new Audio();
    audio.preload = 'none';
    let fadeTimer = null;

    const clearFade = () => {
      if (fadeTimer !== null) {
        clearInterval(fadeTimer);
        fadeTimer = null;
      }
    };

    const fadeIn = async () => {
      clearFade();
      audio.volume = 0;
      await audio.play();

      let step = 0;
      const interval = FADE_MS / FADE_STEPS;

      fadeTimer = setInterval(() => {
        step += 1;
        audio.volume = Math.min(step / FADE_STEPS, 1);

        if (step >= FADE_STEPS) {
          clearFade();
        }
      }, interval);
    };

    const fadeOut = () => {
      return new Promise((resolve) => {
        clearFade();

        if (audio.paused) {
          audio.currentTime = 0;
          audio.volume = 1;
          resolve();
          return;
        }

        const startVolume = audio.volume;
        let step = 0;
        const interval = FADE_MS / FADE_STEPS;

        fadeTimer = setInterval(() => {
          step += 1;
          audio.volume = Math.max(startVolume * (1 - step / FADE_STEPS), 0);

          if (step >= FADE_STEPS) {
            clearFade();
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1;
            resolve();
          }
        }, interval);
      });
    };

    return { audio, fadeIn, fadeOut };
  };

  const initMusicSwitcher = () => {
    const containers = document.querySelectorAll('[data-home-music]');

    containers.forEach((root) => {
      if (!(root instanceof HTMLElement) || root.dataset.musicBound === 'true') {
        return;
      }

      root.dataset.musicBound = 'true';

      const items = Array.from(root.querySelectorAll('[data-music-item]')).filter((item) => item instanceof HTMLButtonElement);
      const playToggle = root.querySelector('[data-music-play-toggle]');
      const musicList = root.querySelector('.home-music-list');
      const { audio, fadeIn, fadeOut } = createAudioGraph();
      let activeItem = null;
      let currentPreviewUrl = '';

      if (items.length === 0) {
        return;
      }

      /* ── Scroll fade mask: hide when scrolled to bottom ── */
      if (musicList instanceof HTMLElement) {
        const checkScrollEnd = () => {
          const atTop = musicList.scrollTop < 8;
          const atEnd = musicList.scrollHeight - musicList.scrollTop - musicList.clientHeight < 8;
          musicList.classList.toggle('is-scrolled-end', atEnd);
          musicList.style.overscrollBehavior = atTop || atEnd ? 'auto' : 'contain';
        };

        musicList.addEventListener('scroll', checkScrollEnd, { passive: true });
        checkScrollEnd();
      }

      const stopPlayback = async () => {
        await fadeOut();

        if (activeItem instanceof HTMLButtonElement) {
          updatePlayButton(playToggle, {
            hasPreview: Boolean(activeItem.dataset.previewUrl),
            isPlaying: false,
            title: activeItem.dataset.title ?? 'Music',
          });
        }
      };

      const syncPreviewForSelection = (selected) => {
        activeItem = selected;
        const previewUrl = selected.dataset.previewUrl || '';

        if (currentPreviewUrl !== previewUrl) {
          currentPreviewUrl = previewUrl;

          if (previewUrl) {
            audio.src = previewUrl;
          } else {
            audio.removeAttribute('src');
            audio.load();
          }
        }

        updatePlayButton(playToggle, {
          hasPreview: Boolean(previewUrl),
          isPlaying: !audio.paused,
          title: selected.dataset.title ?? 'Music',
        });
      };

      audio.addEventListener('ended', () => {
        if (activeItem instanceof HTMLButtonElement) {
          updatePlayButton(playToggle, {
            hasPreview: Boolean(activeItem.dataset.previewUrl),
            isPlaying: false,
            title: activeItem.dataset.title ?? 'Music',
          });
        }
      });

      if (playToggle instanceof HTMLButtonElement) {
        playToggle.addEventListener('click', async () => {
          if (!(activeItem instanceof HTMLButtonElement)) {
            return;
          }

          const previewUrl = activeItem.dataset.previewUrl || '';

          if (!previewUrl) {
            return;
          }

          if (currentPreviewUrl !== previewUrl) {
            currentPreviewUrl = previewUrl;
            audio.src = previewUrl;
          }

          if (audio.paused) {
            try {
              await fadeIn();
              updatePlayButton(playToggle, {
                hasPreview: true,
                isPlaying: true,
                title: activeItem.dataset.title ?? 'Music',
              });
            } catch {
              updatePlayButton(playToggle, {
                hasPreview: true,
                isPlaying: false,
                title: activeItem.dataset.title ?? 'Music',
              });
            }

            return;
          }

          await stopPlayback();
        });
      }

      const applyActiveItem = async (selected, { scroll = true } = {}) => {
        if (activeItem instanceof HTMLButtonElement && activeItem !== selected) {
          await stopPlayback();
        }

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
          artworkSrcSet: selected.dataset.artworkSrcset || '',
          artworkSizes: selected.dataset.artworkSizes || '',
          year: selected.dataset.year || '年份未知',
          genre: selected.dataset.genre || '流派未标注',
          releaseType: selected.dataset.releaseType || 'single',
          trackNumber: selected.dataset.trackNumber || '',
          trackCount: selected.dataset.trackCount || '',
          accent: selected.dataset.accent || '194 88% 46%',
        });

        syncPreviewForSelection(selected);

        if (scroll) {
          selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
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
      applyActiveItem(initialSelected, { scroll: false });
    });
  };

  initMusicSwitcher();

  if (!window.__homeMusicSwitcherBound) {
    document.addEventListener('astro:page-load', initMusicSwitcher);
    window.__homeMusicSwitcherBound = true;
  }
})();
