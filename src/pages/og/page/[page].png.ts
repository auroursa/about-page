import type { APIRoute, GetStaticPaths } from 'astro';
import { generateOgImage } from '../../../utils/og';

const pages: Record<string, { title: string; description?: string }> = {
  index: { title: '首页', description: '赤茶的个人页面' },
  posts: { title: '文章', description: '博客文章列表' },
  about: { title: '关于', description: '有关本站的一些建站信息' },
  friends: { title: '友人', description: '友链列表，按 A-Z 顺序排列' },
  '404': { title: '404', description: '抱歉，你访问的页面不存在' },
};

export const getStaticPaths: GetStaticPaths = async () => {
  return Object.entries(pages).map(([slug, data]) => ({
    params: { page: slug },
    props: data,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props.title, undefined, props.description);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
