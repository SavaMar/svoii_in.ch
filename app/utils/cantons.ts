export type CantonCode =
  | "ZH"
  | "BE"
  | "LU"
  | "UR"
  | "SZ"
  | "OW"
  | "NW"
  | "GL"
  | "ZG"
  | "FR"
  | "SO"
  | "BS"
  | "BL"
  | "SH"
  | "AR"
  | "AI"
  | "SG"
  | "GR"
  | "AG"
  | "TG"
  | "TI"
  | "VD"
  | "VS"
  | "NE"
  | "GE"
  | "JU";

export const CANTON_NAMES: Record<CantonCode, string> = {
  ZH: "Zürich",
  BE: "Bern",
  LU: "Luzern",
  UR: "Uri",
  SZ: "Schwyz",
  OW: "Obwalden",
  NW: "Nidwalden",
  GL: "Glarus",
  ZG: "Zug",
  FR: "Fribourg",
  SO: "Solothurn",
  BS: "Basel-Stadt",
  BL: "Basel-Landschaft",
  SH: "Schaffhausen",
  AR: "Appenzell Ausserrhoden",
  AI: "Appenzell Innerrhoden",
  SG: "St. Gallen",
  GR: "Graubünden",
  AG: "Aargau",
  TG: "Thurgau",
  TI: "Ticino",
  VD: "Vaud",
  VS: "Valais",
  NE: "Neuchâtel",
  GE: "Geneva",
  JU: "Jura",
};

/**
 * Get the full name of a Swiss canton from its abbreviation
 * @param code The canton code (e.g., "ZH", "BE")
 * @returns The full canton name or the original code if not found
 */
export function getCantonName(code: string): string {
  if (!code) return "";

  // Handle case insensitive lookup
  const upperCode = code.toUpperCase() as CantonCode;

  // Return the full name if it exists, otherwise return the original code
  return CANTON_NAMES[upperCode] || code;
}
