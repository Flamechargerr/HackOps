import React, { useEffect, useRef } from "react";

// SpotlightCursor: radial gradient that follows the mouse for depth
const SpotlightCursor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = e.clientX;
      const y = e.clientY;
      ref.current.style.setProperty("--mx", `${x}px`);
      ref.current.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(500px 500px at var(--mx) var(--my), rgba(59,130,246,0.12), rgba(0,0,0,0) 60%)",
      }}
    />
  );
};

export default SpotlightCursor;
