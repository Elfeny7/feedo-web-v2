import type { SVGProps } from "react";

const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const VARIANT_CLASSES = {
  default: "stroke-primary",
  warning: "stroke-yellow-500",
  danger: "stroke-destructive",
} as const;

export interface ProgressRingIconProps extends SVGProps<SVGSVGElement> {
  /** Progress ratio, clamped between 0 and 1. */
  progress: number;
  variant?: keyof typeof VARIANT_CLASSES;
}

export function ProgressRingIcon({
  progress,
  variant = "default",
  className,
  ...props
}: ProgressRingIconProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`-rotate-90 ${className ?? ""}`}
      {...props}
    >
      <circle
        cx="16"
        cy="16"
        r={RADIUS}
        fill="none"
        className="stroke-border"
        strokeWidth="3"
      />
      <circle
        cx="16"
        cy="16"
        r={RADIUS}
        fill="none"
        className={`${VARIANT_CLASSES[variant]} transition-all duration-300`}
        strokeWidth="3"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - clampedProgress)}
        strokeLinecap="round"
      />
    </svg>
  );
}
