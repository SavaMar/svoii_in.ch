"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white pt-16 pb-8 border-t border-neutral-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Про нас
            </h3>
            <p className="mb-4 text-neutral-300">
              Ми об&apos;єднуємо тих, хто творить, допомагає, ділиться й
              підтримує. Досить шукати по чатах, як по смітниках. Тут — усе, що
              треба, і всі, хто треба. Під одним дахом. Для своїх.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Корисні посилання
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Головна
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Про нас
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Події
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Спільнота
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Ресурси
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Контакти
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-300 hover:text-blue-500 transition-colors"
                >
                  Умови користування
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Контакти
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300">Цюріх, Швейцарія</span>
              </div>
              <div className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:svoii.in.ch@gmail.com"
                  className="hover:text-blue-400 text-neutral-300 transition-colors"
                >
                  svoii.in.ch@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} Cвої in CH. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
