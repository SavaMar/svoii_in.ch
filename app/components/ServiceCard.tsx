"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, ExternalLink, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceProvider, CATEGORY_COLORS } from "../services/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { cn } from "@/lib/utils";
import { getCantonName } from "../utils/cantons";

interface ServiceCardProps {
  service: ServiceProvider;
  onView: (id: string) => void;
}

// Map border classes to color classes
function getBorderTopClasses(borderClass: string): string {
  const colorMap: Record<string, string> = {
    "border-amber-500": "border-t-amber-500",
    "border-slate-500": "border-t-slate-500",
    "border-emerald-500": "border-t-emerald-500",
    "border-orange-500": "border-t-orange-500",
    "border-sky-500": "border-t-sky-500",
    "border-red-500": "border-t-red-500",
    "border-violet-500": "border-t-violet-500",
    "border-pink-500": "border-t-pink-500",
    "border-indigo-500": "border-t-indigo-500",
    "border-blue-700": "border-t-blue-700",
    "border-gray-700": "border-t-gray-700",
    "border-lime-500": "border-t-lime-500",
    "border-purple-500": "border-t-purple-500",
    "border-green-600": "border-t-green-600",
    "border-fuchsia-500": "border-t-fuchsia-500",
    "border-red-600": "border-t-red-600",
    "border-gray-500": "border-t-gray-500",
    "border-yellow-500": "border-t-yellow-500",
    "border-cyan-500": "border-t-cyan-500",
    "border-blue-500": "border-t-blue-500",
    "border-rose-500": "border-t-rose-500",
  };

  return colorMap[borderClass] || "border-t-gray-500";
}

// Map border classes to badge background classes
function getBadgeClasses(borderClass: string): string {
  const colorMap: Record<string, { bg: string; text: string }> = {
    "border-amber-500": { bg: "bg-amber-100", text: "text-amber-800" },
    "border-slate-500": { bg: "bg-slate-100", text: "text-slate-800" },
    "border-emerald-500": { bg: "bg-emerald-100", text: "text-emerald-800" },
    "border-orange-500": { bg: "bg-orange-100", text: "text-orange-800" },
    "border-sky-500": { bg: "bg-sky-100", text: "text-sky-800" },
    "border-red-500": { bg: "bg-red-100", text: "text-red-800" },
    "border-violet-500": { bg: "bg-violet-100", text: "text-violet-800" },
    "border-pink-500": { bg: "bg-pink-100", text: "text-pink-800" },
    "border-indigo-500": { bg: "bg-indigo-100", text: "text-indigo-800" },
    "border-blue-700": { bg: "bg-blue-100", text: "text-blue-800" },
    "border-gray-700": { bg: "bg-gray-100", text: "text-gray-800" },
    "border-lime-500": { bg: "bg-lime-100", text: "text-lime-800" },
    "border-purple-500": { bg: "bg-purple-100", text: "text-purple-800" },
    "border-green-600": { bg: "bg-green-100", text: "text-green-800" },
    "border-fuchsia-500": { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
    "border-red-600": { bg: "bg-red-100", text: "text-red-800" },
    "border-gray-500": { bg: "bg-gray-100", text: "text-gray-800" },
    "border-yellow-500": { bg: "bg-yellow-100", text: "text-yellow-800" },
    "border-cyan-500": { bg: "bg-cyan-100", text: "text-cyan-800" },
    "border-blue-500": { bg: "bg-blue-100", text: "text-blue-800" },
    "border-rose-500": { bg: "bg-rose-100", text: "text-rose-800" },
  };

  return `${colorMap[borderClass]?.bg || "bg-gray-100"} ${
    colorMap[borderClass]?.text || "text-gray-800"
  }`;
}

export function ServiceCard({ service, onView }: ServiceCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onView(service.id);
  };

  const borderClass = CATEGORY_COLORS[service.category] || "border-gray-500";
  const topBorderClass = getBorderTopClasses(borderClass);
  const badgeClasses = getBadgeClasses(borderClass);

  // Get the full canton name
  const cantonName = getCantonName(service.kanton);

  return (
    <Link
      href={`/services/${service.id}`}
      className="block transition-transform hover:translate-y-[-4px]"
      onClick={handleClick}
    >
      <Card
        className={cn(
          "h-full border border-gray-200 border-t-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
          topBorderClass
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={cn(badgeClasses, "hover:bg-opacity-80")}>
              {service.category}
            </Badge>
            <div className="text-sm text-gray-500 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {service.views}
            </div>
          </div>
          <h3 className="font-semibold text-xl mt-2 line-clamp-2">
            {service.name}
          </h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
            <div>
              <div className="flex items-center mb-1">
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0 mr-2 bg-indigo-50 border-indigo-100 text-indigo-700 font-mono"
                >
                  {service.kanton}
                </Badge>
                <span className="text-sm text-gray-600">{cantonName}</span>
              </div>
              <span className="text-sm text-gray-600 line-clamp-1">
                {service.address}
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <Mail className="h-4 w-4 text-gray-500 mr-2 mt-1" />
            <span className="text-sm text-gray-600 line-clamp-1">
              {service.email}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            Перейти до сторінки <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
