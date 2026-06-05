import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "onDark" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
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
  onClick,
}: CtaButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const styles =
    variant === "primary"
      ? "bg-cta text-white shadow-md hover:brightness-110 focus-visible:outline-cta"
      : variant === "onDark"
        ? "border-2 border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/5 focus-visible:outline-white"
        : variant === "ghost"
          ? "border border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10 focus-visible:outline-white"
          : "border-2 border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/5 focus-visible:outline-white";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${base} ${sizeClasses[size]} ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
