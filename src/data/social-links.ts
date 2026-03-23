export interface SocialLink {
  id: string;
  title: string;
  url: string;
  iconBody: string;
  viewBox: string;
  external: boolean;
  heroIconClass?: string;
  drawerIconClass?: string;
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
  {
    id: 'mastodon',
    title: 'Mastodon',
    url: 'https://diff.network/@ursa',
    viewBox: '0 0 24 24',
    external: true,
    iconBody: '<path fill="currentColor" fill-rule="nonzero" d="M3.018 12.008c-.032-1.26-.012-2.448-.012-3.442 0-4.338 2.843-5.61 2.843-5.61 1.433-.658 3.892-.935 6.45-.956h.062c2.557.02 5.018.298 6.451.956 0 0 2.843 1.272 2.843 5.61 0 0 .036 3.201-.396 5.424-.275 1.41-2.457 2.955-4.963 3.254-1.306.156-2.593.3-3.965.236-2.243-.103-4.014-.535-4.014-.535 0 .218.014.426.04.62.084.633.299 1.095.605 1.435.766.85 2.106.93 3.395.974 1.82.063 3.44-.449 3.44-.449l.076 1.646s-1.274.684-3.542.81c-1.25.068-2.803-.032-4.612-.51-1.532-.406-2.568-1.29-3.27-2.471-1.093-1.843-1.368-4.406-1.431-6.992zm3.3 4.937v-2.548l2.474.605a20.54 20.54 0 0 0 1.303.245c.753.116 1.538.2 2.328.235 1.019.047 1.901-.017 3.636-.224 1.663-.199 3.148-1.196 3.236-1.65.082-.422.151-.922.206-1.482a33.6 33.6 0 0 0 .137-2.245c.015-.51.02-.945.017-1.256v-.059c0-1.43-.369-2.438-.963-3.158a3.008 3.008 0 0 0-.584-.548c-.09-.064-.135-.089-.13-.087-1.013-.465-3.093-.752-5.617-.773h-.046c-2.54.02-4.62.308-5.65.782.023-.01-.021.014-.112.078a3.008 3.008 0 0 0-.584.548c-.594.72-.963 1.729-.963 3.158 0 .232 0 .397-.003.875a77.483 77.483 0 0 0 .014 2.518c.054 2.197.264 3.835.7 5.041.212.587.472 1.07.78 1.45a5.7 5.7 0 0 1-.18-1.505zM8.084 6.37a1.143 1.143 0 1 1 0 2.287 1.143 1.143 0 0 1 0-2.287z"></path>',
  },
  {
    id: 'telegram',
    title: 'Telegram',
    url: 'https://t.me/looprucha',
    viewBox: '2 8 58 47',
    external: true,
    iconBody: '<path d="M26.67,38.57l-.82,11.54A2.88,2.88,0,0,0,28.14,49l5.5-5.26,11.42,8.35c2.08,1.17,3.55.56,4.12-1.92l7.49-35.12h0c.66-3.09-1.08-4.33-3.16-3.55l-44,16.85C6.47,29.55,6.54,31.23,9,32l11.26,3.5L45.59,20.71c1.23-.83,2.36-.37,1.44.44Z" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"></path>',
  },
  {
    id: 'matrix',
    title: 'Element (Matrix)',
    url: 'https://matrix.to/#/@froseiun:matrix.org',
    viewBox: '0 0 54 54',
    external: true,
    drawerIconClass: 'h-[0.95rem] w-[0.95rem]',
    iconBody: '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4414 3.24C19.4414 1.4506 20.892 0 22.6814 0C34.6108 0 44.2814 9.67065 44.2814 21.6C44.2814 23.3894 42.8308 24.84 41.0414 24.84C39.252 24.84 37.8014 23.3894 37.8014 21.6C37.8014 13.2494 31.032 6.48 22.6814 6.48C20.892 6.48 19.4414 5.0294 19.4414 3.24Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M34.5586 50.76C34.5586 52.5494 33.108 54 31.3186 54C19.3893 54 9.71861 44.3294 9.71861 32.4C9.71861 30.6106 11.1692 29.16 12.9586 29.16C14.748 29.16 16.1986 30.6106 16.1986 32.4C16.1986 40.7505 22.9681 47.52 31.3186 47.52C33.108 47.52 34.5586 48.9706 34.5586 50.76Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.24 34.5601C1.4506 34.5601 0 33.1095 0 31.3201C0 19.3907 9.67065 9.72007 21.6 9.72007C23.3894 9.72007 24.84 11.1707 24.84 12.9601C24.84 14.7495 23.3894 16.2001 21.6 16.2001C13.2495 16.2001 6.48 22.9695 6.48 31.3201C6.48 33.1095 5.0294 34.5601 3.24 34.5601Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M50.76 19.4399C52.5494 19.4399 54 20.8905 54 22.6799C54 34.6093 44.3294 44.2799 32.4 44.2799C30.6106 44.2799 29.16 42.8293 29.16 41.0399C29.16 39.2505 30.6106 37.7999 32.4 37.7999C40.7505 37.7999 47.52 31.0305 47.52 22.6799C47.52 20.8905 48.9706 19.4399 50.76 19.4399Z"></path>',
  },
];

export const heroSocialIconOrder = ['email', 'instagram', 'bluesky', 'twitter', 'mastodon'] as const;

export const drawerSocialIconOrder = [...heroSocialIconOrder, 'telegram', 'matrix'] as const;

const socialIconMap = new Map(socialIconLinks.map((link) => [link.id, link]));

export function getSocialLinkById(id: string): SocialLink | undefined {
  return socialIconMap.get(id);
}

export function getOrderedSocialLinks(order: readonly string[]): SocialLink[] {
  return order.flatMap((id) => {
    const link = socialIconMap.get(id);
    if (link) {
      return [link];
    }
    if (import.meta.env.DEV) {
      console.warn(`[social-links] Missing social link id: ${id}`);
    }
    return [];
  });
}
