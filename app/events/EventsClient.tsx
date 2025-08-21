"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Ticket,
  Bookmark,
  Users,
  MessageCircle,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/context/AuthContext";
import { mockEvents, EVENT_CATEGORIES, CANTONS } from "./mockData";

export default function EventsClient() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    canton: "all",
    zipCode: "",
    category: "all",
  });

  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [showCommunityDialog, setShowCommunityDialog] = useState(false);
  const [showDevelopmentDialog, setShowDevelopmentDialog] = useState(false);

  // Filter events based on selected filters
  useEffect(() => {
    let result = [...mockEvents];

    // Filter by canton
    if (filters.canton !== "all") {
      result = result.filter((event) => event.canton === filters.canton);
    }

    // Filter by zip code (if provided)
    if (filters.zipCode.trim()) {
      result = result.filter((event) =>
        event.zipCode.toLowerCase().includes(filters.zipCode.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((event) =>
        event.categories.includes(filters.category)
      );
    }

    setFilteredEvents(result);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      canton: "all",
      zipCode: "",
      category: "all",
    });
  };

  // Handle button clicks
  const handleSaveEvent = () => {
    if (!user) {
      setShowCommunityDialog(true);
    } else {
      setShowDevelopmentDialog(true);
    }
  };

  const handleAttendEvent = () => {
    if (!user) {
      setShowCommunityDialog(true);
    } else {
      setShowDevelopmentDialog(true);
    }
  };

  const handleJoinChat = () => {
    if (!user) {
      setShowCommunityDialog(true);
    } else {
      setShowDevelopmentDialog(true);
    }
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate, startTime, endTime) => {
    const start = new Date(startDate);
    const formattedStart = start.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });

    // If it's a single-day event
    if (!endDate || startDate === endDate) {
      return `${formattedStart}, ${startTime}${endTime ? ` - ${endTime}` : ""}`;
    }

    // If it's a multi-day event
    const end = new Date(endDate);
    const formattedEnd = end.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });

    return `${formattedStart} - ${formattedEnd}`;
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Події в Швейцарії</h1>
      <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
        Культурні, освітні та розважальні заходи для українців у Швейцарії.
        Знайдіть цікаві події у вашому місті та регіоні.
      </p>

      <p className="text-red-600 max-w-3xl mx-auto text-center mb-8">
        Всі ці події не справжніми і використовуються для тестування наразі.
      </p>

      {/* Filters section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="canton" className="block text-sm font-medium mb-2">
              Кантон
            </label>
            <select
              id="canton"
              value={filters.canton}
              onChange={(e) => handleFilterChange("canton", e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Всі кантони</option>
              {CANTONS.map((canton) => (
                <option key={canton.code} value={canton.code}>
                  {canton.name} ({canton.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
              Поштовий індекс
            </label>
            <Input
              id="zipCode"
              type="text"
              placeholder="Наприклад, 8000"
              value={filters.zipCode}
              onChange={(e) => handleFilterChange("zipCode", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Категорія
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Всі категорії</option>
              {Object.entries(EVENT_CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            onClick={resetFilters}
            className="md:self-end"
          >
            Скинути фільтри
          </Button>
        </div>
      </div>

      {/* Events list */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Знайдено подій: {filteredEvents.length}
        </h2>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500 mb-2">
              Не знайдено подій за вашим запитом
            </p>
            <p className="text-gray-400 mb-4">
              Спробуйте змінити параметри фільтрації
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Скинути фільтри
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="h-full overflow-hidden transition-all duration-300 hover:shadow-md group flex flex-col relative"
              >
                {/* Clickable overlay for the entire card */}
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`Відкрити деталі події: ${event.name}`}
                />

                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  {!event.isFree && (
                    <Badge className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800">
                      <Ticket className="h-3 w-3 mr-1" />
                      {event.price}
                    </Badge>
                  )}
                  {event.isFree && (
                    <Badge className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm text-white">
                      Безкоштовно
                    </Badge>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className={`text-xs ${EVENT_CATEGORIES[category].color}`}
                      >
                        {EVENT_CATEGORIES[category].label}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{event.name}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-indigo-700 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {formatDateRange(
                          event.startDate,
                          event.endDate,
                          event.startTime,
                          event.endTime
                        )}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-indigo-700 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {event.address}, {event.city}, {event.zipCode},{" "}
                        {event.canton}
                      </span>
                    </div>

                    {/* Organizer information for some events */}
                    {event.organizer && (
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-indigo-700 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          Організатор:{" "}
                          <a
                            href={event.organizer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {event.organizer.name}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  {/* Event Action Buttons - Always at bottom */}
                  <div className="space-y-2 mt-auto relative z-20">
                    {/* Зберігти button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEvent}
                      className="w-full flex items-center justify-center gap-1.5 text-xs border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      Зберігти
                      <span className="text-gray-500">(12)</span>
                    </Button>

                    {/* Я хочу йти button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAttendEvent}
                      className="w-full flex items-center justify-center gap-1.5 text-xs border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      <Heart className="h-3.5 w-3.5" />Я хочу йти
                      <span className="text-gray-500">(8)</span>
                    </Button>

                    {/* Долучитися до чату button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJoinChat}
                      className="w-full flex items-center justify-center gap-1.5 text-xs border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Долучитися до чату
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add event CTA */}
      <div className="mt-16 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Організовуєте захід?</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Якщо ви організовуєте захід для української спільноти в Швейцарії, ми
          будемо раді допомогти з його поширенням. Зв&apos;яжіться з нами, щоб
          додати інформацію про ваш захід на наш сайт.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-all duration-300"
        >
          Додати захід
        </Link>
      </div>

      {/* Community Dialog */}
      <Dialog open={showCommunityDialog} onOpenChange={setShowCommunityDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Частина спільноти
              </DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed">
              Ця функція доступна тільки для членів спільноти. Приєднайтеся до
              нас, щоб отримати повний доступ до всіх можливостей.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={() => setShowCommunityDialog(false)}
              variant="outline"
              className="flex-1"
            >
              Закрити
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Приєднатися до спільноти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Development Dialog */}
      <Dialog
        open={showDevelopmentDialog}
        onOpenChange={setShowDevelopmentDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                В розробці
              </DialogTitle>
            </div>
            <DialogDescription className="text-base leading-relaxed">
              Ця функція знаходиться в розробці і буде доступна найближчим
              часом. Дякуємо за ваше терпіння!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setShowDevelopmentDialog(false)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Зрозуміло
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
