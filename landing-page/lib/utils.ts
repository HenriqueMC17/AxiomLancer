/**
 * Utility for combining Tailwind CSS class names cleanly.
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(" ");
}