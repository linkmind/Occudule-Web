import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

function textFromChildren(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromChildren).join("");
  if (typeof node === "object" && "props" in node) {
    return textFromChildren((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function headingId(children: ReactNode): string {
  return textFromChildren(children)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const components: Components = {
  h1: ({ children }) => (
    <h1
      id={headingId(children)}
      className="scroll-mt-28 text-gradient text-3xl font-semibold tracking-tight md:text-4xl"
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      id={headingId(children)}
      className="mt-10 scroll-mt-28 text-xl font-semibold tracking-tight text-white md:text-2xl"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mt-6 scroll-mt-28 text-lg font-semibold text-white/90">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 id={headingId(children)} className="mt-5 scroll-mt-28 text-base font-semibold text-white/90">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed text-white/65">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-accent/50 pl-4 text-white/70 italic">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }) =>
    src ? (
      // Markdown images are authored as /images/articles/... files in public/
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className="mt-6 h-auto w-full rounded-card border border-white/10"
      />
    ) : null,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-white/65">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-white/65">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  hr: () => <hr className="my-8 border-white/10" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-card border border-white/10">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-white/10 px-4 py-3 font-semibold text-white">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-white/10 px-4 py-3 text-white/65">{children}</td>
  ),
};

type LegalMarkdownProps = {
  content: string;
};

export function LegalMarkdown({ content }: LegalMarkdownProps) {
  return (
    <article className="legal-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
