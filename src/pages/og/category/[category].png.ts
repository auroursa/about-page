import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../utils/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  const categories = [...new Set(posts.map((p) => p.data.category).filter(Boolean))];
  return categories.map((category) => ({
    params: { category },
    props: { category },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const category = props.category as string;
  const png = await generateOgImage(category, '文章分类', `「${category}」分类下的所有文章`);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
