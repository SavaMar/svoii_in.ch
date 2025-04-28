// Define event categories and their colors
export const EVENT_CATEGORIES = {
  фестиваль: {
    label: "Фестиваль",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  воркшоп: {
    label: "Воркшоп",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  лекція: {
    label: "Лекція",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  мовні: {
    label: "Мовні",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  інтеграційні: {
    label: "Інтеграційні",
    color: "bg-teal-100 text-teal-800 border-teal-200",
  },
  концерт: {
    label: "Концерт",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  нетворкінг: {
    label: "Нетворкінг",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  творчі: {
    label: "Творчі",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  локальні: {
    label: "Локальні",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  "для дітей": {
    label: "Для дітей",
    color: "bg-sky-100 text-sky-800 border-sky-200",
  },
  дозвілля: {
    label: "Дозвілля",
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

// Create a list of Swiss cantons
export const CANTONS = [
  { code: "ZH", name: "Цюрих" },
  { code: "BE", name: "Берн" },
  { code: "LU", name: "Люцерн" },
  { code: "UR", name: "Урі" },
  { code: "SZ", name: "Швіц" },
  { code: "OW", name: "Обвальден" },
  { code: "NW", name: "Нідвальден" },
  { code: "GL", name: "Гларус" },
  { code: "ZG", name: "Цуг" },
  { code: "FR", name: "Фрібур" },
  { code: "SO", name: "Золотурн" },
  { code: "BS", name: "Базель-Штадт" },
  { code: "BL", name: "Базель-Ланд" },
  { code: "SH", name: "Шаффгаузен" },
  { code: "AR", name: "Аппенцелль-Ауссерроден" },
  { code: "AI", name: "Аппенцелль-Іннерроден" },
  { code: "SG", name: "Санкт-Галлен" },
  { code: "GR", name: "Граубюнден" },
  { code: "AG", name: "Ааргау" },
  { code: "TG", name: "Тургау" },
  { code: "TI", name: "Тічіно" },
  { code: "VD", name: "Во" },
  { code: "VS", name: "Вале" },
  { code: "NE", name: "Невшатель" },
  { code: "GE", name: "Женева" },
  { code: "JU", name: "Юра" },
];

// Event type definition
export interface Event {
  id: string;
  name: string;
  description: string;
  categories: string[];
  address: string;
  canton: string;
  city: string;
  zipCode: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  imageUrl: string;
  website: string;
  isFree: boolean;
  price?: string | null;
}

// Mock events data
export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Український фестиваль культури",
    description:
      "Триденний фестиваль української культури з традиційною їжею, музикою та майстер-класами.",
    categories: ["фестиваль", "локальні"],
    address: "Helvetiaplatz",
    canton: "ZH",
    city: "Zürich",
    zipCode: "8004",
    startDate: "2023-08-18",
    startTime: "10:00",
    endDate: "2023-08-20",
    endTime: "22:00",
    imageUrl:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://ukrainian-festival.ch",
    isFree: false,
    price: "15 CHF",
  },
  {
    id: "2",
    name: "Майстер-клас з писанкарства",
    description:
      "Навчіться мистецтву розпису українських писанок під керівництвом досвідчених майстрів.",
    categories: ["воркшоп", "творчі"],
    address: "Kulturzentrum Progr",
    canton: "BE",
    city: "Bern",
    zipCode: "3011",
    startDate: "2023-09-05",
    startTime: "14:00",
    endDate: "2023-09-05",
    endTime: "17:00",
    imageUrl:
      "https://images.unsplash.com/photo-1649976238832-29e0453e076e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    website: "https://pysanka-workshop.ch",
    isFree: false,
    price: "45 CHF",
  },
  {
    id: "3",
    name: "Лекція: Інтеграція в швейцарське суспільство",
    description:
      "Корисна інформація для новоприбулих українців про життя, роботу та навчання у Швейцарії.",
    categories: ["лекція", "інтеграційні"],
    address: "Volkshochschule Zürich",
    canton: "ZH",
    city: "Zürich",
    zipCode: "8001",
    startDate: "2023-09-10",
    startTime: "18:30",
    endDate: "2023-09-10",
    endTime: "20:30",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://vhszh.ch",
    isFree: true,
    price: null,
  },
  {
    id: "4",
    name: "Розмовний клуб німецької мови",
    description:
      "Щотижневі зустрічі для практики німецької мови в неформальній обстановці. Для рівнів A2-B1.",
    categories: ["мовні", "нетворкінг"],
    address: "Café des Amis",
    canton: "GE",
    city: "Geneva",
    zipCode: "1204",
    startDate: "2023-09-15",
    startTime: "18:00",
    endDate: "2023-09-15",
    endTime: "20:00",
    imageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://german-club.ch",
    isFree: true,
    price: null,
  },
  {
    id: "5",
    name: "Концерт української класичної музики",
    description:
      "Вечір класичної музики у виконанні українських музикантів, які проживають у Швейцарії.",
    categories: ["концерт", "локальні"],
    address: "Stadtcasino Basel",
    canton: "BS",
    city: "Basel",
    zipCode: "4051",
    startDate: "2023-09-20",
    startTime: "19:30",
    endDate: "2023-09-20",
    endTime: "22:00",
    imageUrl:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://ukrainian-music.ch",
    isFree: false,
    price: "35-75 CHF",
  },
  {
    id: "6",
    name: "Бізнес-нетворкінг для українських підприємців",
    description:
      "Можливість налагодити контакти з місцевими бізнесменами та обговорити потенційні співпраці.",
    categories: ["нетворкінг", "інтеграційні"],
    address: "Impact Hub Zürich",
    canton: "ZH",
    city: "Zürich",
    zipCode: "8005",
    startDate: "2023-09-25",
    startTime: "17:00",
    endDate: "2023-09-25",
    endTime: "21:00",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://business-networking.ch",
    isFree: false,
    price: "25 CHF",
  },
  {
    id: "7",
    name: "Майстер-клас з української вишивки",
    description:
      "Навчіться основам традиційної української вишивки та створіть свій власний виріб.",
    categories: ["воркшоп", "творчі"],
    address: "Kreativzentrum",
    canton: "LU",
    city: "Lucerne",
    zipCode: "6003",
    startDate: "2023-10-01",
    startTime: "13:00",
    endDate: "2023-10-01",
    endTime: "17:00",
    imageUrl:
      "https://images.unsplash.com/photo-1605289355680-75fb41239154?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://embroidery-workshop.ch",
    isFree: false,
    price: "50 CHF",
  },
  {
    id: "8",
    name: "Дитячий день: українські казки та ігри",
    description:
      "Розважальний день для дітей з українськими казками, іграми та творчими заняттями.",
    categories: ["для дітей", "дозвілля"],
    address: "FamilienZentrum",
    canton: "SG",
    city: "St. Gallen",
    zipCode: "9000",
    startDate: "2023-10-07",
    startTime: "10:00",
    endDate: "2023-10-07",
    endTime: "16:00",
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://kids-day.ch",
    isFree: false,
    price: "15 CHF за дитину",
  },
  {
    id: "9",
    name: "Туристична прогулянка Альпами",
    description:
      "Одноденна прогулянка мальовничими Альпами з українськомовним гідом.",
    categories: ["дозвілля", "локальні"],
    address: "Zentralplatz",
    canton: "BE",
    city: "Interlaken",
    zipCode: "3800",
    startDate: "2023-10-15",
    startTime: "09:00",
    endDate: "2023-10-15",
    endTime: "18:00",
    imageUrl:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    website: "https://alps-tour.ch",
    isFree: false,
    price: "60 CHF",
  },
];
