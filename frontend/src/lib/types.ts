export type Locale = "en" | "am";

export interface NewsArticle {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  coverImage: string;
  publishDate: string;
  status: "Published" | "Draft";
  isFeatured?: boolean;
  category: string;
  readTime: string;
  author: string;
}

export interface BusinessSolution {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  badge?: string;
}

export interface ProductService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  linkText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  category: string;
}
