
// Function to determine which requirements to show based on level
export const getRequirementsForLevel = (currentLevel: number): string[] => {
  switch (currentLevel) {
    case 1:
      return ["length"];
    case 2:
      return ["length", "uppercase"];
    case 3:
      return ["length", "uppercase", "number"];
    case 4:
      return ["length", "uppercase", "number", "special"];
    case 5:
      return ["length", "uppercase", "number", "special", "no-consecutive"];
    case 6:
      return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length"];
    case 7:
      return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length", "month-name"];
    case 8:
      return ["length", "uppercase", "number", "special", "no-consecutive", "prime-length", "month-name", "balanced-chars"];
    default:
      return ["length"];
  }
};
