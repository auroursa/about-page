export interface HomeGalleryItem {
  src: string;
  width: number;
  height: number;
  alt: string;
  srcSet?: string;
  sizes?: string;
}

const masonryImageSizes = '(max-width: 576px) calc((100vw - 0.5rem) / 2), (max-width: 768px) calc((85vw - 0.5rem) / 2), (max-width: 1280px) calc((85vw - 1rem) / 3), calc((80vw - 1.5rem) / 4)';

const createMasonryImage = ({
  src,
  width,
  height,
  alt,
}: Omit<HomeGalleryItem, 'srcSet' | 'sizes'>): HomeGalleryItem => {
  const srcBase = src.replace(/\.webp$/, '');
  const srcSetParts = [`${srcBase}-320.webp 320w`];

  if (width > 640) {
    srcSetParts.push(`${srcBase}-640.webp 640w`);
  }

  srcSetParts.push(`${src} ${width}w`);

  return {
    src,
    width,
    height,
    alt,
    srcSet: srcSetParts.join(', '),
    sizes: masonryImageSizes,
  };
};

export const homeGalleryBackdropItems: HomeGalleryItem[] = [
  createMasonryImage({
    src: '/img/gallery/photo1.webp',
    width: 1229,
    height: 1536,
    alt: '杭州金沙湖',
  }),
  createMasonryImage({
    src: '/img/gallery/photo2.webp',
    width: 1024,
    height: 768,
    alt: '南京紫金山',
  }),
  createMasonryImage({
    src: '/img/gallery/photo3.webp',
    width: 1024,
    height: 768,
    alt: '杭州西湖',
  }),
  createMasonryImage({
    src: '/img/gallery/photo4.webp',
    width: 960,
    height: 1200,
    alt: '西兴大桥',
  }),
  createMasonryImage({
    src: '/img/gallery/photo5.webp',
    width: 1024,
    height: 768,
    alt: '檵木',
  }),
  createMasonryImage({
    src: '/img/gallery/photo6.webp',
    width: 631,
    height: 884,
    alt: '上海街景',
  }),
  createMasonryImage({
    src: '/img/gallery/photo7.webp',
    width: 972,
    height: 730,
    alt: '鹰厦铁路',
  }),
  createMasonryImage({
    src: '/img/gallery/photo8.webp',
    width: 972,
    height: 730,
    alt: '香港旺角',
  }),
  createMasonryImage({
    src: '/img/gallery/photo9.webp',
    width: 972,
    height: 730,
    alt: '汉口站',
  }),
  createMasonryImage({
    src: '/img/gallery/photo10.webp',
    width: 864,
    height: 1209,
    alt: '盛夏',
  }),
  createMasonryImage({
    src: '/img/gallery/photo11.webp',
    width: 548,
    height: 730,
    alt: '雨中紫阳花',
  }),
  createMasonryImage({
    src: '/img/gallery/photo12.webp',
    width: 972,
    height: 730,
    alt: '宁波三江口',
  }),
  createMasonryImage({
    src: '/img/gallery/photo13.webp',
    width: 1022,
    height: 730,
    alt: '可爱猫猫',
  }),
  createMasonryImage({
    src: '/img/gallery/photo14.webp',
    width: 1024,
    height: 768,
    alt: '绍兴柯桥',
  }),
  createMasonryImage({
    src: '/img/gallery/photo15.webp',
    width: 1152,
    height: 864,
    alt: '烟花',
  }),
  createMasonryImage({
    src: '/img/gallery/photo16.webp',
    width: 1022,
    height: 730,
    alt: '杭州西湖',
  }),
  createMasonryImage({
    src: '/img/gallery/photo17.webp',
    width: 768,
    height: 576,
    alt: '日落',
  }),
];

export interface HomeGallerySeasonItem extends HomeGalleryItem {
  season: string;
}

export const homeGallerySeasonItems: HomeGallerySeasonItem[] = [
  {
    src: '/img/gallery/2025/spring.webp',
    srcSet: '/img/gallery/2025/spring-320.webp 320w, /img/gallery/2025/spring-640.webp 640w, /img/gallery/2025/spring.webp 750w',
    sizes: '(max-width: 768px) 40vw, (max-width: 1280px) 23vw, 317px',
    width: 750,
    height: 1000,
    alt: '2025 春季照片',
    season: '春',
  },
  {
    src: '/img/gallery/2025/summer.webp',
    srcSet: '/img/gallery/2025/summer-320.webp 320w, /img/gallery/2025/summer-640.webp 640w, /img/gallery/2025/summer.webp 750w',
    sizes: '(max-width: 768px) 40vw, (max-width: 1280px) 23vw, 317px',
    width: 750,
    height: 1000,
    alt: '2025 夏季照片',
    season: '夏',
  },
  {
    src: '/img/gallery/2025/autumn.webp',
    srcSet: '/img/gallery/2025/autumn-320.webp 320w, /img/gallery/2025/autumn-640.webp 640w, /img/gallery/2025/autumn.webp 999w',
    sizes: '(max-width: 768px) 40vw, (max-width: 1280px) 23vw, 317px',
    width: 999,
    height: 749,
    alt: '2025 秋季照片',
    season: '秋',
  },
  {
    src: '/img/gallery/2025/winter.webp',
    srcSet: '/img/gallery/2025/winter-320.webp 320w, /img/gallery/2025/winter-640.webp 640w, /img/gallery/2025/winter.webp 714w',
    sizes: '(max-width: 768px) 40vw, (max-width: 1280px) 23vw, 317px',
    width: 714,
    height: 1000,
    alt: '2025 冬季照片',
    season: '冬',
  },
];
