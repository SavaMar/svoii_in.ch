export interface PasswordRequirement {
  text: string;
  isMet: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
  requirements: PasswordRequirement[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" = "weak";

  // Define requirements
  const requirements: PasswordRequirement[] = [
    {
      text: "Мінімум 8 символів",
      isMet: password.length >= 8,
    },
    {
      text: "Хоча б одна цифра",
      isMet: /\d/.test(password),
    },
    {
      text: "Хоча б один спеціальний символ",
      isMet: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
    {
      text: "Хоча б одна велика літера",
      isMet: /[A-Z]/.test(password),
    },
    {
      text: "Хоча б одна мала літера",
      isMet: /[a-z]/.test(password),
    },
  ];

  // Check minimum length
  if (password.length < 8) {
    errors.push("Пароль повинен містити мінімум 8 символів");
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push("Пароль повинен містити хоча б одну цифру");
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(
      "Пароль повинен містити хоча б один спеціальний символ (!@#$%^&*()_+-=[]{}|;:,.<>?)",
    );
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push("Пароль повинен містити хоча б одну велику літеру");
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push("Пароль повинен містити хоча б одну малу літеру");
  }

  // Calculate strength
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = "strong";
    } else if (password.length >= 10) {
      strength = "medium";
    } else {
      strength = "weak";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    requirements,
  };
}

export function getPasswordStrengthColor(
  strength: "weak" | "medium" | "strong",
): string {
  switch (strength) {
    case "weak":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "strong":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export function getPasswordStrengthText(
  strength: "weak" | "medium" | "strong",
): string {
  switch (strength) {
    case "weak":
      return "Слабкий";
    case "medium":
      return "Середній";
    case "strong":
      return "Сильний";
    default:
      return "";
  }
}

export function getRequirementColor(isMet: boolean): string {
  return isMet ? "text-green-600" : "text-red-600";
}

export function getRequirementIcon(isMet: boolean): string {
  return isMet ? "✓" : "✗";
}

export const PASSWORD_REQUIREMENTS = [
  "Мінімум 8 символів",
  "Хоча б одна цифра",
  "Хоча б один спеціальний символ",
  "Хоча б одна велика літера",
  "Хоча б одна мала літера",
];
