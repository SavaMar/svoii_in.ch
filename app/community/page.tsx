import React from "react";
import type { Metadata } from "next";
import { mockCommunityMembers } from "./mockData";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  title: "Спільнота | Українська Спільнота Швейцарії",
  description: "Члени української спільноти в Швейцарії",
};

export default function CommunityPage() {
  return <CommunityClient members={mockCommunityMembers} />;
}
