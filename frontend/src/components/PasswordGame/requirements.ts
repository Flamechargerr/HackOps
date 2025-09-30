
import { PasswordRequirementType } from "./types";

export const initialRequirements: PasswordRequirementType[] = [
  {
    id: "length",
    description: "Password must be at least 5 characters long",
    validator: (pwd) => pwd.length >= 5,
    difficulty: "easy",
    completed: false,
    hint: "Try a password longer than 4 characters. Example: hacker1",
  },
  {
    id: "uppercase",
    description: "Password must contain at least one uppercase letter",
    validator: (pwd) => /[A-Z]/.test(pwd),
    difficulty: "easy",
    completed: false,
    hint: "Add a capital letter, e.g., 'A' in 'Apple'.",
  },
  {
    id: "number",
    description: "Password must contain at least one number",
    validator: (pwd) => /[0-9]/.test(pwd),
    difficulty: "easy",
    completed: false,
    hint: "Include a digit, e.g., '1', '2', or '3'.",
  },
  {
    id: "special",
    description: "Password must contain at least one special character (!@#$%^&*)",
    validator: (pwd) => /[!@#$%^&*]/.test(pwd),
    difficulty: "medium",
    completed: false,
    hint: "Try adding !, @, #, $, %, ^, &, or * to your password.",
  },
  {
    id: "no-consecutive",
    description: "No three consecutive characters can be the same",
    validator: (pwd) => !/(.)\1\1/.test(pwd),
    difficulty: "medium",
    completed: false,
    hint: "Avoid repeating any character three times in a row, e.g., 'aaa'.",
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
    hint: "Prime numbers are 2, 3, 5, 7, 11, etc. Try a password with a prime number of characters.",
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
    hint: "Try including a month, e.g., 'March2024!'.",
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
    hint: "Make sure the number of uppercase and lowercase letters is the same.",
  },
  {
    id: "no-common-words",
    description: "Password must not contain common words (e.g., 'password', 'admin', '1234')",
    validator: (pwd) => {
      const common = ["password", "admin", "1234", "qwerty", "letmein", "welcome"];
      return !common.some(word => pwd.toLowerCase().includes(word));
    },
    difficulty: "hard",
    completed: false,
    hint: "Avoid using obvious words like 'password', 'admin', or '1234'.",
  },
  {
    id: "three-types",
    description: "Password must include at least three types: uppercase, lowercase, number, special character",
    validator: (pwd) => {
      let types = 0;
      if (/[A-Z]/.test(pwd)) types++;
      if (/[a-z]/.test(pwd)) types++;
      if (/[0-9]/.test(pwd)) types++;
      if (/[!@#$%^&*]/.test(pwd)) types++;
      return types >= 3;
    },
    difficulty: "hard",
    completed: false,
    hint: "Use a mix of uppercase, lowercase, numbers, and special characters. At least three types!",
  },
];
