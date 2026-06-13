import { FamilyHubDemo } from "@/components/FamilyHubDemo";
import { GmailSetupDemo } from "@/components/GmailSetupDemo";
import { MicrosoftSetupDemo } from "@/components/MicrosoftSetupDemo";
import { ProcessingDemo } from "@/components/ProcessingDemo";
import { RemindersDemo } from "@/components/RemindersDemo";
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

function ConnectProviderVisual({ nodes }: { nodes: ContentNode[] }) {
  const [microsoft, gmail] = nodes;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <MicrosoftSetupDemo layout="full" title={microsoft.title} body={microsoft.body} />
      <GmailSetupDemo layout="full" title={gmail.title} body={gmail.body} />
    </div>
  );
}

function ExecutionVisual({ nodes }: { nodes: ContentNode[] }) {
  const [reminders, familyHub] = nodes;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      <RemindersDemo layout="full" title={reminders.title} body={reminders.body} />
      <FamilyHubDemo layout="full" title={familyHub.title} body={familyHub.body} />
    </div>
  );
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
              {s.visual === "providers" ? (
                <article className="glass-card overflow-hidden">
                  <div className="p-6 md:p-8">
                    <p className="text-xs font-medium tracking-wide text-white/45">
                      [ {s.step} ]
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {s.title}
                    </h3>
                  </div>
                  <div className="border-t border-white/10 bg-background-card/50 p-6 md:p-8">
                    <ConnectProviderVisual nodes={s.nodes} />
                  </div>
                </article>
              ) : s.visual === "processing" ? (
                <article className="glass-card overflow-hidden lg:grid lg:grid-cols-[1fr,auto] lg:items-center lg:gap-0">
                  <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                    <p className="text-xs font-medium tracking-wide text-white/45">
                      [ {s.step} ]
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {s.title}
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {s.nodes.map((node) => (
                        <li key={node.title}>
                          <h4 className="text-sm font-semibold text-white/90">{node.title}</h4>
                          <p className="mt-1.5 text-sm leading-snug text-white/55">{node.body}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center bg-background-card/50 p-4 sm:p-5">
                    <ProcessingDemo />
                  </div>
                </article>
              ) : (
                <article className="glass-card overflow-hidden">
                  <div className="p-6 md:p-8">
                    <p className="text-xs font-medium tracking-wide text-white/45">
                      [ {s.step} ]
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {s.title}
                    </h3>
                  </div>
                  <div className="border-t border-white/10 bg-background-card/50 p-6 md:p-8">
                    <ExecutionVisual nodes={s.nodes} />
                  </div>
                </article>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
