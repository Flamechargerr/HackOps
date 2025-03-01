
export type PasswordRequirementType = {
  id: string;
  description: string;
  validator: (password: string) => boolean;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
};

export type FeedbackType = "success" | "error" | "info";
