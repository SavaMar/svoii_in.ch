"use client";

import Link from "next/link";
import { Calendar, Users, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-teal-500/80 z-10" />
        <div className="relative h-full w-full bg-[url('/hero-background.jpg')] bg-cover bg-center">
          <div className="container mx-auto px-5 h-full flex flex-col justify-center z-20 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                СвоЇ у Швейцарії
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Ми об&apos;єднуємо тих, хто творить, допомагає, ділиться й
                підтримує. Досить шукати по чатах, як по смітниках. Тут — усе,
                що треба, і всі, хто треба. Під одним дахом. <b>Для своїх.</b>
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/events">
                  <Button
                    size="lg"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Найближчі події
                  </Button>
                </Link>
                <Link href="/community">
                  <Button
                    size="lg"
                    className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                  >
                    Приєднатися до спільноти
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Про нашу спільноту
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              <b>СвоЇ in CH</b> — це простір для своїх. Ми об&apos;єднуємо тих,
              хто творить, допомагає, ділиться й підтримує. Тут знайдеш діяльних
              людей, події, ініціативи та можливості для співпраці. Це місце, де
              українці допомагають одне одному зростати, інтегруватися й
              будувати нове життя разом — із сенсом, розумінням і натхненням.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Link href="/community">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Спільнота
                </h3>
                <p className="text-gray-600 h-24">
                  Ми обʼєднуємо людей за інтересами та місцем знаходження так як
                  ніхто цього не робить. Знаходити однодумців поряд - це те, що
                  робить нашу спільноту особливою. Приєднуйтесь до нас, щоб бути
                  частиною цього унікального простору.
                </p>
              </div>
            </Link>

            <Link href="/events">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                <Calendar className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Події
                </h3>
                <p className="text-gray-600 h-24">
                  Ми збираємо події, воркшопи, майстер-класи та благодійні акції
                  для українців. Комунікуйте, навчайтеся та знаходьте нові
                  знайомства.
                </p>
              </div>
            </Link>

            <Link href="/services">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                <ExternalLink className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Співпраця
                </h3>
                <p className="text-gray-600 h-24">
                  Знайдіть людей, бізнеси та однодумців для співпраці.
                  Організована подача послуг від українців для українців у
                  Швейцарії.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Найближчі події спільноти
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Долучайтесь до наших заходів, щоб познайомитись з іншими
              представниками спільноти то зробити свій внесок у розвиток цього
              проєкту.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-48 relative bg-gradient-to-r from-indigo-50 to-teal-50 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-indigo-400/60" />
              </div>
              <div className="p-6">
                <div className="text-sm text-indigo-600 font-medium mb-2">
                  20 червня 2024, 18:00
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Українські посиденьки у Цюріху
                </h3>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Центр української громади, Цюріх
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Неформальна зустріч української громади з частуванням та
                  гарними розмовами.
                </p>
                <Link href="/events/ukrainian-meetup">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Дізнатися більше
                  </Button>
                </Link>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-48 relative bg-gradient-to-r from-indigo-50 to-teal-50 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-indigo-400/60" />
              </div>
              <div className="p-6">
                <div className="text-sm text-indigo-600 font-medium mb-2">
                  25 червня 2024, 10:00
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Майстер-клас з української вишивки
                </h3>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Культурний центр, Берн</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Майстер-клас з традиційної української вишивки для
                  початківців. Усі матеріали включено.
                </p>
                <Link href="/events/embroidery-workshop">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Дізнатися більше
                  </Button>
                </Link>
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-48 relative bg-gradient-to-r from-indigo-50 to-teal-50 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-indigo-400/60" />
              </div>
              <div className="p-6">
                <div className="text-sm text-indigo-600 font-medium mb-2">
                  2 липня 2024, 19:00
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Благодійний концерт на підтримку України
                </h3>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Палац культури, Женева</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Благодійний концерт за участі українських та швейцарських
                  музикантів для збору коштів на гуманітарну допомогу.
                </p>
                <Link href="/events/charity-concert">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Дізнатися більше
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Усі події
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Долучайтеся до співпраці</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Разом ми можемо створити дружню спільноту у Швейцарії, ділитися
            досвідом та реалізовувати корисні ініціативи.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-gray-100"
            >
              Зв&apos;язатися з нами
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
