import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Про проєкт | Українська Спільнота Швейцарії",
  description:
    "Про проєкт SVOII.IN.CH - єдина платформа для українців у Швейцарії",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Про проєкт</h1>

      <div className="max-w-5xl mx-auto">
        <Card className="p-6 md:p-8 lg:p-10 mb-12">
          <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
            {/* Photo section */}
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg mb-6">
                <Image
                  src="/fake-avatar.jpg"
                  alt="Засновниця проєкту"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 256px, 320px"
                  priority
                  unoptimized
                />
                {/* Note: Replace the image above with your own photo by adding it to the public folder */}
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500/50 to-pink-500/50 text-white rounded-full shadow-md cursor-not-allowed opacity-50 mt-2">
                <Instagram className="h-5 w-5" />
                <span>Мій Instagram</span>
                {/* Note: Instagram link temporarily disabled */}
              </div>
            </div>

            {/* Text section */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
                Від засновниці
              </h2>

              <div className="prose prose-indigo max-w-none">
                <p className="mb-4 text-lg leading-relaxed">
                  Цей проєкт створений звичайною живою людиною яка дуже
                  втомилася ритися по всім чатам, каналам та групам у пошуку
                  людей, перевізників та якогось &ldquo;повітря&rdquo; у
                  спілкуванні із людьми.
                </p>

                <p className="mb-4 text-lg leading-relaxed">
                  Я прийняла рішення створите одне єдине місце де можна знайти
                  людей у Швейцарії по інтересах, знайти бізнеси, співрацю,
                  простір для коллаборацій, список перевізників яким довіряють
                  люди та ще багато чого.
                </p>

                <p className="mb-4 text-lg leading-relaxed">
                  Я не займаюся інтеграцією, курсами, написаннями CV і душними
                  без результатними зборами - я хочу обʼднувати, будувати, дати
                  можливість нарешті підприємцям себе проявити.
                </p>

                <p className="mb-4 text-lg leading-relaxed">
                  Буде також простір для людей які ведуть блоги, збирають цікаву
                  інфу про швейцарію чи веде ютюб - не проти один одного, а ЗА.
                </p>
              </div>

              <div className="mt-8 p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r">
                <p className="italic text-indigo-800">
                  &ldquo;Швейцарія для мене - наче невеликий всесвіт, де кожен з
                  нас може знайти своє місце. Мрію об&apos;єднати нас усіх в
                  дружню та корисну спільноту.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-2">Наша місія</h3>
            <p className="text-gray-600">
              Створити зручний інформаційний простір для українців у Швейцарії,
              де легко знайти потрібні послуги, зв&apos;язки та підтримку.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-2">Наші цінності</h3>
            <p className="text-gray-600">
              Прозорість, взаємодопомога, якість інформації та створення
              можливостей для кожного українця реалізувати себе у Швейцарії.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all">
            <h3 className="font-bold text-xl mb-2">Наші плани</h3>
            <p className="text-gray-600">
              Розвивати платформу, додавати нові функції, охоплювати більше сфер
              і послуг, щоб задовольнити потреби усіх членів нашої спільноти.
            </p>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-teal-50 border-none">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Приєднуйтесь до нас!
          </h2>
          <p className="text-center max-w-3xl mx-auto">
            Ми відкриті до співпраці, нових ідей та ініціатив. Якщо у вас є
            пропозиції або ви хочете стати частиною проєкту, зв&apos;яжіться з
            нами через{" "}
            <Link href="/contact" className="text-indigo-600 hover:underline">
              сторінку контактів
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
