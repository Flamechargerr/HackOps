
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { PasswordRequirementType } from "./types";

type RequirementsListProps = {
  requirements: PasswordRequirementType[];
};

const RequirementsList = ({ requirements }: RequirementsListProps) => {
  return (
    <div className="space-y-3 mb-6">
      <h3 className="font-medium">Requirements:</h3>
      <div className="bg-muted/20 rounded-md p-3 space-y-2">
        {requirements.map((req) => (
          <div 
            key={req.id}
            className={cn(
              "flex items-start p-2 rounded-md transition-colors",
              req.completed 
                ? "bg-green-500/10 text-green-400" 
                : "bg-muted/30"
            )}
          >
            <div className="mr-3 mt-0.5">
              {req.completed ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <X size={16} className="text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">{req.description}</p>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  req.difficulty === "easy" && "bg-green-500/20 text-green-400",
                  req.difficulty === "medium" && "bg-yellow-500/20 text-yellow-400",
                  req.difficulty === "hard" && "bg-red-500/20 text-red-400",
                )}>
                  {req.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementsList;
