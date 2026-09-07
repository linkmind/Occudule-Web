import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

type StoreBadgesProps = {
  size?: "sm" | "md";
  className?: string;
};

function ComingSoonPlay({ heightClass }: { heightClass: string }) {
  return (
    <div
      className={`inline-flex ${heightClass} items-center rounded-[7px] border border-white/15 bg-white/[0.06] px-3.5`}
      aria-label="Google Play coming soon"
    >
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium tracking-wide text-white/50">
          COMING SOON
        </span>
        <span className="text-sm font-semibold text-white">Google Play</span>
      </span>
    </div>
  );
}

export function StoreBadges({ size = "md", className = "" }: StoreBadgesProps) {
  const heightClass = size === "sm" ? "h-10" : "h-12";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-[7px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* Official Apple badge hosted locally so it is not re-encoded. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          width={180}
          height={40}
          className={`${heightClass} w-auto`}
        />
      </a>
      {PLAY_STORE_URL ? (
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-[7px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/badges/google-play-badge.svg"
            alt="Get it on Google Play"
            width={180}
            height={40}
            className={`${heightClass} w-auto`}
          />
        </a>
      ) : (
        <ComingSoonPlay heightClass={heightClass} />
      )}
    </div>
  );
}
