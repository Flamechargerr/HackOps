
import { cn } from "@/lib/utils";
import { FeedbackType } from "./types";

type FeedbackMessageProps = {
  message: string;
  type: FeedbackType;
};

const FeedbackMessage = ({ message, type }: FeedbackMessageProps) => {
  return (
    <div 
      className={cn(
        "mb-4 p-3 rounded-md text-sm animate-slide-in-bottom",
        type === "success" && "bg-green-500/20 text-green-400 border border-green-500/30",
        type === "error" && "bg-red-500/20 text-red-400 border border-red-500/30",
        type === "info" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      )}
    >
      {message}
    </div>
  );
};

export default FeedbackMessage;
