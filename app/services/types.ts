import { CantonCode } from "../utils/cantons";

export type ServiceCategory =
  | "Домашній майстер"
  | "Ремонт техніки"
  | "Оздоблювальні роботи"
  | "Будівельні роботи"
  | "Клінінгові послуги"
  | "Авто"
  | "Digital marketing"
  | "Реклама"
  | "Дизайн"
  | "Репетитори"
  | "Ділові послуги"
  | "Послуги для тварин"
  | "Послуги краси"
  | "Здоров'я"
  | "Організація свят"
  | "Спорт"
  | "Інші"
  | "Транспортні послуги"
  | "Фото-відео послуги"
  | "IT Розробка"
  | "Гастрономія";

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  "Домашній майстер": "border-amber-500",
  "Ремонт техніки": "border-slate-500",
  "Оздоблювальні роботи": "border-emerald-500",
  "Будівельні роботи": "border-orange-500",
  "Клінінгові послуги": "border-sky-500",
  Авто: "border-red-500",
  "Digital marketing": "border-violet-500",
  Реклама: "border-pink-500",
  Дизайн: "border-indigo-500",
  Репетитори: "border-blue-700",
  "Ділові послуги": "border-gray-700",
  "Послуги для тварин": "border-lime-500",
  "Послуги краси": "border-purple-500",
  "Здоров'я": "border-green-600",
  "Організація свят": "border-fuchsia-500",
  Спорт: "border-red-600",
  Інші: "border-gray-500",
  "Транспортні послуги": "border-yellow-500",
  "Фото-відео послуги": "border-cyan-500",
  "IT Розробка": "border-blue-500",
  Гастрономія: "border-rose-500",
};

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  kanton: CantonCode | string;
  zipCode: string;
  instagram?: string;
  website?: string;
  services: string[];
  online: boolean;
  offline: boolean;
  phone?: string;
  email: string;
  views: number;
  description?: string;
  images?: string[];
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}
