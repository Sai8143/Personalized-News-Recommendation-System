
export type Category = 'General' | 'Politics' | 'Technology' | 'Sports' | 'Entertainment' | 'Health' | 'Finance' | 'Environment';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: Category;
  imageUrl?: string;
  isIndian: boolean;
  credibilityScore: number; // 0-100
  factCheckStatus?: 'verified' | 'suspicious' | 'debunked' | 'unverified';
}

export interface UserProfile {
  name: string;
  interests: Category[];
  preferredLanguages: string[];
  readingHistory: string[]; // Article IDs
  location?: {
    lat: number;
    lng: number;
    region?: string;
  };
}

export interface Interaction {
  articleId: string;
  type: 'click' | 'share' | 'verify' | 'read';
  timestamp: number;
}
