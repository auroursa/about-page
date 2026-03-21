export interface SocialLink {
  id: string;
  title: string;
  url: string;
  iconBody: string;
  viewBox: string;
  external: boolean;
}

export const socialIconLinks: SocialLink[] = [
  {
    id: 'email',
    title: 'Email',
    url: 'mailto:hi@cynosura.one',
    viewBox: '0.5 1 23 22',
    external: false,
    iconBody: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></polyline>',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com/skykousa',
    viewBox: '0 0 24 24',
    external: true,
    iconBody: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></rect><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.2"></circle><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor"></circle>',
  },
  {
    id: 'bluesky',
    title: 'Bluesky',
    url: 'https://bsky.app/profile/cynosura.one',
    viewBox: '-20 -20 640 570',
    external: true,
    iconBody: '<path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" fill="none" stroke="currentColor" stroke-width="56" stroke-linejoin="round"></path>',
  },
  {
    id: 'twitter',
    title: 'Twitter',
    url: 'https://twitter.com/astraorsa',
    viewBox: '0 0 24 24',
    external: true,
    iconBody: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>',
  },
];
