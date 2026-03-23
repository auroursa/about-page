import type { ImageMetadata } from 'astro';

import photo1 from '../assets/img/gallery/photo1.webp';
import photo2 from '../assets/img/gallery/photo2.webp';
import photo3 from '../assets/img/gallery/photo3.webp';
import photo4 from '../assets/img/gallery/photo4.webp';
import photo5 from '../assets/img/gallery/photo5.webp';
import photo6 from '../assets/img/gallery/photo6.webp';
import photo7 from '../assets/img/gallery/photo7.webp';
import photo8 from '../assets/img/gallery/photo8.webp';
import photo9 from '../assets/img/gallery/photo9.webp';
import photo10 from '../assets/img/gallery/photo10.webp';
import photo11 from '../assets/img/gallery/photo11.webp';
import photo12 from '../assets/img/gallery/photo12.webp';
import photo13 from '../assets/img/gallery/photo13.webp';
import photo14 from '../assets/img/gallery/photo14.webp';
import photo15 from '../assets/img/gallery/photo15.webp';
import photo16 from '../assets/img/gallery/photo16.webp';
import photo17 from '../assets/img/gallery/photo17.webp';

import spring from '../assets/img/gallery/2025/spring.webp';
import summer from '../assets/img/gallery/2025/summer.webp';
import autumn from '../assets/img/gallery/2025/autumn.webp';
import winter from '../assets/img/gallery/2025/winter.webp';

export interface HomeGalleryItem {
  src: ImageMetadata;
  alt: string;
  widths: number[];
  sizes: string;
}

const masonryImageSizes = '(max-width: 576px) calc((100vw - 0.5rem) / 2), (max-width: 767px) calc((85vw - 0.5rem) / 2), (max-width: 1280px) calc((85vw - 1rem) / 3), calc((80vw - 1.5rem) / 4)';

const createMasonryImage = (
  src: ImageMetadata,
  alt: string,
): HomeGalleryItem => ({
  src,
  alt,
  widths: [320, 640, src.width],
  sizes: masonryImageSizes,
});

export const homeGalleryBackdropItems: HomeGalleryItem[] = [
  createMasonryImage(photo1, '杭州金沙湖'),
  createMasonryImage(photo2, '南京紫金山'),
  createMasonryImage(photo3, '杭州西湖'),
  createMasonryImage(photo4, '西兴大桥'),
  createMasonryImage(photo5, '檵木'),
  createMasonryImage(photo6, '上海街景'),
  createMasonryImage(photo7, '鹰厦铁路'),
  createMasonryImage(photo8, '香港旺角'),
  createMasonryImage(photo9, '汉口站'),
  createMasonryImage(photo10, '盛夏'),
  createMasonryImage(photo11, '雨中紫阳花'),
  createMasonryImage(photo12, '宁波三江口'),
  createMasonryImage(photo13, '可爱猫猫'),
  createMasonryImage(photo14, '绍兴柯桥'),
  createMasonryImage(photo15, '烟花'),
  createMasonryImage(photo16, '杭州西湖'),
  createMasonryImage(photo17, '日落'),
];

export interface HomeGallerySeasonItem extends HomeGalleryItem {
  season: string;
}

const seasonSizes = '(max-width: 767px) 40vw, (max-width: 1280px) 23vw, 317px';

export const homeGallerySeasonItems: HomeGallerySeasonItem[] = [
  { src: spring, widths: [320, 640, 750], sizes: seasonSizes, alt: '2025 春季照片', season: '春' },
  { src: summer, widths: [320, 640, 750], sizes: seasonSizes, alt: '2025 夏季照片', season: '夏' },
  { src: autumn, widths: [320, 640, 999], sizes: seasonSizes, alt: '2025 秋季照片', season: '秋' },
  { src: winter, widths: [320, 640, 714], sizes: seasonSizes, alt: '2025 冬季照片', season: '冬' },
];
