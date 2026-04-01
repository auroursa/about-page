import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../utils/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, category: post.data.category, description: post.data.description },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props.title, props.category, props.description);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
