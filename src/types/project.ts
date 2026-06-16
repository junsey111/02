export type Category =
  | 'Brand'
  | 'Web'
  | 'Editorial'
  | 'Illustration'
  | 'Exhibition';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  client: string;
  category: Category;
  cover: string;
  gallery: string[];
  description: string;
  body: string[];
  tags: string[];
}
