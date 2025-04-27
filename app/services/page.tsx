import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Послуги | Українська Спільнота Швейцарії",
  description: "Корисні послуги та сервіси для українців у Швейцарії",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
