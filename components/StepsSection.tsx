import Image from "next/image";

type ContentNode = {
  title: string;
  body: string;
};

type Step = {
  step: string;
  title: string;
  nodes: ContentNode[];
  visual: "providers" | "processing" | "execution";
};

const steps: Step[] = [
  {
    step: "1",
    title: "Connect your provider",
    visual: "providers",
    nodes: [
      {
        title: "Microsoft accounts (Outlook, Live, MSN, Hotmail)",
        body: "Connect your account securely just once. Occudule will automatically scan and analyze incoming messages.",
      },
      {
        title: "Gmail accounts",
        body: "Simply add your unique Occudule forwarding address to your contacts and forward your child-related emails with a single tap.",
      },
    ],
  },
  {
    step: "2",
    title: "Intelligent processing & analysis",
    visual: "processing",
    nodes: [
      {
        title: "Smart scoring system",
        body: "Occudule filters through the noise, instantly identifying emails from schools, teams, or academies based on a proprietary smart scoring system.",
      },
      {
        title: "Dual-categorization",
        body: "Messages are stripped of clutter, summarized, and cleanly organized into two intuitive streams: Events (time-sensitive schedules) and Info (reference material).",
      },
      {
        title: "Actionable data extraction",
        body: "Key details are analyzed and automatically grouped to generate ready-to-use to-do lists, calendar events, reference info cards, and smart email replies.",
      },
    ],
  },
  {
    step: "3",
    title: "Automated execution",
    visual: "execution",
    nodes: [
      {
        title: "Proactive reminders",
        body: "Receive timely, automated alerts for upcoming events and critical deadlines before they sneak up on you.",
      },
      {
        title: "A centralized family hub",
        body: "Your entire household's logistics live in one secure, unified space. Say goodbye to scattered apps, manual calendar entries, and messy copy-pasting.",
      },
    ],
  },
];

function ProviderCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-card border border-border bg-surface p-6 shadow-card">
        <div className="flex h-10 items-center">
          <Image
            src="/microsoft-logo.png"
            alt="Microsoft"
            width={120}
            height={24}
            className="h-6 w-auto object-contain object-left"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-primary/70">
          Outlook, Live, MSN, and Hotmail—connect once for automatic scanning and analysis.
        </p>
      </article>
      <article className="rounded-card border border-border bg-surface p-6 shadow-card">
        <div className="flex h-10 items-center">
          <Image
            src="/google-logo.png"
            alt="Google"
            width={96}
            height={32}
            className="h-8 w-auto object-contain object-left"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-primary/70">
          Add your Occudule forwarding address and forward child-related emails with a single tap.
        </p>
      </article>
    </div>
  );
}

function ProcessingVisual() {
  const streams = [
    { label: "Events", count: 12, tone: "from-accent/40 to-accent" },
    { label: "Info", count: 8, tone: "from-success/40 to-success" },
  ];

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-gradient-to-br from-primary to-primary/90 p-6 text-surface shadow-card"
      aria-hidden
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
        Dual streams
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {streams.map((stream) => (
          <div key={stream.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{stream.label}</span>
              <span className="text-xs text-white/60">{stream.count} items</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full w-3/4 rounded-full bg-gradient-to-r ${stream.tone}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-2 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
        <p className="text-xs font-medium text-success">Extracted</p>
        <div className="flex flex-wrap gap-2">
          {["To-do", "Calendar", "Info card", "Draft reply"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExecutionVisual() {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-gradient-to-br from-primary to-primary/90 p-6 text-surface shadow-card"
      aria-hidden
    >
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Family hub</span>
        <span className="rounded-full bg-cta/20 px-2 py-0.5 font-medium text-cta">
          Reminder · 2 days
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {[
          { title: "Soccer practice", meta: "Thu · 4:30 PM · Riverside Field" },
          { title: "Permission slip due", meta: "Fri · Science museum trip" },
          { title: "Piano recital", meta: "Sat · 2:00 PM · Community hall" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white/10 p-3 backdrop-blur-sm"
          >
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-xs text-white/60">{item.meta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepVisual({ variant }: { variant: Step["visual"] }) {
  if (variant === "providers") return <ProviderCards />;
  if (variant === "processing") return <ProcessingVisual />;
  return <ExecutionVisual />;
}

export function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border bg-surface py-section"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          How it works
        </p>
        <h2
          id="steps-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          From inbox chaos to a calm family hub in three steps
        </h2>

        <ol className="mt-16 space-y-20 md:space-y-24">
          {steps.map((s, i) => (
            <li key={s.step}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Step — {s.step}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-primary md:text-3xl">
                    {s.title}
                  </h3>
                  <ul className="mt-6 space-y-5">
                    {s.nodes.map((node) => (
                      <li key={node.title}>
                        <h4 className="text-base font-semibold text-primary">{node.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-primary/75">{node.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <StepVisual variant={s.visual} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
