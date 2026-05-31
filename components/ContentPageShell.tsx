import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type ContentPageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ContentPageShell({ title, description, children }: ContentPageShellProps) {
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
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-lg leading-relaxed text-primary/75">{description}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
