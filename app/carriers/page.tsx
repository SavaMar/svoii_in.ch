import React from "react";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Перевізники | Українська Спільнота Швейцарії",
  description:
    "Інформація про перевізників та транспортні послуги для українців у Швейцарії",
};

export default function CarriersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">Перевізники</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Перевірені та рекомендовані перевізники, які допомагають українцям з
        перевезенням між Україною та Швейцарією
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Carrier 1 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">УкрШвейцТранс</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Цюріх - Київ - Львів</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+41123456789"
                  className="text-gray-600 hover:text-blue-700"
                >
                  +41 12 345 67 89
                </a>
              </div>
              <div className="flex items-start">
                <ExternalLink className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="https://ukrswiss-trans.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  ukrswiss-trans.com
                </a>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Пасажирські перевезення та доставка посилок між Швейцарією та
              Україною щотижня. Комфортабельні автобуси, досвідчені водії.
            </p>
          </div>
        </div>

        {/* Carrier 2 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Швидкі Перевезення</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Женева - Одеса - Харків</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+41987654321"
                  className="text-gray-600 hover:text-blue-700"
                >
                  +41 98 765 43 21
                </a>
              </div>
              <div className="flex items-start">
                <ExternalLink className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="https://fast-transport.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  fast-transport.ch
                </a>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Спеціалізуємося на швидкій доставці посилок та документів. Також
              пропонуємо перевезення пасажирів двічі на місяць.
            </p>
          </div>
        </div>

        {/* Carrier 3 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-3">Карпати-Альпи Тур</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  Берн - Львів - Івано-Франківськ
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+41555444333"
                  className="text-gray-600 hover:text-blue-700"
                >
                  +41 55 544 43 33
                </a>
              </div>
              <div className="flex items-start">
                <ExternalLink className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                <a
                  href="https://carpathian-tours.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  carpathian-tours.ch
                </a>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Регулярні автобусні рейси західною Україною. Також пропонуємо тури
              Карпатами для українців та швейцарців.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Хочете додати свою компанію?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-center mb-8">
          Якщо ви надаєте транспортні послуги між Україною та Швейцарією і
          хочете бути у нашому списку перевізників, зв&apos;яжіться з нами.
        </p>
        <div className="text-center">
          <Link href="/contact">
            <Button>Зв&apos;язатися з нами</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
