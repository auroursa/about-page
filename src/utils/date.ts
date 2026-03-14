const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '';
  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T12:00:00+08:00`);
  return `${year}-${month}-${day} (${weekdays[date.getDay()]})`;
};

export const parseDateForSort = (dateStr: string): Date => {
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return new Date(0);
  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00+08:00`);
};

export const toISODatetime = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  return `${dateStr.replace(' ', 'T')}+08:00`;
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
