"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Client Island - Viewport-triggered hardware-accelerated animated counter.
 * Extracts prefix, numeric amount (including decimals), and suffix.
 * Formats with tabular-nums for vertical stability.
 */
export function CountUp({ value, duration = 1800, className = "" }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Initial placeholder before animation triggers
    const match = value.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (match) {
      const prefix = match[1] || "";
      const suffix = match[3] || "";
      setDisplayValue(`${prefix}0${suffix}`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  const startAnimation = () => {
    const match = value.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || "";
    const cleanNumberStr = (match[2] || "0").replace(/,/g, "");
    const numericPart = Number.parseFloat(cleanNumberStr);
    const suffix = match[3] || "";
    const hasDecimal = cleanNumberStr.includes(".");
    const decimalPlaces = hasDecimal ? cleanNumberStr.split(".")[1]?.length || 0 : 0;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericPart * easeOut;

      let formattedNumber: string;
      if (hasDecimal) {
        formattedNumber = currentValue.toFixed(decimalPlaces);
      } else if (cleanNumberStr.length >= 4) {
        // Thousands separator
        formattedNumber = Math.floor(currentValue).toLocaleString("en-US");
      } else {
        formattedNumber = Math.floor(currentValue).toString();
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <span
      ref={ref}
      aria-label={value}
      className={`tabular-nums inline-block will-change-contents ${className}`}
    >
      {displayValue}
    </span>
  );
}
