export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail: string | null;
  thumbnail_base64: string | null;
  active: number;

  status: "pending" | "approved" | "rejected" | "all";
  visits: number;
  likes: number;
  dislikes?: number; // Optional because legacy data might not have it in FE if not returned, though DB has default
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  likes: number;
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
  created_at: string;
}

export interface UseCaseFormInputs {
  title: string;
  content: string;
  website_id: string;
  image?: File | null;
  image_base64?: string;
}

// 设置
export interface Setting {
  id: number;
  key: string;
  value: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

// 页脚设置
export interface FooterSettings {
  links: FooterLink[];
  copyright: string;
  icpBeian: string;
  customHtml: string;
}
