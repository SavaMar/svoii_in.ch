"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Search, Filter, Check, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { drivers, Driver } from "./mockData";

// Filter interface
interface DriverFilters {
  post: boolean | null;
  acceptKids: boolean | null;
  people: boolean | null;
  animals: boolean | null;
  invalids: boolean | null;
  business: boolean | null;
  noStops: boolean | null;
  type: "all" | "bus" | "van" | "car";
}

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);
  const [showFiltersInfo, setShowFiltersInfo] = useState(false);
  const [filters, setFilters] = useState<DriverFilters>({
    post: null,
    acceptKids: null,
    people: null,
    animals: null,
    invalids: null,
    business: null,
    noStops: null,
    type: "all",
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle boolean filters
  const toggleFilter = (key: keyof DriverFilters) => {
    // Only for boolean filters, not type
    if (key !== "type") {
      setFilters((prev) => ({
        ...prev,
        [key]: prev[key] === null ? true : prev[key] === true ? false : null,
      }));
    }
  };

  // Set vehicle type filter
  const setTypeFilter = (type: "all" | "bus" | "van" | "car") => {
    setFilters((prev) => ({
      ...prev,
      type,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      post: null,
      acceptKids: null,
      people: null,
      animals: null,
      invalids: null,
      business: null,
      noStops: null,
      type: "all",
    });
  };

  // Filter drivers based on search and filters
  useEffect(() => {
    let result = [...drivers];

    // Search filter
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (driver) =>
          driver.name.toLowerCase().includes(term) ||
          driver.directions.toLowerCase().includes(term) ||
          driver.description.toLowerCase().includes(term)
      );
    }

    // Apply boolean filters
    if (filters.post !== null) {
      result = result.filter((driver) => driver.post === filters.post);
    }
    if (filters.acceptKids !== null) {
      result = result.filter(
        (driver) => driver.acceptKids === filters.acceptKids
      );
    }
    if (filters.people !== null) {
      result = result.filter((driver) => driver.people === filters.people);
    }
    if (filters.animals !== null) {
      result = result.filter((driver) => driver.animals === filters.animals);
    }
    if (filters.invalids !== null) {
      result = result.filter((driver) => driver.invalids === filters.invalids);
    }
    if (filters.business !== null) {
      result = result.filter((driver) => driver.business === filters.business);
    }
    if (filters.noStops !== null) {
      result = result.filter((driver) => driver.noStops === filters.noStops);
    }

    // Apply type filter
    if (filters.type !== "all") {
      result = result.filter((driver) => driver.type === filters.type);
    }

    setFilteredDrivers(result);
  }, [searchQuery, filters]);

  // Helper function to get filter badge color
  const getFilterBadgeColor = (value: boolean | null | string) => {
    if (value === null) return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    if (value === true) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (value === false) return "bg-red-100 text-red-800 hover:bg-red-200";
    // Handle string case (though this should never happen with our filter logic)
    return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  // Helper function to get filter badge text
  const getFilterText = (key: keyof DriverFilters) => {
    const labels: Record<string, string> = {
      post: "Посилки",
      acceptKids: "Діти",
      people: "Пасажири",
      animals: "Тварини",
      invalids: "Люди з інвалідністю",
      business: "Бізнес",
      noStops: "Без зупинок",
    };

    return labels[key] || key;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">Перевізники</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
        Перевірені та рекомендовані перевізники, які допомагають українцям з
        перевезенням між Україною, Швейцарією та Європою.
      </p>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowFiltersInfo(!showFiltersInfo)}
        >
          <h3 className="text-lg font-semibold">Пояснення фільтрів:</h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              showFiltersInfo ? "rotate-180" : ""
            }`}
          />
        </div>

        {showFiltersInfo && (
          <ul className="space-y-2 text-gray-700 mt-4">
            <li>
              <strong>Посилки</strong> - перевізник займається доставкою посилок
              та вантажів
            </li>
            <li>
              <strong>Діти</strong> - перевізник приймає дітей для перевезення
            </li>
            <li>
              <strong>Пасажири</strong> - перевізник здійснює пасажирські
              перевезення
            </li>
            <li>
              <strong>Тварини</strong> - можливість перевезення домашніх тварин
            </li>
            <li>
              <strong>Люди з інвалідністю</strong> - наявність умов для
              перевезення людей з інвалідністю
            </li>
            <li>
              <strong>Бізнес</strong> - відкриті до співпраці з бізнесом для
              регулярного перевезення товарів/сировини
            </li>
            <li>
              <strong>Без зупинок</strong> - прямий рейс без проміжних зупинок
              або мінімум зупинок
            </li>
          </ul>
        )}
      </div>

      {/* Filters section */}
      <Card className="mb-8 p-5">
        <div className="flex flex-col space-y-4">
          {/* Search bar */}
          <div>
            <h3 className="text-lg font-medium mb-2">Пошук</h3>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Назва, напрямок, опис..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>

          {/* Filter options */}
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Фільтри
            </h3>

            {/* Boolean filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(Object.keys(filters) as Array<keyof DriverFilters>)
                .filter((key) => key !== "type")
                .map((key) => {
                  // This ensures we're only working with boolean filter values
                  const filterKey = key as Exclude<keyof DriverFilters, "type">;
                  const filterValue = filters[filterKey] as boolean | null;

                  return (
                    <Badge
                      key={filterKey}
                      variant="secondary"
                      className={`cursor-pointer flex items-center gap-1 ${getFilterBadgeColor(
                        filterValue
                      )}`}
                      onClick={() => toggleFilter(filterKey)}
                    >
                      {getFilterText(filterKey)}
                      {filterValue !== null &&
                        (filterValue ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        ))}
                    </Badge>
                  );
                })}
            </div>

            {/* Transport type filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Тип транспорту</h4>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className={`cursor-pointer ${
                    filters.type === "all"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTypeFilter("all")}
                >
                  Всі
                </Badge>
                <Badge
                  variant="secondary"
                  className={`cursor-pointer ${
                    filters.type === "bus"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTypeFilter("bus")}
                >
                  Автобус
                </Badge>
                <Badge
                  variant="secondary"
                  className={`cursor-pointer ${
                    filters.type === "van"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTypeFilter("van")}
                >
                  Мінівен
                </Badge>
                <Badge
                  variant="secondary"
                  className={`cursor-pointer ${
                    filters.type === "car"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100"
                  }`}
                  onClick={() => setTypeFilter("car")}
                >
                  Автомобіль
                </Badge>
              </div>
            </div>

            {/* Reset button */}
            {(searchQuery.trim() ||
              Object.values(filters).some(
                (v) => v !== null && v !== "all"
              )) && (
              <Button variant="outline" onClick={resetFilters} className="mt-2">
                Скинути всі фільтри
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Drivers list */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Результати</h2>
        <p className="text-muted-foreground">
          {filteredDrivers.length}{" "}
          {filteredDrivers.length === 1 ? "перевізник" : "перевізників"}
        </p>
      </div>

      <p className="text-red-600 max-w-3xl mx-auto text-center mb-12">
        Всі перевізникі не справжніми і використовуються для тестування наразі.
      </p>

      {filteredDrivers.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <p className="text-xl text-muted-foreground mb-2">
            Не знайдено перевізників за вашим запитом
          </p>
          <Button variant="outline" onClick={resetFilters} className="mt-2">
            Скинути всі фільтри
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrivers.map((driver) => (
            <Card
              key={driver.id}
              className="overflow-hidden h-full transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:border-primary/30"
            >
              <Link href={`/carriers/${driver.id}`} className="block h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{driver.name}</h3>
                    <Badge
                      variant="outline"
                      className={`
                      ${
                        driver.type === "bus"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : driver.type === "van"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
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

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-700 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{driver.directions}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 flex-grow">
                    {driver.description}
                  </p>

                  {/* Frequency */}
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-gray-50">
                      {driver.frequency}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {driver.post && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Посилки
                      </Badge>
                    )}
                    {driver.people && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Пасажири
                      </Badge>
                    )}
                    {driver.acceptKids && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        Діти
                      </Badge>
                    )}
                    {driver.animals && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        Тварини
                      </Badge>
                    )}
                    {driver.invalids && (
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 text-teal-700 border-teal-200"
                      >
                        Люди з інвалідністю
                      </Badge>
                    )}
                    {driver.business && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-50 text-gray-700 border-gray-200"
                      >
                        Бізнес
                      </Badge>
                    )}
                    {driver.noStops && (
                      <Badge
                        variant="secondary"
                        className="bg-indigo-50 text-indigo-700 border-indigo-200"
                      >
                        Без зупинок
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Add your own carrier section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Хочете додати свою компанію?
        </h2>
        <p className="text-gray-600 mx-auto text-center mb-8">
          Якщо ви надаєте транспортні послуги між Україною та Швейцарією і
          хочете бути у нашому списку перевізників, зв&apos;яжіться з нами.
          Додавання до списку коштує 8 CHF (Swiss Francs) на місяць і до червня
          це все через мене додається, а після червня будете мати свій профайл,
          можливіть створювати, оплачува через платформу, та мати вже свій
          вільний простір для того. Але хочется щоб все почало вже, бо нам це
          потрібно! Ваш вклад у перші кроки проєкту най безцінніший!
        </p>
        <div className="text-center">
          <Link href="/contact">
            <Button>Зв&apos;язатися з нами</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
