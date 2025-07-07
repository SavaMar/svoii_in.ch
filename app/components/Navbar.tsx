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
  User,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("userprofile")
        .select("avatar_url")
        .eq("user_id", user.id)
        .single();

      if (!error && profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }

    fetchProfile();
  }, [user, supabase]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-whte text-black py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2"
            onClick={handleLinkClick}
          >
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
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt="User avatar" />
                        ) : (
                          <AvatarFallback className="bg-gray-100">
                            <DefaultAvatar className="w-6 h-6" />
                          </AvatarFallback>
                        )}
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
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(false);
                      }}
                    >
                      Мій профіль
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/welcome");
                        setIsOpen(false);
                      }}
                    >
                      Налаштування
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Вийти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-indigo-700 to-cyan-500 text-white hover:from-indigo-700 hover:via-indigo-600 hover:to-teal-500 transition-aserll duration-200 shadow-md flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Увійти
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogTitle className="sr-only">
                      Увійти в систему
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Введіть свої облікові дані для входу в систему
                    </DialogDescription>
                    <AuthForms />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                      onClick={handleLinkClick}
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
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="User avatar" />
                          ) : (
                            <AvatarFallback className="bg-gray-100">
                              <DefaultAvatar className="w-6 h-6" />
                            </AvatarFallback>
                          )}
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
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/profile");
                          setIsOpen(false);
                        }}
                      >
                        Мій профіль
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/welcome");
                          setIsOpen(false);
                        }}
                      >
                        Налаштування
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
                        <Button className="w-full bg-gradient-to-r from-indigo-700 to-cyan-500 text-white hover:from-indigo-700 hover:via-indigo-600 hover:to-teal-500 transition-all duration-200 shadow-md flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Увійти
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
