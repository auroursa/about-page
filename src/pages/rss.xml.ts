import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  
  const sortedPosts = posts
    .filter((post) => post.data.pubDate || post.data.date)
    .sort((a, b) => {
      const dateA = a.data.pubDate || a.data.date;
      const dateB = b.data.pubDate || b.data.date;
      return new Date(dateB).valueOf() - new Date(dateA).valueOf();
    });

  return rss({
    title: 'Cynosura',
    description: '赤茶的个人博客',
    site: context.site || 'https://cynosura.one',
    items: sortedPosts.map((post) => {
      const postDate = post.data.pubDate || post.data.date;
      return {
        title: post.data.title,
        description: post.data.description || '',
        link: `/posts/${post.slug}/`,
        pubDate: postDate,
      };
    }),
    customData: `<language>zh-cn</language>`,
  });
}
