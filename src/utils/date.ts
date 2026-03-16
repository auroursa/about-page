const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '';
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  return `${year}-${month}-${day} (${weekdays[date.getUTCDay()]})`;
};

export const parseDateForSort = (dateStr: string): Date => {
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return new Date(0);
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
};

export const toISODatetime = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  return dateStr.replace(' ', 'T');
};

export const sortPostsByDate = <T extends { data: { pubDate?: string; date?: string } }>(posts: T[]): T[] => {
  return posts
    .filter((post) => post.data.pubDate || post.data.date)
    .sort((a, b) => {
      const dateA = (a.data.pubDate || a.data.date) as string;
      const dateB = (b.data.pubDate || b.data.date) as string;
      return parseDateForSort(dateB).valueOf() - parseDateForSort(dateA).valueOf();
    });
};
