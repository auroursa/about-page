import { defineCollection, z } from 'astro:content';

// 预处理函数：将 Date 对象转换为字符串，或保留字符串
const dateToString = (val: unknown) => {
  if (val instanceof Date) {
    // 将 UTC Date 转换为东八区日期时间字符串
    const year = val.getUTCFullYear();
    const month = String(val.getUTCMonth() + 1).padStart(2, '0');
    const day = String(val.getUTCDate()).padStart(2, '0');
    const hours = String(val.getUTCHours()).padStart(2, '0');
    const minutes = String(val.getUTCMinutes()).padStart(2, '0');
    const seconds = String(val.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return val;
};

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.preprocess(dateToString, z.string().optional()),
    pubDate: z.preprocess(dateToString, z.string().optional()),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    slug: z.string().optional(),
  }).refine((data) => data.title && data.title.length > 0, {
    message: "Title is required and cannot be empty",
  }),
});

export const collections = { blog };
