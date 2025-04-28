import React from "react";
import { Metadata } from "next";
import {
  ExternalLink,
  MapPin,
  Briefcase,
  Home,
  Heart,
  FileText,
  Users,
  Globe,
  Book,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Корисні ресурси | Українська Спільнота Швейцарії",
  description:
    "Корисні ресурси, посилання та інформація для українських біженців та мігрантів у Швейцарії",
};

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Корисні ресурси</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Зібрання корисних посилань та ресурсів для українців у Швейцарії.
        Інформація про статус S, юридична допомога, вивчення мови, житло,
        працевлаштування та багато іншого.
      </p>
      <p className="text-red-600 text-2xl max-w-3xl mx-auto text-center mb-12">
        Всі ці ресурси не справжніми і використовуються для тестування наразі.
      </p>

      {/* Official Information */}
      <ResourceSection
        title="Офіційна інформація"
        icon={<FileText className="h-6 w-6 text-indigo-700" />}
        description="Офіційні ресурси швейцарського уряду та міжнародних організацій"
      >
        <ResourceCard
          title="Державний секретаріат з питань міграції (SEM)"
          description="Офіційна інформація про статус захисту S, процедуру подання заяви та права"
          link="https://www.sem.admin.ch/sem/en/home/sem/aktuell/ukraine-krieg.html"
        />
        <ResourceCard
          title="UNHCR - Швейцарія"
          description="Агентство ООН у справах біженців, інформація та допомога"
          link="https://help.unhcr.org/switzerland/"
        />
        <ResourceCard
          title="Швейцарський Червоний Хрест"
          description="Гуманітарна допомога, реєстрація, возз'єднання сімей"
          link="https://www.redcross.ch/de/ukraine-krise"
        />
        <ResourceCard
          title="Swiss Support for UA"
          description="Офіційний портал допомоги України від швейцарського уряду"
          link="https://www.supportukraine.swiss/"
        />
      </ResourceSection>

      {/* Legal Assistance */}
      <ResourceSection
        title="Юридична допомога"
        icon={<CheckCircle className="h-6 w-6 text-indigo-700" />}
        description="Юридичні консультації та підтримка для біженців"
      >
        <ResourceCard
          title="HEKS/EPER - Юридична консультація"
          description="Безкоштовні юридичні консультації для біженців та шукачів притулку"
          link="https://www.heks.ch/en/what-we-do/heks-support-refugees"
        />
        <ResourceCard
          title="Caritas - Правова консультація"
          description="Правова підтримка у питаннях статусу, возз'єднання сім'ї та соціальних прав"
          link="https://www.caritas.ch/en/what-we-do/in-switzerland/refugee-support.html"
        />
        <ResourceCard
          title="Schweizerische Flüchtlingshilfe"
          description="Швейцарська допомога біженцям"
          link="https://www.fluechtlingshilfe.ch/hilfe-fuer-schutzsuchende"
        />
      </ResourceSection>

      {/* Housing */}
      <ResourceSection
        title="Житло"
        icon={<Home className="h-6 w-6 text-indigo-700" />}
        description="Ресурси для пошуку житла та тимчасового притулку"
      >
        <ResourceCard
          title="Campax - Shelter Ukraine"
          description="Платформа для пошуку тимчасового житла у швейцарських сім'ях"
          link="https://campax.org/shelter-ukraine/"
        />
        <ResourceCard
          title="Швейцарська асоціація квартирантів"
          description="Консультації з питань оренди житла та прав орендарів"
          link="https://www.mieterverband.ch/"
        />
        <ResourceCard
          title="wohnungenvermittlung.ch"
          description="Пошук житла для біженців з України"
          link="https://wohnungenvermittlung.ch/"
        />
        <ResourceCard
          title="Soliswiss"
          description="Платформа для українців, які шукають тимчасове житло у Швейцарії"
          link="https://www.soliswiss.ch/en/ukraine/"
        />
      </ResourceSection>

      {/* Employment */}
      <ResourceSection
        title="Працевлаштування"
        icon={<Briefcase className="h-6 w-6 text-indigo-700" />}
        description="Допомога у пошуку роботи та кар'єрному розвитку"
      >
        <ResourceCard
          title="JobRooms"
          description="Державний портал пошуку роботи в Швейцарії"
          link="https://www.job-room.ch/"
        />
        <ResourceCard
          title="Jobs4Ukraine"
          description="Спеціалізована платформа для працевлаштування українців"
          link="https://jobs4ukraine.ch/uk"
        />
        <ResourceCard
          title="Центр кар'єри для біженців"
          description="Допомога у написанні резюме, пошуку роботи та підготовці до співбесід"
          link="https://powercoders.org/country/switzerland/"
        />
        <ResourceCard
          title="Swiss Refugee Council - Інтеграція на ринку праці"
          description="Інформація про право на роботу та інтеграцію"
          link="https://www.refugeecouncil.ch/topics/integration/integration-into-the-labour-market"
        />
      </ResourceSection>

      {/* Education */}
      <ResourceSection
        title="Освіта та мова"
        icon={<Book className="h-6 w-6 text-indigo-700" />}
        description="Вивчення мови, освітні програми та курси"
      >
        <ResourceCard
          title="Swiss MOOC Service"
          description="Безкоштовні онлайн-курси швейцарських університетів"
          link="https://www.mooc.ch/"
        />
        <ResourceCard
          title="Swiss Learning Hub"
          description="Онлайн-програми для навчання та професійного розвитку"
          link="https://www.swisslearninghub.com/"
        />
        <ResourceCard
          title="A1-навчальний курс німецької мови"
          description="Безкоштовний базовий курс німецької для новоприбулих"
          link="https://www.integration.apps.be.ch/start/uk"
        />
        <ResourceCard
          title="Migros Klubschule"
          description="Курси мови для мігрантів за доступними цінами"
          link="https://www.klubschule.ch/de/sprachen-und-kulturen/deutsch-schweizerdeutsch"
        />
        <ResourceCard
          title="Українська суботня школа у Швейцарії"
          description="Школа для дітей української діаспори у різних кантонах"
          link="https://uaschool.ch/"
        />
      </ResourceSection>

      {/* Health */}
      <ResourceSection
        title="Здоров'я"
        icon={<Heart className="h-6 w-6 text-indigo-700" />}
        description="Медичні та психологічні послуги"
      >
        <ResourceCard
          title="Психологічна підтримка для біженців"
          description="Безкоштовна психологічна допомога українською/російською мовами"
          link="https://www.psy4ukr.ch/"
        />
        <ResourceCard
          title="Федеральне управління охорони здоров'я"
          description="Офіційна інформація про систему охорони здоров'я Швейцарії"
          link="https://www.bag.admin.ch/bag/en/home.html"
        />
        <ResourceCard
          title="Телефон довіри Швейцарія"
          description="Анонімна психологічна допомога у кризових ситуаціях"
          link="https://www.143.ch/en/"
        />
        <ResourceCard
          title="Медична допомога для біженців"
          description="Медична підтримка та інформація про страхування здоров'я"
          link="https://www.migesplus.ch/en"
        />
      </ResourceSection>

      {/* Community */}
      <ResourceSection
        title="Спільнота та інтеграція"
        icon={<Users className="h-6 w-6 text-indigo-700" />}
        description="Українські організації у Швейцарії та програми інтеграції"
      >
        <ResourceCard
          title="Посольство України в Швейцарії"
          description="Офіційне представництво України в Швейцарії"
          link="https://switzerland.mfa.gov.ua/en"
        />
        <ResourceCard
          title="Союз українок Швейцарії"
          description="Українська жіноча організація, культурні заходи та підтримка"
          link="https://www.ukrgemeinde.ch/"
        />
        <ResourceCard
          title="Ukraine Update Switzerland"
          description="Актуальні новини для українців у Швейцарії"
          link="https://www.ukraineupdate.ch/"
        />
        <ResourceCard
          title="Соціальна інтеграція Швейцарії"
          description="Програми соціальної інтеграції та підтримки біженців"
          link="https://www.sem.admin.ch/sem/en/home/themen/integration.html"
        />
      </ResourceSection>

      {/* Travel */}
      <ResourceSection
        title="Транспорт і подорожі"
        icon={<Globe className="h-6 w-6 text-indigo-700" />}
        description="Інформація про переміщення Швейцарією та до України"
      >
        <ResourceCard
          title="SBB/CFF/FFS - Швейцарські залізниці"
          description="Офіційний сайт швейцарських залізниць для планування подорожей"
          link="https://www.sbb.ch/en"
        />
        <ResourceCard
          title="Безкоштовний проїзд для українців"
          description="Інформація про можливості безкоштовного проїзду"
          link="https://www.alliance-swisspass.ch/de/themen/ukraine"
        />
        <ResourceCard
          title="FlixBus - Маршрути до України"
          description="Міжнародні автобусні рейси між Швейцарією та Україною"
          link="https://www.flixbus.ch/"
        />
        <ResourceCard
          title="Перевізники України та Швейцарії"
          description="Огляд підтверджених перевізників між країнами"
          link="/carriers"
        />
      </ResourceSection>

      {/* Local Resources by Canton */}
      <ResourceSection
        title="Ресурси за кантонами"
        icon={<MapPin className="h-6 w-6 text-indigo-700" />}
        description="Специфічні ресурси для різних регіонів Швейцарії"
      >
        <ResourceCard
          title="Цюрих (ZH)"
          description="Ресурси та контакти для українців у кантоні Цюрих"
          link="https://www.zh.ch/de/migration-integration/ukraine.html"
        />
        <ResourceCard
          title="Берн (BE)"
          description="Інформація для українців у кантоні Берн"
          link="https://www.asyl.sites.be.ch/de/start/schutzstatus-s-ukraine.html"
        />
        <ResourceCard
          title="Женева (GE)"
          description="Ресурси та підтримка у кантоні Женева"
          link="https://www.ge.ch/ukraine-informations-refugies-provenant-ukraine"
        />
        <ResourceCard
          title="Во (VD)"
          description="Інформація для українців у кантоні Во"
          link="https://www.vd.ch/ukraine"
        />
        <ResourceCard
          title="Тічіно (TI)"
          description="Ресурси та підтримка у кантоні Тічіно"
          link="https://www4.ti.ch/di/spop/ucraina/ucraina/"
        />
        <ResourceCard
          title="Базель (BS/BL)"
          description="Інформація для українців у кантонах Базель-Штадт і Базель-Ланд"
          link="https://www.bs.ch/ukrainehilfe"
        />
      </ResourceSection>

      {/* Add a resource section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Маєте корисне посилання?</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Якщо у вас є корисний ресурс, який варто додати до цього списку, будь
          ласка, поділіться з нами. Ми прагнемо створити найповніший і
          найкориснішій довідник для українців у Швейцарії.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-all duration-300"
        >
          Запропонувати ресурс
        </Link>
      </div>
    </div>
  );
}

// Resource Section Component
function ResourceSection({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  const isExternal = !link.startsWith("/");

  const CardContent = () => (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md border-gray-200 flex flex-col">
      <div className="p-5 flex flex-col h-full">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex items-center text-indigo-600 mt-auto text-sm font-medium">
          {isExternal ? "Відкрити посилання" : "Перейти на сторінку"}
          <ExternalLink className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Card>
  );

  return isExternal ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <CardContent />
    </a>
  ) : (
    <Link href={link} className="block h-full">
      <CardContent />
    </Link>
  );
}
