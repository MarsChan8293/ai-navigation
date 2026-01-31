export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail: string | null;
  active: number;
  status: "pending" | "approved" | "rejected" | "published" | "all";
  visits: number;
  likes: number;
  dislikes?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface FormInputs {
  title: string;
  url: string;
  description: string;
  category_id: string;
  thumbnail?: string;
}

export interface UseCase {
  id: number;
  title: string;
  content: string;
  image_base64: string | null;
  status: "published" | "draft";
  website_id: number;
  website?: Website;
  external_link?: string | null;
  created_at: string;
}

export interface UseCaseFormInputs {
  title: string;
  content: string;
  website_id: string;
  image?: File | null;
  image_base64?: string;
  external_link?: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface FooterSettings {
  links: FooterLink[];
  copyright: string;
  icpBeian: string;
  customHtml: string;
}
