// Define driver type
export interface Driver {
  id: string;
  name: string;
  directions: string;
  phone: string;
  email: string;
  website: string;
  telegram?: string;
  whatsapp?: string;
  viber?: string;
  post: boolean;
  acceptKids: boolean;
  people: boolean;
  animals: boolean;
  invalids: boolean;
  business: boolean;
  noStops: boolean;
  type: "bus" | "van" | "car";
  places: number;
  description: string;
  frequency: string;
}

// Create mock data
export const drivers: Driver[] = [
  {
    id: "1",
    name: "УкрШвейцТранс",
    directions: "Цюріх - Київ - Львів",
    phone: "+41 12 345 67 89",
    email: "info@ukrswiss-trans.com",
    website: "https://ukrswiss-trans.com",
    telegram: "https://t.me/ukrswiss",
    whatsapp: "https://wa.me/41123456789",
    post: true,
    acceptKids: true,
    people: true,
    animals: false,
    invalids: true,
    business: true,
    noStops: false,
    type: "bus",
    places: 25,
    description:
      "Пасажирські перевезення та доставка посилок між Швейцарією та Україною щотижня. Комфортабельні автобуси, досвідчені водії.",
    frequency: "Щотижня, виїзд щоп'ятниці",
  },
  {
    id: "2",
    name: "Швидкі Перевезення",
    directions: "Женева - Одеса - Харків",
    phone: "+41 98 765 43 21",
    email: "contact@fast-transport.ch",
    website: "https://fast-transport.ch",
    viber: "viber://chat?number=+41987654321",
    post: true,
    acceptKids: false,
    people: false,
    animals: false,
    invalids: false,
    business: true,
    noStops: true,
    type: "van",
    places: 3,
    description:
      "Спеціалізуємося на швидкій доставці посилок та документів. Прямі рейси без зупинок.",
    frequency: "3 рази на тиждень",
  },
  {
    id: "3",
    name: "Карпати-Альпи Тур",
    directions: "Берн - Львів - Івано-Франківськ",
    phone: "+41 55 544 43 33",
    email: "info@carpathian-tours.ch",
    website: "https://carpathian-tours.ch",
    telegram: "https://t.me/carpathian_tours",
    whatsapp: "https://wa.me/41555444333",
    viber: "viber://chat?number=+41555444333",
    post: true,
    acceptKids: true,
    people: true,
    animals: true,
    invalids: true,
    business: false,
    noStops: false,
    type: "bus",
    places: 20,
    description:
      "Регулярні автобусні рейси західною Україною. Комфортні умови для дітей, інвалідів та тварин. Зупинки за запитом.",
    frequency: "Двічі на тиждень, вівторок і субота",
  },
  {
    id: "4",
    name: "ЄвроУкр Експрес",
    directions: "Цюріх - Франція - Бельгія - Україна",
    phone: "+41 78 901 23 45",
    email: "info@euroukr.express",
    website: "https://euroukr.express",
    whatsapp: "https://wa.me/41789012345",
    post: false,
    acceptKids: true,
    people: true,
    animals: false,
    invalids: false,
    business: false,
    noStops: false,
    type: "van",
    places: 8,
    description:
      "Комфортний мінівен для подорожей через всю Європу до України. Багато зупинок у різних містах.",
    frequency: "Щотижня, виїзд в понеділок",
  },
  {
    id: "5",
    name: "Люкс Транспорт",
    directions: "Базель - Мюнхен - Краків - Київ",
    phone: "+41 61 222 33 44",
    email: "booking@lux-transport.ch",
    website: "https://lux-transport.ch",
    telegram: "https://t.me/lux_transport",
    post: false,
    acceptKids: true,
    people: true,
    animals: false,
    invalids: true,
    business: false,
    noStops: true,
    type: "car",
    places: 4,
    description:
      "Люксові автомобілі для комфортної подорожі. Прямий рейс без зупинок, швидко та безпечно.",
    frequency: "За запитом, можливий індивідуальний графік",
  },
  {
    id: "6",
    name: "КарМаріо Логістика",
    directions: "Лозанна - Будапешт - Ужгород - Дніпро",
    phone: "+41 79 111 22 33",
    email: "info@carmario.ch",
    website: "https://carmario.ch",
    viber: "viber://chat?number=+41791112233",
    post: true,
    acceptKids: false,
    people: true,
    animals: true,
    invalids: false,
    business: true,
    noStops: false,
    type: "bus",
    places: 16,
    description:
      "Перевезення людей та посилок. Можливість взяти з собою домашніх тварин. Зручні зупинки на маршруті.",
    frequency: "Двічі на місяць",
  },
  {
    id: "7",
    name: "ПостСвісс",
    directions: "Цюріх - Варшава - Львів - Київ - Одеса",
    phone: "+41 44 555 66 77",
    email: "contact@postswiss.ch",
    website: "https://postswiss.ch",
    telegram: "https://t.me/postswiss",
    post: true,
    acceptKids: false,
    people: false,
    animals: false,
    invalids: false,
    business: true,
    noStops: true,
    type: "van",
    places: 0,
    description:
      "Спеціалізуємося виключно на доставці пошти та посилок. Швидка доставка, надійний сервіс, лише для бізнес-клієнтів.",
    frequency: "Щодня",
  },
  {
    id: "8",
    name: "Родина Транс",
    directions: "Берн - Прага - Краків - Тернопіль",
    phone: "+41 31 987 65 43",
    email: "info@rodyna-trans.ch",
    website: "https://rodyna-trans.ch",
    whatsapp: "https://wa.me/41319876543",
    viber: "viber://chat?number=+41319876543",
    post: true,
    acceptKids: true,
    people: true,
    animals: true,
    invalids: true,
    business: true,
    noStops: false,
    type: "bus",
    places: 22,
    description:
      "Сімейний бізнес, орієнтований на комфорт пасажирів. Перевозимо людей, тварин, посилки. Доступно для всіх, включаючи дітей та людей з інвалідністю.",
    frequency: "Щотижня, четвер і неділя",
  },
];
