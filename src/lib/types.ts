export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail: string | null;
  thumbnail_base64: string | null;
  active: number;
  status: string;
  visits: number;
  likes: number;
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

// IPD导航相关类型
export interface IPDPhase {
  id: number;
  name: string;
  slug: string;
  order_num: number;
  color: string | null;
  stages: IPDStage[];
}

export interface IPDStage {
  id: number;
  name: string;
  phase_id: number;
  order_num: number;
  bg_color: string | null;
  is_important: boolean;
  websites: IPDWebsite[];
}

export interface IPDWebsite {
  id: number;
  title: string;
  url: string;
  description: string | null;
  stage_id: number;
  order_num: number;
}
