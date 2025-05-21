"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Calendar,
  Users,
  Truck,
  Briefcase,
  BookOpen,
  Mail,
  Info,
  LogIn,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/app/context/AuthContext";
import { AuthForms } from "./auth/AuthForms";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DefaultAvatar } from "./ui/default-avatar";

// Define the menu item type
type MenuItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  mobileOnly?: boolean;
};

// Define menu items once to avoid duplication
const menuItems: MenuItem[] = [
  { href: "/events", icon: Calendar, label: "Події" },
  { href: "/community", icon: Users, label: "Спільнота" },
  { href: "/carriers", icon: Truck, label: "Перевізники" },
  { href: "/services", icon: Briefcase, label: "Послуги" },
  { href: "/resources", icon: BookOpen, label: "Ресурси" },
  { href: "/contact", icon: Mail, label: "Контакти" },
  { href: "/about", icon: Info, label: "Про нас" },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="bg-whte text-black py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center relative">
              <Image
                src="/logo.png"
                alt="СвоЇ Logo"
                width={62}
                height={62}
                priority
                unoptimized
              />
            </div>
            <span className="hidden sm:inline">СвоЇ in CH</span>
            <span className="sm:hidden">СвоЇ in CH</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems
              .filter((item) => !item.mobileOnly)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-blue-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

            {/* Auth buttons */}
            <div className="flex items-center gap-2 ml-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100">
                          <DefaultAvatar className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.first_name}{" "}
                          {user.user_metadata?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/welcome")}>
                      Мій аккаунт
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Вийти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Увійти</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <AuthForms />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Зареєструватися</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <AuthForms />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-black">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Відкрити меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white text-gray-800 border-gray-100 w-[250px] sm:w-[300px]"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex items-center gap-3 mb-6 mt-6 px-4">
                <div className="w-10 h-10 relative">
                  <Image
                    src="/logo.png"
                    alt="SVOЇ Logo"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-semibold text-xl">СвоЇ in CH</span>
              </div>

              <div className="border-b border-gray-200 w-full mb-6 shadow-sm"></div>

              <nav className="flex flex-col gap-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 text-lg hover:text-indigo-600 transition-colors py-3 px-5 rounded-lg hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 text-indigo-500" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile auth buttons */}
              <div className="mt-6 pt-6 border-t border-gray-100 px-5">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100">
                            <DefaultAvatar className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.user_metadata?.first_name}{" "}
                            {user.user_metadata?.last_name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/welcome")}>
                        Мій аккаунт
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        Вийти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Увійти</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <AuthForms />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full flex items-center justify-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span>Зареєструватися</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <AuthForms />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 px-5">© 2024 СвоЇ in CH</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
