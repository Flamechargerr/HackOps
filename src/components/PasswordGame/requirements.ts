
import { PasswordRequirementType } from "./types";

export const initialRequirements: PasswordRequirementType[] = [
  {
    id: "length",
    description: "Password must be at least 5 characters long",
    validator: (pwd) => pwd.length >= 5,
    difficulty: "easy",
    completed: false,
  },
  {
    id: "uppercase",
    description: "Password must contain at least one uppercase letter",
    validator: (pwd) => /[A-Z]/.test(pwd),
    difficulty: "easy",
    completed: false,
  },
  {
    id: "number",
    description: "Password must contain at least one number",
    validator: (pwd) => /[0-9]/.test(pwd),
    difficulty: "easy",
    completed: false,
  },
  {
    id: "special",
    description: "Password must contain at least one special character (!@#$%^&*)",
    validator: (pwd) => /[!@#$%^&*]/.test(pwd),
    difficulty: "medium",
    completed: false,
  },
  {
    id: "no-consecutive",
    description: "No three consecutive characters can be the same",
    validator: (pwd) => !/(.)\1\1/.test(pwd),
    difficulty: "medium",
    completed: false,
  },
  {
    id: "prime-length",
    description: "Password length must be a prime number",
    validator: (pwd) => {
      const isPrime = (num: number) => {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        let i = 5;
        while (i * i <= num) {
          if (num % i === 0 || num % (i + 2) === 0) return false;
          i += 6;
        }
        return true;
      };
      return isPrime(pwd.length);
    },
    difficulty: "hard",
    completed: false,
  },
  {
    id: "month-name",
    description: "Password must contain a month name (e.g., January)",
    validator: (pwd) => {
      const months = [
        "january", "february", "march", "april", "may", "june", "july", 
        "august", "september", "october", "november", "december"
      ];
      return months.some(month => 
        pwd.toLowerCase().includes(month)
      );
    },
    difficulty: "hard",
    completed: false,
  },
  {
    id: "balanced-chars",
    description: "Equal number of uppercase and lowercase letters",
    validator: (pwd) => {
      const upperCount = (pwd.match(/[A-Z]/g) || []).length;
      const lowerCount = (pwd.match(/[a-z]/g) || []).length;
      return upperCount > 0 && upperCount === lowerCount;
    },
    difficulty: "hard",
    completed: false,
  },
];
