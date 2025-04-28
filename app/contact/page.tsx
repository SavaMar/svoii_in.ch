import React from "react";
import { Metadata } from "next";
import {
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle,
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

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Часті запитання</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Як я можу стати членом спільноти?
            </h3>
            <p className="text-gray-600">
              Щоб стати членом нашої спільноти, вам потрібно зареєструватися на
              сайті та заповнити профіль. Після цього вам будуть доступні всі
              функції та можливості.{" "}
              <span className="text-red-700">
                Але прямо зараз ця можливість у процесі розробки
              </span>
            </p>
          </Card>
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Чи є членські внески?
            </h3>
            <p className="text-gray-600">
              Ні, реєстрація та членство у нашій спільноті абсолютно
              безкоштовні. Однак, ми приймаємо добровільні пожертви для розвитку
              проєкту.{" "}
              <span className="text-red-700">
                Але реклама своїх послуг (4chf), превізників (8chf) та тури
                (10chf) є платною на основі що місячної підписки
              </span>
            </p>
          </Card>
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Як додати свій бізнес до каталогу?
            </h3>
            <p className="text-gray-600">
              Щоб додати свій бізнес чи послугу до нашого каталогу, будь ласка,
              <s>заповніть форму вище </s> або зв&apos;яжіться з нами через
              телеграм чи імейл. Після перевірки інформації ваш бізнес буде
              додано.
            </p>
          </Card>
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Як я можу допомогти розвивати спільноту?
            </h3>
            <p className="text-gray-600">
              Ви можете допомогти нам, поширюючи інформацію про спільноту серед
              друзів, беручи участь у заходах, надаючи зворотній зв&apos;язок
              або ставши волонтером. Зв&apos;яжіться з нами для більш детальної
              інформації.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
