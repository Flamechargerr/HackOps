
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "terminal" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          // Animation styles
          "transform-gpu will-change-transform hover:scale-[1.04] active:scale-[0.97] focus:scale-[1.03] hover:shadow-lg active:shadow-sm focus:shadow-lg",
          // Variant styles
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "border border-border bg-background hover:bg-muted/20": variant === "outline",
            "hover:bg-muted/20": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "font-mono bg-terminal text-terminal-foreground border border-primary/30 hover:border-primary/80": variant === "terminal",
            "bg-primary/90 text-primary-foreground shadow-glow-sm hover:shadow-glow-md border border-accent/50": variant === "glow",
          },
          // Size styles
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8 text-lg": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
