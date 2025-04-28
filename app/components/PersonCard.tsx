"use client";

import React from "react";
import Image from "next/image";
import { MapPin, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityMember } from "../community/types";
import { getCantonName } from "../utils/cantons";
import Link from "next/link";

// Custom components for social media icons
const inst_link = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const fb_link = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

interface PersonCardProps {
  member: CommunityMember;
}

export function PersonCard({ member }: PersonCardProps) {
  // Get the full canton name
  const cantonName = getCantonName(member.kanton);

  // Get display name (first name + last name or nickname)
  const displayName =
    member.nickname ||
    `${member.firstName}${member.lastName ? ` ${member.lastName}` : ""}`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-gray-200">
      <CardContent className="p-0">
        <div className="flex">
          {/* Avatar section */}
          <div className="w-32 h-32 relative shrink-0">
            <Image
              src={member.avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>

          {/* Content section */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{displayName}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{cantonName}</span>
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs bg-indigo-50 border-indigo-100 text-indigo-700 font-mono"
                  >
                    {member.kanton}
                  </Badge>
                </div>
              </div>

              {/* Social links */}
              <div className="flex space-x-2">
                {member.contacts.whatsapp && (
                  <Link
                    href={member.contacts.whatsapp}
                    target="_blank"
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                  </Link>
                )}
                {member.contacts.telegram && (
                  <Link
                    href={member.contacts.telegram}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                )}
                {member.contacts.viber && (
                  <Link
                    href={member.contacts.viber}
                    target="_blank"
                    className="text-purple-500 hover:text-purple-700 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                  </Link>
                )}
                {member.contacts.instagram && (
                  <Link
                    href={member.contacts.instagram}
                    target="_blank"
                    className="text-pink-500 hover:text-pink-700 transition-colors"
                  >
                    {inst_link()}
                  </Link>
                )}
                {member.contacts.facebook && (
                  <Link
                    href={member.contacts.facebook}
                    target="_blank"
                    className="text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    {fb_link()}
                  </Link>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="mt-auto flex flex-wrap gap-1">
              {member.interests.slice(0, 5).map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
