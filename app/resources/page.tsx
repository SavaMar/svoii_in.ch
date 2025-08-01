import React from "react";
import { Metadata } from "next";
import { FileText, Building } from "lucide-react";
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
        Офіційна інформація про статус S та практичні поради.
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
          link="https://www.sem.admin.ch/sem/en/home/sem/aktuell/ukraine-hilfe.html"
        />
        <ResourceCard
          title="Довідник для Українців у Швейцарії"
          description="Комплексний довідник з питань житла, роботи, освіти та інтеграції"
          link="https://kwitka.help/uk/faq-ua/"
        />
        <ResourceCard
          title="Категорія Статус захисту S"
          description="Детальна інформація про статус захисту S та процедури"
          link="https://kwitka.help/uk/category/status-zahystu-s/"
        />
      </ResourceSection>

      {/* Refugee Centers */}
      <ResourceSection
        title="Центри первинного розміщення біженців"
        icon={<Building className="h-6 w-6 text-indigo-700" />}
        description="Адреси та контактна інформація центрів прийому біженців"
      >
        <ResourceCard
          title="MZH Sand-Schönbühl (від 18 років або в супроводі)"
          description="Новий центр первинного розміщення біженців. Приймають цілодобово в будь-який день"
          link="https://maps.google.com/?q=Moosstrasse+28,+3322+Urtenen-Schönbühl,+Switzerland"
          address="Moosstrasse 28, 3322 Urtenen-Schönbühl"
        />
        <ResourceCard
          title="Morillonstrasse (неповнолітні без супроводу)"
          description="Центр для неповнолітніх біженців без супроводу"
          link="https://maps.google.com/?q=Morillonstrasse+75,+3007+Bern,+Switzerland"
          address="Morillonstrasse 75, 3007 Bern"
        />
      </ResourceSection>
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
  address,
}: {
  title: string;
  description: string;
  link: string;
  address?: string;
}) {
  const isExternal = !link.startsWith("/");

  const CardContent = () => (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200 flex flex-col cursor-pointer">
      <div className="p-5 flex flex-col h-full">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        {address && (
          <div className="mb-3">
            <p className="text-sm text-gray-500 font-medium">Адреса:</p>
            <p className="text-sm text-gray-700">{address}</p>
          </div>
        )}
        {!address && (
          <div className="flex items-center text-indigo-600 mt-auto text-sm font-medium"></div>
        )}
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
