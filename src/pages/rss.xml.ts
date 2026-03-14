import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { sortPostsByDate } from '../utils/date';

const parser = new MarkdownIt();

const allowedTags = [...sanitizeHtml.defaults.allowedTags, 'img'];
const allowedAttributes = {
  ...sanitizeHtml.defaults.allowedAttributes,
  img: ['src', 'alt', 'title'],
};

const moreMarkerPattern = /<!--\s*More\s*-->/gi;
const rootRelativeUrlPattern = /(href|src)="(\/[^"#?][^"]*)"/g;

const renderRssContent = (content: string, site: URL) => {
  const renderedContent = parser.render(content.replace(moreMarkerPattern, ''));
  const sanitizedContent = sanitizeHtml(renderedContent, {
    allowedTags,
    allowedAttributes,
  });

  return sanitizedContent.replace(rootRelativeUrlPattern, (_, attribute, value) => {
    const absoluteUrl = new URL(value, site).toString();
    return `${attribute}="${absoluteUrl}"`;
  });
};

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const site = import.meta.env.DEV
    ? new URL(context.url.origin)
    : context.site ?? new URL(context.url.origin);

  const sortedPosts = sortPostsByDate(posts);

  return rss({
    title: 'Cynosura',
    description: '赤茶的个人博客',
    site,
    items: sortedPosts.map((post) => {
      const postDate = post.data.pubDate || post.data.date;

      return {
        title: post.data.title,
        description: post.data.description || '',
        link: `/posts/${post.id}/`,
        pubDate: postDate,
        content: post.body ? renderRssContent(post.body, site) : '',
      };
    }),
    customData: `<language>zh-cn</language>`,
  });
}
