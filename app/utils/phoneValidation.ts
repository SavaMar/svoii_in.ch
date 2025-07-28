export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  country?: string;
}

export function validatePhoneNumber(phone: string): PhoneValidationResult {
  // Remove any spaces, dashes, or parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Check if it's a Russian number
  if (cleanPhone.startsWith("+7")) {
    return {
      isValid: false,
      error:
        "Phone numbers from Russian Federation (+7) are not supported. Please use a phone number from a supported country.",
      country: "RU",
    };
  }

  // Get the country code and validate
  const countryCode = getCountryCode(cleanPhone);
  if (!countryCode) {
    return {
      isValid: false,
      error: "Please use a phone number from a supported country.",
      country: "UNKNOWN",
    };
  }

  // Basic validation for supported countries
  const numberWithoutCode = cleanPhone.substring(countryCode.code.length);
  if (numberWithoutCode.length < 7 || numberWithoutCode.length > 12) {
    return {
      isValid: false,
      error: `Phone number must be between 7-12 digits for ${countryCode.name}`,
      country: countryCode.iso,
    };
  }

  return {
    isValid: true,
    country: countryCode.iso,
  };
}

function getCountryCode(phone: string) {
  // European Union countries + Ukraine + UK
  const supportedCountries = [
    { code: "+43", name: "Austria", flag: "🇦🇹", iso: "AT" },
    { code: "+32", name: "Belgium", flag: "🇧🇪", iso: "BE" },
    { code: "+359", name: "Bulgaria", flag: "🇧🇬", iso: "BG" },
    { code: "+385", name: "Croatia", flag: "🇭🇷", iso: "HR" },
    { code: "+357", name: "Cyprus", flag: "🇨🇾", iso: "CY" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿", iso: "CZ" },
    { code: "+45", name: "Denmark", flag: "🇩🇰", iso: "DK" },
    { code: "+372", name: "Estonia", flag: "🇪🇪", iso: "EE" },
    { code: "+358", name: "Finland", flag: "🇫🇮", iso: "FI" },
    { code: "+33", name: "France", flag: "🇫🇷", iso: "FR" },
    { code: "+49", name: "Germany", flag: "🇩🇪", iso: "DE" },
    { code: "+30", name: "Greece", flag: "🇬🇷", iso: "GR" },
    { code: "+36", name: "Hungary", flag: "🇭🇺", iso: "HU" },
    { code: "+353", name: "Ireland", flag: "🇮🇪", iso: "IE" },
    { code: "+39", name: "Italy", flag: "🇮🇹", iso: "IT" },
    { code: "+371", name: "Latvia", flag: "🇱🇻", iso: "LV" },
    { code: "+370", name: "Lithuania", flag: "🇱🇹", iso: "LT" },
    { code: "+352", name: "Luxembourg", flag: "🇱🇺", iso: "LU" },
    { code: "+356", name: "Malta", flag: "🇲🇹", iso: "MT" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱", iso: "NL" },
    { code: "+48", name: "Poland", flag: "🇵🇱", iso: "PL" },
    { code: "+351", name: "Portugal", flag: "🇵🇹", iso: "PT" },
    { code: "+40", name: "Romania", flag: "🇷🇴", iso: "RO" },
    { code: "+421", name: "Slovakia", flag: "🇸🇰", iso: "SK" },
    { code: "+386", name: "Slovenia", flag: "🇸🇮", iso: "SI" },
    { code: "+34", name: "Spain", flag: "🇪🇸", iso: "ES" },
    { code: "+46", name: "Sweden", flag: "🇸🇪", iso: "SE" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭", iso: "CH" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦", iso: "UA" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  ];

  return supportedCountries.find((country) => phone.startsWith(country.code)) ||
    null;
}

export function formatPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  const countryCode = getCountryCode(cleanPhone);
  if (!countryCode) {
    return phone;
  }

  const numberWithoutCode = cleanPhone.substring(countryCode.code.length);

  // Basic formatting for display
  if (numberWithoutCode.length >= 6) {
    const chunks = [];
    let remaining = numberWithoutCode;

    // Add chunks of 2-3 digits
    while (remaining.length > 0) {
      if (remaining.length >= 3) {
        chunks.push(remaining.substring(0, 3));
        remaining = remaining.substring(3);
      } else {
        chunks.push(remaining);
        remaining = "";
      }
    }

    return `${countryCode.code} ${chunks.join(" ")}`;
  }

  return phone;
}

// Get sorted countries for better UX (Ukraine first, then Switzerland, then alphabetical)
export function getSortedCountries() {
  const sorted = [...SUPPORTED_COUNTRIES];

  // Move Ukraine to the top
  const ukraineIndex = sorted.findIndex((country) => country.code === "+380");
  if (ukraineIndex > -1) {
    const ukraine = sorted.splice(ukraineIndex, 1)[0];
    sorted.unshift(ukraine);
  }

  // Move Switzerland to second position
  const switzerlandIndex = sorted.findIndex((country) =>
    country.code === "+41"
  );
  if (switzerlandIndex > -1) {
    const switzerland = sorted.splice(switzerlandIndex, 1)[0];
    sorted.splice(1, 0, switzerland);
  }

  return sorted;
}

export const SUPPORTED_COUNTRIES = [
  { code: "+43", name: "Austria", flag: "🇦🇹", iso: "AT" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", iso: "BE" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬", iso: "BG" },
  { code: "+385", name: "Croatia", flag: "🇭🇷", iso: "HR" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾", iso: "CY" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿", iso: "CZ" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", iso: "DK" },
  { code: "+372", name: "Estonia", flag: "🇪🇪", iso: "EE" },
  { code: "+358", name: "Finland", flag: "🇫🇮", iso: "FI" },
  { code: "+33", name: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+49", name: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+30", name: "Greece", flag: "🇬🇷", iso: "GR" },
  { code: "+36", name: "Hungary", flag: "🇭🇺", iso: "HU" },
  { code: "+353", name: "Ireland", flag: "🇮🇪", iso: "IE" },
  { code: "+39", name: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+371", name: "Latvia", flag: "🇱🇻", iso: "LV" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹", iso: "LT" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺", iso: "LU" },
  { code: "+356", name: "Malta", flag: "🇲🇹", iso: "MT" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", iso: "NL" },
  { code: "+48", name: "Poland", flag: "🇵🇱", iso: "PL" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", iso: "PT" },
  { code: "+40", name: "Romania", flag: "🇷🇴", iso: "RO" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰", iso: "SK" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮", iso: "SI" },
  { code: "+34", name: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", iso: "SE" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", iso: "CH" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦", iso: "UA" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "GB" },
] as const;

export const BLOCKED_COUNTRIES = [
  {
    code: "+7",
    name: "Russian Federation",
    flag: "🇷🇺",
    reason: "Not supported",
  },
] as const;
