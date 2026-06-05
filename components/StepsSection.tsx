import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";

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
    step: "01",
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
    step: "02",
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
    step: "03",
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
    <div className="grid gap-3 sm:grid-cols-2">
      <article className="glass-card p-5">
        <Image
          src="/microsoft-logo.png"
          alt="Microsoft"
          width={120}
          height={24}
          className="h-6 w-auto object-contain object-left brightness-0 invert"
        />
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Outlook, Live, MSN, and Hotmail—connect once for automatic scanning and analysis.
        </p>
      </article>
      <article className="glass-card p-5">
        <Image
          src="/google-logo.png"
          alt="Google"
          width={96}
          height={32}
          className="h-8 w-auto object-contain object-left"
        />
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Add your Occudule forwarding address and forward child-related emails with a single tap.
        </p>
      </article>
    </div>
  );
}

function ProcessingVisual() {
  return (
    <div className="glass-card p-5" aria-hidden>
      <p className="text-xs font-medium tracking-wide text-white/45">[ DUAL STREAMS ]</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { label: "Events", tone: "from-accent/50 to-accent" },
          { label: "Info", tone: "from-success/50 to-success" },
        ].map((stream) => (
          <div key={stream.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-semibold text-white">{stream.label}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full w-3/4 rounded-full bg-gradient-to-r ${stream.tone}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["To-do", "Calendar", "Info card", "Draft reply"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExecutionVisual() {
  return (
    <div className="glass-card p-5" aria-hidden>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>Family hub</span>
        <span className="rounded-full border border-cta/30 bg-cta/10 px-2 py-0.5 text-cta">
          Reminder · 2 days
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {[
          { title: "Soccer practice", meta: "Thu · 4:30 PM" },
          { title: "Permission slip due", meta: "Fri · Science trip" },
          { title: "Piano recital", meta: "Sat · 2:00 PM" },
        ].map((item) => (
          <li key={item.title} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="text-xs text-white/50">{item.meta}</p>
          </li>
        ))}
      </ul>
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
      className="section-gradient py-section"
      aria-labelledby="steps-heading"
    >
      <div className="relative mx-auto max-w-content px-gutter">
        <div className="md:sticky md:top-0 md:z-10 md:flex md:h-[40vh] md:items-center md:justify-center md:py-8">
          <div className="mx-auto text-center">
            <SectionHeader
              label="HOW IT WORKS"
              title="From inbox chaos to a calm family hub in three steps"
              titleId="steps-heading"
            />
          </div>
        </div>

        <ol className="relative mt-8 space-y-6 md:mt-0 md:space-y-8">
          {steps.map((s) => (
            <li key={s.step}>
              <article className="glass-card overflow-hidden lg:grid lg:grid-cols-[1fr,minmax(280px,38%)] lg:gap-0">
                <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-medium tracking-wide text-white/45">
                      [ {s.step} ]
                    </p>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {s.title}
                  </h3>
                  <ul className="mt-6 space-y-5">
                    {s.nodes.map((node) => (
                      <li key={node.title}>
                        <h4 className="text-sm font-semibold text-white/90">{node.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-white/55">{node.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-background-card/50 p-6 md:p-8">
                  <StepVisual variant={s.visual} />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
