type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  titleId?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  titleId,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <header className={`max-w-3xl ${alignClass}`}>
      <p className="text-xs font-medium tracking-wide text-white/45">
        [ {label} ]
      </p>
      <h2
        id={titleId}
        className="text-gradient mt-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed text-white/60 md:text-lg ${alignClass}`}>
          {description}
        </p>
      ) : null}
    </header>
  );
}
