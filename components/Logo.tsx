import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  size?: number;
};

export function Logo({
  href = "#top",
  showWordmark = true,
  wordmarkClassName = "text-primary",
  size = 36,
}: LogoProps) {
  const mark = (
    <Image
      src="/occudule-logo.png"
      alt="Occudule logo"
      width={size}
      height={size}
      className="shrink-0 rounded-lg object-cover"
      priority
    />
  );

  const label = showWordmark ? (
    <span className={`text-lg font-semibold tracking-tight ${wordmarkClassName}`}>Occudule</span>
  ) : null;

  if (!href) {
    return (
      <div className="flex items-center gap-2">
        {mark}
        {label}
      </div>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-2">
      {mark}
      {label}
    </Link>
  );
}
