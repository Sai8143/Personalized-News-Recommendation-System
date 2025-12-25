
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
  similarityScore: number; // 0-100 (Match with user interest)
  factCheckStatus?: 'verified' | 'suspicious' | 'debunked' | 'unverified';
}

export interface UserProfile {
  name: string;
  interests: Category[];
  preferredLanguages: string[];
  readingHistory: {
    id: string;
    title: string;
    category: Category;
    timestamp: number;
  }[];
  location?: {
    lat: number;
    lng: number;
    region?: string;
  };
}

export interface EvaluationMetrics {
  accuracy: number;
  ctr: number;
  diversity: number;
  novelty: number;
  filteringAccuracy: number;
}
