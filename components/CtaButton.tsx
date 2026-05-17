import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "onDark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function CtaButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: CtaButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const styles =
    variant === "primary"
      ? "bg-cta text-white shadow-md hover:brightness-110 focus-visible:outline-cta"
      : variant === "onDark"
        ? "border-2 border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/5 focus-visible:outline-white"
        : "border-2 border-primary/15 bg-surface text-primary hover:border-primary/25 focus-visible:outline-primary";

  return (
    <Link href={href} className={`${base} ${sizeClasses[size]} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
