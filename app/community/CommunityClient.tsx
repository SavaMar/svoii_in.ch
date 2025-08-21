"use client";

import React, { useState, useEffect } from "react";
import { CommunityMember, CommunityFilterOptions } from "@/app/community/types";
import { getCantonName, getAllCantons, CantonCode } from "@/app/utils/cantons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Search,
  UsersRound,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  X,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

// Instagram and Facebook icons as custom components
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Constants
const FALLBACK_AVATAR = "/fake-avatar.jpg";

interface CommunityClientProps {
  members: CommunityMember[];
}

export default function CommunityClient({ members }: CommunityClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] =
    useState<CommunityMember[]>(members);
  const [filters, setFilters] = useState<CommunityFilterOptions>({
    kantons: [],
    interests: [],
  });
  const [interestInput, setInterestInput] = useState("");
  const [showCantonDropdown, setShowCantonDropdown] = useState(false);

  const cantons = getAllCantons();

  // Get unique interests from all members
  const allInterests = Array.from(
    new Set(members.flatMap((m) => m.interests))
  ).sort();

  // Filtered interests based on input
  const filteredInterests = allInterests.filter((interest) =>
    interest.toLowerCase().includes(interestInput.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInterestInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestInput(e.target.value);
  };

  const addInterestFilter = (interest: string) => {
    if (!filters.interests.includes(interest)) {
      setFilters((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
    setInterestInput("");
  };

  const removeInterestFilter = (interest: string) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const toggleCantonFilter = (canton: CantonCode) => {
    setFilters((prev) => {
      const exists = prev.kantons.includes(canton);
      return {
        ...prev,
        kantons: exists
          ? prev.kantons.filter((k) => k !== canton)
          : [...prev.kantons, canton],
      };
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      kantons: [],
      interests: [],
    });
    setInterestInput("");
  };

  useEffect(() => {
    let resultMembers = [...members];

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      resultMembers = resultMembers.filter(
        (member) =>
          member.firstName.toLowerCase().includes(term) ||
          (member.lastName?.toLowerCase() || "").includes(term) ||
          (member.nickname?.toLowerCase() || "").includes(term) ||
          (member.bio?.toLowerCase() || "").includes(term)
      );
    }

    if (filters.kantons.length > 0) {
      resultMembers = resultMembers.filter((member) =>
        filters.kantons.includes(member.kanton as CantonCode)
      );
    }

    if (filters.interests.length > 0) {
      resultMembers = resultMembers.filter((member) =>
        member.interests.some((interest) =>
          filters.interests.includes(interest)
        )
      );
    }

    setFilteredMembers(resultMembers);
  }, [searchQuery, filters, members]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* Hero section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
          Наша спільнота
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Знайдіть однодумців, співпрацюйте та розвивайтеся разом
        </p>
      </div>

      {/* Access message */}
      <Card className="mb-8 p-8 bg-gradient-to-br from-indigo-50 via-cyan-50 to-white border-indigo-100 shadow-lg">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-3">
              Доступ до спільноти
            </h2>
            <p className="text-gray-700 text-lg">
              Створювати профайли чи бачити цю сторінку можуть лише ті, хто
              перебуває фізично у Швейцарії.
            </p>
          </div>
          {user ? (
            <Button
              className="w-full max-w-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-700 hover:to-cyan-600 transition-all duration-200 shadow-md"
              onClick={() => router.push("/profile")}
            >
              Створити профайл
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Будь ласка, увійдіть до системи, щоб створити профайл
            </p>
          )}
        </div>
      </Card>

      {/* Top search and filters section */}
      <Card className="mb-8 p-6 bg-gradient-to-br from-cyan-50 to-white border-cyan-100 shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Search bar */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center text-gray-700">
              <Search className="h-4 w-4 mr-2 text-cyan-600" />
              Пошук
            </h3>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ім'я, прізвище, біо..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center text-gray-700">
              <Filter className="h-4 w-4 mr-2 text-cyan-600" />
              Фільтри
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Canton dropdown */}
              <div className="relative">
                <h4 className="text-sm font-medium mb-2 text-gray-600">
                  Кантон
                </h4>
                <div className="relative">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full rounded-md border border-gray-200 px-4 py-2 bg-white text-left text-sm hover:border-cyan-200 transition-colors"
                    onClick={() => setShowCantonDropdown(!showCantonDropdown)}
                  >
                    <span>
                      {filters.kantons.length === 0
                        ? "Виберіть кантони"
                        : `Вибрано: ${filters.kantons.length}`}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showCantonDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto py-1 border border-gray-200">
                      {cantons.map((canton) => (
                        <div
                          key={canton.code}
                          className="flex items-center px-4 py-2 hover:bg-cyan-50 cursor-pointer"
                          onClick={() => toggleCantonFilter(canton.code)}
                        >
                          <Checkbox
                            id={`canton-${canton.code}`}
                            checked={filters.kantons.includes(canton.code)}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`canton-${canton.code}`}
                            className="flex-1 cursor-pointer"
                          >
                            {canton.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display selected cantons as badges */}
                {filters.kantons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.kantons.map((canton) => (
                      <Badge
                        key={canton}
                        variant="secondary"
                        className="flex items-center gap-1 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                      >
                        {getCantonName(canton)}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => toggleCantonFilter(canton)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Interests filter */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-600">
                  Інтереси
                </h4>
                <div className="relative">
                  <Input
                    placeholder="Додати інтерес..."
                    value={interestInput}
                    onChange={handleInterestInput}
                    className="mb-2"
                  />
                  {interestInput && filteredInterests.length > 0 && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto py-1 border border-gray-200">
                      {filteredInterests.map((interest) => (
                        <div
                          key={interest}
                          className="px-4 py-2 hover:bg-cyan-50 cursor-pointer"
                          onClick={() => addInterestFilter(interest)}
                        >
                          {interest}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display selected interests as badges */}
                {filters.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="flex items-center gap-1 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                      >
                        {interest}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeInterestFilter(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(filters.kantons.length > 0 ||
              filters.interests.length > 0 ||
              searchQuery) && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-4 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
              >
                Скинути всі фільтри
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Community members list */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <UsersRound className="h-6 w-6 mr-2 text-cyan-600" />
            Учасники спільноти
          </h2>
          <p className="text-muted-foreground">
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1 ? "учасник" : "учасників"}
          </p>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-cyan-50 to-white rounded-lg">
            <p className="text-xl text-gray-600 mb-2">
              Не знайдено учасників за вашим запитом
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-cyan-200 text-cyan-600 hover:bg-cyan-50"
            >
              Скинути всі фільтри
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-cyan-100 to-white">
                      <Image
                        src={FALLBACK_AVATAR}
                        alt={member.firstName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        {member.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-cyan-600 ml-1" />
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        {member.nickname && <span>@{member.nickname} • </span>}
                        <span>{getCantonName(member.kanton)}</span>
                      </div>

                      {member.bio && (
                        <p className="text-sm mt-2 line-clamp-2 text-gray-600">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {member.interests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="text-xs cursor-pointer bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                          onClick={() => addInterestFilter(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.contacts?.email && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 gap-1 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <a href={`mailto:${member.contacts.email}`}>
                          <Mail className="h-3.5 w-3.5" />
                          <span className="sr-only">Email</span>
                        </a>
                      </Button>
                    )}

                    {member.contacts?.telegram && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 gap-1 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <a
                          href={member.contacts.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="sr-only">Telegram</span>
                        </a>
                      </Button>
                    )}

                    {member.contacts?.instagram && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 gap-1 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <a
                          href={member.contacts.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <InstagramIcon />
                          <span className="sr-only">Instagram</span>
                        </a>
                      </Button>
                    )}

                    {member.contacts?.facebook && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 gap-1 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <a
                          href={member.contacts.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FacebookIcon />
                          <span className="sr-only">Facebook</span>
                        </a>
                      </Button>
                    )}

                    {(member.contacts?.phone ||
                      member.contacts?.whatsapp ||
                      member.contacts?.viber) && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 gap-1 border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                      >
                        <a
                          href={`tel:${
                            member.contacts.phone ||
                            member.contacts.whatsapp ||
                            member.contacts.viber
                          }`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span className="sr-only">Phone</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
