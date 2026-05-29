import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ContentPageShell";

export const metadata: Metadata = {
  title: "Contact — Occudule",
  description: "Contact Outvblue Technology Inc. and the Occudule team.",
};

export default function ContactPage() {
  return (
    <ContentPageShell
      title="Contact"
      description="Reach the Occudule team for support, partnerships, or general questions."
    >
      <div className="space-y-6 text-primary/80">
        <p>
          <span className="font-semibold text-primary">Email:</span>{" "}
          <a
            href="mailto:support@occudule.com"
            className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
          >
            support@occudule.com
          </a>
        </p>
        <address className="not-italic leading-relaxed">
          <span className="font-semibold text-primary">Outvblue Technology Inc.</span>
          <br />
          Suite 500, 7030 Woodbine Avenue
          <br />
          Markham, Ontario L3R 6G2
          <br />
          Canada
        </address>
      </div>
    </ContentPageShell>
  );
}
