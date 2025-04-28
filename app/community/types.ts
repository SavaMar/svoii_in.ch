import { CantonCode } from "../utils/cantons";

export type Interest =
  | "хайкінг"
  | "IT"
  | "малювання"
  | "вишивка"
  | "спів"
  | "плавання"
  | "фотографія"
  | "гастрономія"
  | "читання"
  | "спорт"
  | "подорожі"
  | "йога"
  | "музика"
  | "танці"
  | "кіно"
  | "рукоділля"
  | "садівництво"
  | "волонтерство";

export interface SocialContacts {
  telegram?: string;
  whatsapp?: string;
  viber?: string;
  instagram?: string;
  facebook?: string;
  email?: string;
  phone?: string;
}

export interface CommunityMember {
  id: string;
  firstName: string;
  lastName?: string;
  nickname?: string;
  avatarUrl: string;
  bio?: string;
  kanton: CantonCode;
  interests: string[];
  contacts: SocialContacts;
  joinedAt: string;
  isVerified: boolean;
}

export interface CommunityFilterOptions {
  kantons: CantonCode[];
  interests: string[];
}
