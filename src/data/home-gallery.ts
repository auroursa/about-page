export interface HomeGalleryItem {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const homeGalleryBackdropItems: HomeGalleryItem[] = [
  {
    src: '/img/gallery/photo1.webp',
    width: 1229,
    height: 1536,
    alt: '杭州金沙湖',
  },
  {
    src: '/img/gallery/photo2.webp',
    width: 1024,
    height: 768,
    alt: '南京紫金山',
  },
  {
    src: '/img/gallery/photo3.webp',
    width: 1024,
    height: 768,
    alt: '杭州西湖',
  },
  {
    src: '/img/gallery/photo4.webp',
    width: 960,
    height: 1200,
    alt: '西兴大桥',
  },
  {
    src: '/img/gallery/photo5.webp',
    width: 1024,
    height: 768,
    alt: '檵木',
  },
  {
    src: '/img/gallery/photo6.webp',
    width: 631,
    height: 884,
    alt: '上海街景',
  },
  {
    src: '/img/gallery/photo7.webp',
    width: 972,
    height: 730,
    alt: '鹰厦铁路',
  },
  {
    src: '/img/gallery/photo8.webp',
    width: 972,
    height: 730,
    alt: '香港旺角',
  },
  {
    src: '/img/gallery/photo9.webp',
    width: 972,
    height: 730,
    alt: '汉口站',
  },
  {
    src: '/img/gallery/photo10.webp',
    width: 864,
    height: 1209,
    alt: '盛夏',
  },
  {
    src: '/img/gallery/photo11.webp',
    width: 548,
    height: 730,
    alt: '雨中紫阳花',
  },
  {
    src: '/img/gallery/photo12.webp',
    width: 972,
    height: 730,
    alt: '宁波三江口',
  },
  {
    src: '/img/gallery/photo13.webp',
    width: 1022,
    height: 730,
    alt: '可爱猫猫',
  },
  {
    src: '/img/gallery/photo14.webp',
    width: 1024,
    height: 768,
    alt: '绍兴柯桥',
  },
  {
    src: '/img/gallery/photo15.webp',
    width: 1152,
    height: 864,
    alt: '烟花',
  },
  {
    src: '/img/gallery/photo16.webp',
    width: 1022,
    height: 730,
    alt: '杭州西湖',
  },
  {
    src: '/img/gallery/photo17.webp',
    width: 768,
    height: 576,
    alt: '日落',
  },
];

export interface HomeGallerySeasonItem extends HomeGalleryItem {
  season: string;
}

export const homeGallerySeasonItems: HomeGallerySeasonItem[] = [
  {
    src: '/img/gallery/2025-spring.webp',
    width: 750,
    height: 1000,
    alt: '2025 春季照片',
    season: '春',
  },
  {
    src: '/img/gallery/2025-summer.webp',
    width: 750,
    height: 1000,
    alt: '2025 夏季照片',
    season: '夏',
  },
  {
    src: '/img/gallery/2025-autumn.webp',
    width: 999,
    height: 749,
    alt: '2025 秋季照片',
    season: '秋',
  },
  {
    src: '/img/gallery/2025-winter.webp',
    width: 714,
    height: 1000,
    alt: '2025 冬季照片',
    season: '冬',
  },
];
