import type { BlocksContent } from '@strapi/blocks-react-renderer';

import type { StrapiLocaleObject } from '@/types/strapi';

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
  mime?: string;
}

export interface Article {
  title: string;
  description?: string | null;
  localizations: StrapiLocaleObject[];
  slug: string;
  content: BlocksContent;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  dynamic_zone: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
  localizations?: any[];
}

export type LocaleParamsProps = {
  params: Promise<{
    locale: string;
  }>;
};

export type LocaleSlugParamsProps = {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
};

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  description?: string;
  cover: Image;
  genres: Genre[];
  rating?: number;
  author: string;
  views?: number;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  chapters?: any[];
  dynamic_zone: any[];
  seo?: any;
  localizations: StrapiLocaleObject[];
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
