export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
}
