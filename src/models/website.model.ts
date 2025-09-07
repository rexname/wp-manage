
export interface WordpressWebsite {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  topic: string;
  articlesPublished: number;
}
