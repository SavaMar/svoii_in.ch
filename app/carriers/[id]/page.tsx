import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ExternalLink,
  Mail,
  MessageCircle,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

// Import the mock data from the carriers page
import { drivers } from "../../carriers/mockData";

// Correct typing for Next.js dynamic route params
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate metadata for the page based on the carrier
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    return {
      title: "Перевізник не знайдений",
      description: "Детальна інформація про перевізника недоступна",
    };
  }

  return {
    title: `${driver.name} | Перевізники | SwissUA`,
    description: `${driver.description.substring(0, 160)}${
      driver.description.length > 160 ? "..." : ""
    }`,
  };
}

// Use the standard function declaration format for Next.js pages with correct type
export default async function CarrierDetailPage({ params }: Props) {
  const { id } = await params;

  // Find the driver with the matching id
  const driver = drivers.find((d) => d.id === id);

  // If no driver is found, show the not found page
  if (!driver) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/carriers">
          <Button
            variant="ghost"
            className="pl-0 flex items-center transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад до списку перевізників
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">{driver.name}</h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-5 w-5 text-blue-700 mr-2" />
                  <span className="text-lg">{driver.directions}</span>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`
                  ${
                    driver.type === "bus"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : driver.type === "van"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  } text-sm px-3 py-1 transition-all duration-300 hover:shadow
                `}
              >
                {driver.type === "bus"
                  ? "Автобус"
                  : driver.type === "van"
                  ? "Мінівен"
                  : "Автомобіль"}
                {driver.places > 0 && ` (${driver.places} місць)`}
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Опис</h2>
                <p className="text-gray-700">{driver.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Частота рейсів</h2>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-700 mr-2" />
                  <span className="text-gray-700">{driver.frequency}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Послуги</h2>
                <div className="flex flex-wrap gap-2">
                  {driver.post && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200 transition-all duration-300 hover:bg-blue-100 hover:shadow-sm"
                    >
                      Посилки
                    </Badge>
                  )}
                  {driver.people && (
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-700 border-green-200 transition-all duration-300 hover:bg-green-100 hover:shadow-sm"
                    >
                      Пасажири
                    </Badge>
                  )}
                  {driver.acceptKids && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-purple-700 border-purple-200 transition-all duration-300 hover:bg-purple-100 hover:shadow-sm"
                    >
                      Діти
                    </Badge>
                  )}
                  {driver.animals && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-50 text-orange-700 border-orange-200 transition-all duration-300 hover:bg-orange-100 hover:shadow-sm"
                    >
                      Тварини
                    </Badge>
                  )}
                  {driver.invalids && (
                    <Badge
                      variant="secondary"
                      className="bg-teal-50 text-teal-700 border-teal-200 transition-all duration-300 hover:bg-teal-100 hover:shadow-sm"
                    >
                      Люди з інвалідністю
                    </Badge>
                  )}
                  {driver.business && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-50 text-gray-700 border-gray-200 transition-all duration-300 hover:bg-gray-200 hover:shadow-sm"
                    >
                      Бізнес
                    </Badge>
                  )}
                  {driver.noStops && (
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 transition-all duration-300 hover:bg-indigo-100 hover:shadow-sm"
                    >
                      Без зупинок
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Info */}
        <div>
          <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-md">
            <h2 className="text-xl font-semibold mb-4">Контактна інформація</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Телефон</p>
                  <a
                    href={`tel:${driver.phone}`}
                    className="text-blue-700 hover:underline transition-all duration-300 hover:text-blue-900"
                  >
                    {driver.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${driver.email}`}
                    className="text-blue-700 hover:underline transition-all duration-300 hover:text-blue-900"
                  >
                    {driver.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <ExternalLink className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Вебсайт</p>
                  <a
                    href={driver.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline transition-all duration-300 hover:text-blue-900"
                  >
                    {driver.website.replace(/(https?:\/\/)?(www\.)?/, "")}
                  </a>
                </div>
              </div>

              {/* Social buttons */}
              <div className="pt-4">
                <p className="font-medium mb-3">Месенджери</p>
                <div className="flex flex-wrap gap-2">
                  {driver.telegram && (
                    <Button
                      size="sm"
                      asChild
                      className="gap-1 bg-blue-500 hover:bg-blue-600 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    >
                      <a
                        href={driver.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Telegram</span>
                      </a>
                    </Button>
                  )}
                  {driver.whatsapp && (
                    <Button
                      size="sm"
                      asChild
                      className="gap-1 bg-green-500 hover:bg-green-600 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    >
                      <a
                        href={driver.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </a>
                    </Button>
                  )}
                  {driver.viber && (
                    <Button
                      size="sm"
                      asChild
                      className="gap-1 bg-purple-500 hover:bg-purple-600 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    >
                      <a
                        href={driver.viber}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Viber</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
