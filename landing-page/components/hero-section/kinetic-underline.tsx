"use client";

import { motion } from "framer-motion";

interface KineticUnderlineProps {
  className?: string;
}

export function KineticUnderline({ className = "" }: KineticUnderlineProps) {
  return (
    <svg
      className={`absolute -bottom-2 left-0 w-full h-4 overflow-visible pointer-events-none ${className}`}
      viewBox="0 0 280 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M3 14C50 4 110 12 160 6C210 0 245 10 277 8"
        stroke="url(#gradient-amber)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1], // Spring physics curve
          delay: 0.4,
        }}
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "stroke-dashoffset, opacity",
        }}
      />
      <defs>
        <linearGradient id="gradient-amber" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.5" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}
