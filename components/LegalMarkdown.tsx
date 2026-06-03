import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-gradient text-3xl font-semibold tracking-tight md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-xl font-semibold tracking-tight text-white md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-lg font-semibold text-white/90">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed text-white/65">{children}</p>,
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
