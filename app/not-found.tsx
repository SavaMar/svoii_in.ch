import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const metadata = {
  title: "Сторінку не знайдено | Українська Спільнота Швейцарії",
  description: "Помилка 404 - сторінку не знайдено",
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900">
          Сторінку не знайдено
        </h2>
        <p className="text-lg text-gray-600">
          Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>

        <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-teal-400 mx-auto rounded-full"></div>

        <p className="text-gray-500">
          Повернутися на головну сторінку, щоб знайти потрібну інформацію.
        </p>

        <Link href="/">
          <Button className="mt-4 gap-2">
            <Home className="h-4 w-4" />
            На головну
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-gray-400 text-sm">
        <p>
          Якщо ви вважаєте, що це помилка сайту, будь ласка, повідомте нам за
          адресою{" "}
          <a
            href="mailto:support@svoi.ch"
            className="text-indigo-500 hover:underline"
          >
            support@svoi.ch
          </a>
        </p>
      </div>
    </div>
  );
}
