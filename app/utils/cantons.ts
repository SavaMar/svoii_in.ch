// Swiss cantons mapping
type CantonCode =
  | "AG"
  | "AI"
  | "AR"
  | "BE"
  | "BL"
  | "BS"
  | "FR"
  | "GE"
  | "GL"
  | "GR"
  | "JU"
  | "LU"
  | "NE"
  | "NW"
  | "OW"
  | "SG"
  | "SH"
  | "SO"
  | "SZ"
  | "TG"
  | "TI"
  | "UR"
  | "VD"
  | "VS"
  | "ZG"
  | "ZH";

const cantonNames: Record<CantonCode, string> = {
  AG: "Aargau",
  AI: "Appenzell Innerrhoden",
  AR: "Appenzell Ausserrhoden",
  BE: "Bern",
  BL: "Basel-Landschaft",
  BS: "Basel-Stadt",
  FR: "Fribourg",
  GE: "Geneva",
  GL: "Glarus",
  GR: "Graubünden",
  JU: "Jura",
  LU: "Lucerne",
  NE: "Neuchâtel",
  NW: "Nidwalden",
  OW: "Obwalden",
  SG: "St. Gallen",
  SH: "Schaffhausen",
  SO: "Solothurn",
  SZ: "Schwyz",
  TG: "Thurgau",
  TI: "Ticino",
  UR: "Uri",
  VD: "Vaud",
  VS: "Valais",
  ZG: "Zug",
  ZH: "Zürich",
};

/**
 * Get the full name of a canton from its code
 * @param code The two-letter canton code (e.g., 'ZH', 'GE')
 * @returns The full name of the canton
 */
export function getCantonName(code: string): string {
  if (code in cantonNames) {
    return cantonNames[code as CantonCode];
  }
  return code; // Return the code itself if not found
}

/**
 * Get all canton codes and names as an array of objects
 * @returns Array of canton objects with code and name properties
 */
export function getAllCantons(): { code: CantonCode; name: string }[] {
  return Object.entries(cantonNames).map(([code, name]) => ({
    code: code as CantonCode,
    name,
  }));
}

/**
 * Check if a string is a valid canton code
 * @param code The string to check
 * @returns True if it's a valid canton code, false otherwise
 */
export function isValidCantonCode(code: string): boolean {
  return code in cantonNames;
}

export type { CantonCode };
