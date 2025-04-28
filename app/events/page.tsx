import React from "react";
import EventsClient from "./EventsClient";

export const metadata = {
  title: "Події | Українська Спільнота Швейцарії",
  description:
    "Культурні, освітні та розважальні заходи для українців у Швейцарії",
};

export default function EventsPage() {
  return <EventsClient />;
}
