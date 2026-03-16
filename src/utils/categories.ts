export interface CategoryItem {
  name: string;
  count: number;
}

export const getCategoryItems = <T extends { data: { category?: string } }>(posts: T[]): CategoryItem[] => {
  const categories = [...new Set(posts.map((post) => post.data.category).filter((c): c is string => Boolean(c)))];
  return categories.map((category) => ({
    name: category,
    count: posts.filter((post) => post.data.category === category).length,
  }));
};
