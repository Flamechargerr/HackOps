import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  className?: string;
  children: React.ReactNode;
  intensity?: number; // tilt intensity
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const TiltCard: React.FC<TiltCardProps> = ({ className, children, intensity = 10 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = clamp((0.5 - py) * intensity, -intensity, intensity);
    const ry = clamp((px - 0.5) * intensity, -intensity, intensity);
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "[transform-style:preserve-3d] transition-transform duration-150 will-change-transform",
        className
      )}
    >
      {children}
    </div>
  );
};

export default TiltCard;
