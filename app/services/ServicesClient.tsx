"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  PlusCircle,
  Heart,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/app/components/ServiceCard";
import { ServiceFilters } from "@/app/components/ServiceFilters";
import { ServiceCategory, ServiceProvider } from "./types";
import { mockServices, SWISS_KANTONS } from "./mockData";

export default function ServicesClient() {
  const [services, setServices] = useState<ServiceProvider[]>(mockServices);
  const [filteredServices, setFilteredServices] =
    useState<ServiceProvider[]>(mockServices);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // Initialize categories from mockData
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(mockServices.map((service) => service.category))
    ) as ServiceCategory[];
    setCategories(uniqueCategories);
  }, []);

  const handleFilterChange = (filters: {
    category?: ServiceCategory | null;
    kanton?: string | null;
    zipCode?: string | null;
  }) => {
    let filtered = [...services];

    if (filters.category) {
      filtered = filtered.filter(
        (service) => service.category === filters.category
      );
    }

    if (filters.kanton) {
      filtered = filtered.filter(
        (service) => service.kanton === filters.kanton
      );
    }

    if (filters.zipCode) {
      filtered = filtered.filter((service) =>
        service.zipCode.includes(filters.zipCode!)
      );
    }

    setFilteredServices(filtered);
  };

  const handleServiceView = (id: string) => {
    // In a real app, this would be an API call to increment the view counter
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, views: service.views + 1 } : service
      )
    );
    setFilteredServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, views: service.views + 1 } : service
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Послуги</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-10">
        Каталог сервісів та послуг від українців у Швейцарії
      </p>

      {/* Service filters */}
      <ServiceFilters
        categories={categories}
        kantons={SWISS_KANTONS}
        onFilterChange={handleFilterChange}
      />

      {/* Display services */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Знайдено послуг: {filteredServices.length}
          </h2>
          <Link href="/services/add">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Додати послугу
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onView={handleServiceView}
            />
          ))}
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 mb-4">
            На жаль, послуг за вашим запитом не знайдено.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFilteredServices(services);
            }}
          >
            Скинути фільтри
          </Button>
        </div>
      )}

      {/* Information section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12 mt-16">
        <div className="flex items-center mb-6">
          <FileText className="h-8 w-8 text-blue-700 mr-4 flex-shrink-0" />
          <h2 className="text-2xl font-semibold">
            Хочете додати свої послуги?
          </h2>
        </div>
        <p className="text-gray-600 mb-6">
          Якщо ви надаєте послуги, які можуть бути корисними для української
          громади у Швейцарії, і хочете бути у нашому каталозі, додайте свою
          послугу до нашої бази даних. Це абсолютно безкоштовно.
        </p>
        <div className="flex justify-center">
          <Link href="/services/add">
            <Button>Додати свої послуги</Button>
          </Link>
        </div>
      </div>

      {/* Service Categories */}
      <h2 className="text-2xl font-bold mb-6 mt-12 text-center">
        Популярні категорії послуг
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-blue-700 mr-4" />
            <h3 className="text-xl font-semibold">Здоров&apos;я і краса</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Послуги краси, здоров&apos;я, масаж, перукарські послуги та інші.
          </p>
          <Link href="?category=Послуги краси">
            <Button variant="outline" className="w-full">
              Переглянути
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Briefcase className="h-8 w-8 text-blue-700 mr-4" />
            <h3 className="text-xl font-semibold">Ремонт і будівництво</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Всі види будівельних та ремонтних робіт для вашого дому чи офісу.
          </p>
          <Link href="?category=Будівельні роботи">
            <Button variant="outline" className="w-full">
              Переглянути
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 text-blue-700 mr-4" />
            <h3 className="text-xl font-semibold">Освіта і репетиторство</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Репетитори, курси, тренінги та освітні послуги.
          </p>
          <Link href="?category=Репетитори">
            <Button variant="outline" className="w-full">
              Переглянути
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-primary">
          Don&apos;t see what you&apos;re looking for?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Can&apos;t find the service you need? Add your own service request and
          let providers come to you.
        </p>
      </div>
    </div>
  );
}
