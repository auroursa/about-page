export type HomeInfoIcon =
  | 'terminal'
  | 'code'
  | 'camera'
  | 'go'
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
  description: string;
  icon: HomeInfoIcon;
}

export const homeSkillItems: HomeInfoItem[] = [
  { label: 'Linux', description: 'I use Fedora btw', icon: 'terminal' },
  { label: 'Network', description: '醒醒，起来拉网线了', icon: 'network' },
  { label: 'Frontend', description: 'Typescript & React', icon: 'code' },
  { label: 'Backend', description: 'Go 是世界上最好的语言', icon: 'go' },
  { label: 'Photography', description: '镜头里的光影与城市碎片', icon: 'camera' },
  { label: 'Localization', description: '字里行间的跨文化表达', icon: 'language' },
];

export const homeDeviceItems: HomeInfoItem[] = [
  { label: 'MacBook Pro 14', description: 'Apple M5 / 32GB', icon: 'laptop' },
  { label: 'iPhone 17', description: '我 3 年内不会换了！', icon: 'phone' },
  { label: 'iPad Pro 11-inch', description: 'LCD 永不为奴()', icon: 'tablet' },
  { label: 'AirPods Pro 3', description: '旅途需要有音乐作伴', icon: 'earbuds' },
  { label: 'Apple Watch S7', description: '看时间和记录数据', icon: 'watch' },
  { label: 'Lumix DC-GX9', description: '绝赞吃灰中...', icon: 'camera-device' },
];
