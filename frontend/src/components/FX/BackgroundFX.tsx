import React, { useMemo } from "react";

// Global background FX: neon beams, cyber grid, starfield shimmer
// Pure CSS + a few divs. Non-interactive (pointer-events: none)
const BackgroundFX: React.FC = () => {
  // Randomized star positions (stable for one render)
  const stars = useMemo(() => Array.from({ length: 80 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  })), []);

  return (
    <div aria-hidden className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[50vw] h-[50vw] rounded-full blur-3xl opacity-[0.12] bg-cyan-500" />
      <div className="absolute -bottom-40 -right-40 w-[50vw] h-[50vw] rounded-full blur-3xl opacity-[0.12] bg-fuchsia-500" />

      {/* Diagonal beams */}
      <div className="absolute -inset-40 rotate-12 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(217,70,239,0.25),transparent_50%)]" />

      {/* Subtle cyber grid */}
      <div className="matrix-animation pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70 shadow-[0_0_6px_1px_rgba(255,255,255,0.6)]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle 3s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Film grain */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.07] bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 128 128\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')]" />
    </div>
  );
};

export default BackgroundFX;
