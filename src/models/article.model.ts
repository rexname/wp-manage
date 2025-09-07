
export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  seoScore: number;
  status: 'draft' | 'publishing' | 'published' | 'error';
  targetWebsiteId: string;
  targetWebsiteName: string;
}
