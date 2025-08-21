"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MessageCircle,
  Calendar,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for search requests (last 2 weeks - July 16-30, 2025)
const searchRequests = [
  {
    id: 1,
    title: "Шукаю перевізника із Одесси до Женеви",
    description:
      "Потрібен перевізник для перевезення речей з Одеси до Женеви. Дата: 5-10 серпня. Зв'яжіться для обговорення деталей.",
    date: "2025-07-30",
    canton: "geneva",
    topics: ["перевізник", "поїздка"],
    author: "Анна К.",
    responses: 3,
  },
  {
    id: 2,
    title: "Шукаю кондитера у якого можна замовити торт на свято",
    description:
      "Потрібен смачний торт на день народження дитини. Дата: 15 серпня. Можу забрати сам або потрібна доставка.",
    date: "2025-07-29",
    canton: "zurich",
    topics: ["кондитер", "торт", "свято"],
    author: "Марія Л.",
    responses: 5,
  },
  {
    id: 3,
    title: "Шукаю ремонт авто у кантоні Vaud",
    description:
      "Потрібен надійний механік для ремонту автомобіля. Проблема з двигуном. Можу приїхати або потрібен виїзд.",
    date: "2025-07-28",
    canton: "vaud",
    topics: ["ремонт", "авто", "механік"],
    author: "Олександр П.",
    responses: 2,
  },
  {
    id: 4,
    title: "Мені потрібно перевезти мене із однієї квартири на іншу по Цюриху",
    description:
      "Переїзд в межах Цюриха. Потрібна допомога з перевезенням меблів. Дата: 8 серпня.",
    date: "2025-07-27",
    canton: "zurich",
    topics: ["переїзд", "допомога", "перевізник"],
    author: "Ірина М.",
    responses: 7,
  },
  {
    id: 5,
    title: "Шукаю хто готує вареники у кантоні Цуг",
    description:
      "Хочу замовити домашні вареники. Можу забрати сам або потрібна доставка. Кількість: 50-100 штук.",
    date: "2025-07-26",
    canton: "zug",
    topics: ["вареники", "домашня їжа", "замовлення"],
    author: "Віктор С.",
    responses: 4,
  },
  {
    id: 6,
    title: "Чи є нарощування вій у місті Аргау",
    description:
      "Шукаю майстра з нарощування вій. Важлива якість та досвід. Можу приїхати або потрібен виїзд додому.",
    date: "2025-07-25",
    canton: "aargau",
    topics: ["нарощування", "вії", "б'юті"],
    author: "Катерина Д.",
    responses: 6,
  },
  {
    id: 7,
    title: "Потрібен репетитор з математики для дитини",
    description:
      "Шукаю репетитора з математики для дитини 12 років. Заняття можуть бути онлайн або офлайн у Берні.",
    date: "2025-07-24",
    canton: "bern",
    topics: ["репетитор", "освіта", "математика"],
    author: "Наталія Р.",
    responses: 3,
  },
  {
    id: 8,
    title: "Шукаю майстра для ремонту квартири",
    description:
      "Потрібен майстер для косметичного ремонту квартири в Базелі. Площа 60 кв.м. Можна обговорити терміни.",
    date: "2025-07-23",
    canton: "basel",
    topics: ["ремонт", "майстер", "квартира"],
    author: "Дмитро В.",
    responses: 8,
  },
  {
    id: 9,
    title: "Потрібна няня для дитини 3 років",
    description:
      "Шукаю няню для дитини 3 років. Графік: 3-4 рази на тиждень по 4 години. Район Люцерн.",
    date: "2025-07-22",
    canton: "lucerne",
    topics: ["няня", "догляд", "дитина"],
    author: "Олена К.",
    responses: 5,
  },
  {
    id: 10,
    title: "Шукаю попутника до Києва",
    description:
      "Планую поїздку до Києва 10-15 серпня. Шукаю попутника для розділення витрат на бензин.",
    date: "2025-07-21",
    canton: "geneva",
    topics: ["попутник", "поїздка", "київ"],
    author: "Андрій М.",
    responses: 2,
  },
  {
    id: 11,
    title: "Потрібен фотограф для весілля",
    description:
      "Шукаю професійного фотографа для весілля 20 серпня. Район Цюрих. Важлива якість та досвід.",
    date: "2025-07-20",
    canton: "zurich",
    topics: ["фотограф", "весілля", "події"],
    author: "Світлана П.",
    responses: 4,
  },
  {
    id: 12,
    title: "Шукаю репетитора з німецької мови",
    description:
      "Потрібен репетитор з німецької мови для дорослого. Рівень A2-B1. Заняття в Женеві.",
    date: "2025-07-19",
    canton: "geneva",
    topics: ["репетитор", "освіта", "німецька"],
    author: "Максим К.",
    responses: 3,
  },
  {
    id: 13,
    title: "Потрібен догляд за садом",
    description:
      "Шукаю людину для догляду за садом. Робота 2-3 рази на тиждень. Район Во.",
    date: "2025-07-18",
    canton: "vaud",
    topics: ["догляд", "сад", "робота"],
    author: "Петро М.",
    responses: 1,
  },
  {
    id: 14,
    title: "Шукаю майстра для ремонту комп'ютера",
    description:
      "Потрібен майстер для ремонту ноутбука. Проблема з екраном. Можу приїхати або потрібен виїзд.",
    date: "2025-07-17",
    canton: "bern",
    topics: ["ремонт", "комп'ютер", "техніка"],
    author: "Олексій В.",
    responses: 5,
  },
  {
    id: 15,
    title: "Потрібна допомога з перекладом документів",
    description:
      "Шукаю перекладача з української на німецьку. Документи для подачі на статус S.",
    date: "2025-07-16",
    canton: "zurich",
    topics: ["переклад", "документи", "статус"],
    author: "Інна Л.",
    responses: 6,
  },
];

