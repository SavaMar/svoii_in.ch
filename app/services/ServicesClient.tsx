"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  PlusCircle,
  Heart,
  Briefcase,
  GraduationCap,
  Search,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<{
    category?: ServiceCategory | null;
    kanton?: string | null;
    zipCode?: string | null;
  }>({});

  // Initialize categories from mockData
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(mockServices.map((service) => service.category))
    ) as ServiceCategory[];
    setCategories(uniqueCategories);
  }, []);

  // Apply both filters and search
  useEffect(() => {
    let result = [...services];

    // Apply category filter
    if (activeFilters.category) {
      result = result.filter(
        (service) => service.category === activeFilters.category
      );
    }

    // Apply kanton filter
    if (activeFilters.kanton) {
      result = result.filter(
        (service) => service.kanton === activeFilters.kanton
      );
    }

    // Apply zipCode filter
    if (activeFilters.zipCode) {
      result = result.filter((service) =>
        service.zipCode.includes(activeFilters.zipCode!)
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          (service.description &&
            service.description.toLowerCase().includes(query))
      );
    }

    setFilteredServices(result);
  }, [services, activeFilters, searchQuery]);

  const handleFilterChange = (filters: {
    category?: ServiceCategory | null;
    kanton?: string | null;
    zipCode?: string | null;
  }) => {
    setActiveFilters(filters);
  };

  const handleServiceView = (id: string) => {
    // In a real app, this would be an API call to increment the view counter
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, views: service.views + 1 } : service
      )
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Information section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12 mt-16">
        <div className="flex items-center mb-6">
          <FileText className="h-8 w-8 text-blue-700 mr-4 flex-shrink-0" />
          <h2 className="text-2xl font-semibold">
            Хочете додати свої послуги?
          </h2>
        </div>
        <p className="text-gray-600 mb-6">
          Якщо ви надаєте послуги, то можете заповнити форму нижче і ми додамо
          вашу послугу до нашого каталогу. Так як проєкт тільки починає своє
          життя, то додавання послуги коштує 4 CHF на місяць. До червня це все
          через мене додається, а після червня будете мати свій профайл,
          можливіть створювати, оплачува через платформу, та мати вже свій
          вільний простір для того. Але хочется щоб все почало вже, бо нам це
          потрібно! Ваш вклад у перші кроки проєкту най безцінніший!
        </p>
        <div className="flex justify-center">
          <Link href="/services/add">
            <Button>Додати свої послуги</Button>
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">Послуги</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-10">
        Каталог сервісів та послуг від українців у Швейцарії
      </p>

      {/* Search bar */}
      <div className="relative w-full mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Пошук за назвою чи описом послуги..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

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
          <Button variant="outline" onClick={handleResetFilters}>
            Скинути фільтри
          </Button>
        </div>
      )}

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
    </div>
  );
}
