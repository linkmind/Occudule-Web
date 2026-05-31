import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-xl font-semibold tracking-tight text-primary md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-lg font-semibold text-primary">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed text-primary/80">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-primary/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-primary/80">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
  hr: () => <hr className="my-8 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto rounded-card border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface-muted">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-3 font-semibold text-primary">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-4 py-3 text-primary/80">{children}</td>
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
