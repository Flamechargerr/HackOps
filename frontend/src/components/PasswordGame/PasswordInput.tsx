
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  password: string;
  setPassword: (value: string) => void;
  isGameComplete: boolean;
};

const PasswordInput = ({ password, setPassword, isGameComplete }: PasswordInputProps) => {
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="mb-6">
      <label htmlFor="password" className="block text-sm font-medium mb-2">
        Your Password
      </label>
      <input
        type="text"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        disabled={isGameComplete}
        className={cn(
          "w-full p-3 bg-muted/30 rounded-md border focus:ring-2 focus:outline-none font-mono transition-all duration-200",
          isGameComplete 
            ? "border-green-500/50 ring-green-500/20" 
            : "border-primary/30 focus:border-primary/50 focus:ring-primary/20"
        )}
        placeholder="Type your password..."
      />
    </div>
  );
};

export default PasswordInput;
