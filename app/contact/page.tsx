import React from "react";
import { Metadata } from "next";
import {
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Контакти | Українська Спільнота Швейцарії",
  description:
    "Зв'яжіться з нами. Ми завжди раді допомогти вам з будь-якими питаннями чи пропозиціями.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Контакти</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Маєте питання, пропозиції чи хочете долучитися до спільноти?
        Зв&apos;яжіться з нами, і ми будемо раді вам допомогти.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <Card className="p-6 lg:col-span-2 transition-all duration-300 ease-in-out hover:shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            Надіслати повідомлення
          </h2>
          <p className="text-red-600 mb-4">Наразі тимчасово форма не працює</p>
          <div className="opacity-50 pointer-events-none">
            <ContactForm />
          </div>
        </Card>

        {/* Contact Info */}
        <div>
          <Card className="p-6 mb-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h2 className="text-xl font-semibold mb-4">Контактна інформація</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:svoii.in.ch@gmail.com"
                    className="text-indigo-600 hover:underline transition-all duration-300 hover:text-indigo-800"
                  >
                    svoii.in.ch@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Адреса</p>
                  <p className="text-gray-600">
                    Швейцарія, Берн <br />
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h2 className="text-xl font-semibold mb-4">Соціальні мережі</h2>
            <div className="space-y-4">
              <a
                href="https://t.me/svoii_in_ch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border border-gray-200 transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm"
              >
                <MessageCircle className="h-5 w-5 text-blue-500 mr-3" />
                <span>Telegram канал проєкту</span>
                <ArrowRight className="h-4 w-4 ml-auto text-gray-500" />
              </a>
              <a
                href="https://t.me/+RcRMiysu4vQ0NDUy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border border-gray-200 transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm"
              >
                <MessageCircle className="h-5 w-5 text-blue-500 mr-3" />
                <span>Telegram чат проєкту</span>
                <ArrowRight className="h-4 w-4 ml-auto text-gray-500" />
              </a>
              <div className="flex items-center p-3 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed">
                <div className="h-5 w-5 text-pink-500 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span>Instagram</span>
                <ArrowRight className="h-4 w-4 ml-auto text-gray-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Можливості для різних груп користувачів
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Для членів спільноти */}
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
              <Users className="h-6 w-6 mr-3" />
              Для членів спільноти
            </h3>
            <p className="text-gray-600 mb-4">
              Бачити людей які у Швейцарії, писати про свої інтереси, знаходити
              людей по інтересах, створювати події на основі інтересів:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Хайкінг у гори
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Скетчінг у музеї
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Поїздки на фестиваль
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Кататися на лижах разом
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Настільні ігри
              </li>
            </ul>
          </Card>

          {/* Для благодійних організацій */}
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
              <MessageCircle className="h-6 w-6 mr-3" />
              Для благодійних організацій
            </h3>
            <p className="text-gray-600 mb-4">На нашому ресурсі ви зможете:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Додати свою організацію
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Додавати події
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Створювати форму для пошуку волонтерів або пропонувати роботу
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Отримувати запити для того щоб вступити або підтримати вашу
                організацію
              </li>
            </ul>
          </Card>

          {/* Для бізнесів */}
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-green-600">
              <div className="h-6 w-6 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              Для бізнесів
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Ви можете додати свій бізнес
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                У перспективі створювати події
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Бачити аналітику переглядів та динаміку подачі на ваші події
              </li>
            </ul>
          </Card>

          {/* Для самозайнятих */}
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
              <div className="h-6 w-6 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              Для самозайнятих
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Чудова можливість прорекламувати свої послуги
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Можливість бачити аналітику
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Можливість створювати онлайн/офлайн події
              </li>
            </ul>
          </Card>

          {/* Для перевізників */}
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-red-600">
              <div className="h-6 w-6 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 3h15v13H1z" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                </svg>
              </div>
              Для перевізників
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">
                  Поточні можливості:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Можливість відділити себе від потоку сміття і скаму, бо
                    нажаль, перевізники на сьогодні асоціюються із скамом та
                    шахраями
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Я знаю що перевізники також час від часу страждають від
                    людей які бронюють і не приходять - ми спробуємо це питання
                    мінімізувати
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800">
                  У перспективі:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Можливість створювати поїздки
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    "Чисте" ім'я
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Бачити аналітику та потреби людей
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Future Vision */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
            <div className="h-6 w-6 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            У перспективі
          </h3>
          <p className="text-gray-700">
            Якщо проєкт виросте, то я зможу наймати людей на цей проєкт та
            створити фонд з якого гроші будуть раз на певний період
            відправлятися на ЗСУ, але це все якщо проєкт цей переживе всі хвилі
            становлення 😊
          </p>
        </Card>
      </div>
    </div>
  );
}