const cantons = [
  { code: "all", name: "Всі кантони" },
  { code: "zurich", name: "Цюрих" },
  { code: "bern", name: "Берн" },
  { code: "geneva", name: "Женева" },
  { code: "vaud", name: "Во" },
  { code: "basel", name: "Базель" },
  { code: "lucerne", name: "Люцерн" },
  { code: "zug", name: "Цуг" },
  { code: "aargau", name: "Аргау" },
];

const topics = [
  { code: "all", name: "Всі теми" },
  { code: "перевізник", name: "Перевізник" },
  { code: "поїздка", name: "Поїздка" },
  { code: "допомога", name: "Допомога" },
  { code: "попутка", name: "Попутка" },
  { code: "майстер", name: "Майстер" },
  { code: "ремонт", name: "Ремонт" },
  { code: "кондитер", name: "Кондитер" },
  { code: "вареники", name: "Вареники" },
  { code: "нарощування", name: "Нарощування" },
  { code: "репетитор", name: "Репетитор" },
  { code: "няня", name: "Няня" },
  { code: "фотограф", name: "Фотограф" },
  { code: "весілля", name: "Весілля" },
  { code: "події", name: "Події" },
  { code: "німецька", name: "Німецька" },
  { code: "сад", name: "Сад" },
  { code: "робота", name: "Робота" },
  { code: "комп'ютер", name: "Комп'ютер" },
  { code: "техніка", name: "Техніка" },
  { code: "переклад", name: "Переклад" },
  { code: "документи", name: "Документи" },
  { code: "статус", name: "Статус" },
];

export default function SearchPage() {
  const [selectedCanton, setSelectedCanton] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [showCommunityDialog, setShowCommunityDialog] = useState(false);

  const handleRespondClick = () => {
    setShowCommunityDialog(true);
  };

  const filteredRequests = searchRequests.filter((request) => {
    const cantonMatch =
      selectedCanton === "all" || request.canton === selectedCanton;
    const topicMatch =
      selectedTopic === "all" || request.topics.includes(selectedTopic);
    return cantonMatch && topicMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCantonName = (code: string) => {
    const canton = cantons.find((c) => c.code === code);
    return canton ? canton.name : code;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-base sm:text-lg mb-1">
                  Увага
                </h3>
                <p className="text-red-700 text-sm sm:text-base leading-relaxed">
                  Дані, які представлені на цій сторінці, є тимчасовим прикладом
                  того, як працюватиме функція пошуку. Реальні запити від
                  користувачів з&apos;являться найближчим часом.
                </p>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Пошук
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-4">
              Знайдіть те, що шукаєте, або допоможіть іншим. Тут зібрані запити
              від членів спільноти.
            </p>
          </div>

          {/* Add new request button */}
          <div className="mb-8 sm:mb-10 text-center px-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Додати запит
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Фільтри
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Кантон
                </label>
                <select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  {cantons.map((canton) => (
                    <option key={canton.code} value={canton.code}>
                      {canton.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Тема
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  {topics.map((topic) => (
                    <option key={topic.code} value={topic.code}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Нічого не знайдено
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Спробуйте змінити фільтри або перевірте пізніше.
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl bg-white"
                >
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
                        {request.title}
                      </h3>
                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {request.description}
                      </p>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {request.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          #{topic}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta information */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-4">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {formatDate(request.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {getCantonName(request.canton)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">
                            {request.responses} відповідей
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="text-sm text-gray-500 font-medium">
                          {request.author}
                        </div>
                        <Button
                          size="sm"
                          onClick={handleRespondClick}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                        >
                          Відповісти
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
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
              Відповідати на запити можуть тільки користувачі, які є частиною
              спільноти. Це допомагає підтримувати якість та надійність
              відповідей.
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
    </div>
  );
}
