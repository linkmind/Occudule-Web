import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LegalMarkdown } from "@/components/LegalMarkdown";

type LegalPageShellProps = {
  content: string;
};

export function LegalPageShell({ content }: LegalPageShellProps) {
  return (
    <>
      <Header />
      <main className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-gutter py-12 md:py-16">
          <Link
            href="/"
            className="text-sm font-medium text-primary/60 transition hover:text-primary"
          >
            ← Back to home
          </Link>
          <div className="mt-8">
            <LegalMarkdown content={content} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
