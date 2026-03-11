export type HomeInfoIcon =
  | 'terminal'
  | 'code'
  | 'camera'
  | 'database'
  | 'network'
  | 'language'
  | 'laptop'
  | 'tablet'
  | 'phone'
  | 'earbuds'
  | 'watch'
  | 'camera-device';

export interface HomeInfoItem {
  label: string;
  icon: HomeInfoIcon;
}

export const homeSkillItems: HomeInfoItem[] = [
  { label: 'Linux Shell', icon: 'terminal' },
  { label: 'HTML & CSS', icon: 'code' },
  { label: 'Photography', icon: 'camera' },
  { label: 'Database', icon: 'database' },
  { label: 'Network', icon: 'network' },
  { label: 'Localization', icon: 'language' },
];

export const homeDeviceItems: HomeInfoItem[] = [
  { label: 'MacBook Pro 14', icon: 'laptop' },
  { label: 'iPad Pro 2022', icon: 'tablet' },
  { label: 'iPhone 17', icon: 'phone' },
  { label: 'AirPods Pro 3', icon: 'earbuds' },
  { label: 'Apple Watch S7', icon: 'watch' },
  { label: 'Lumix DC-GX9', icon: 'camera-device' },
];
