const posts = [
  {
    date: "February 17, 2026",
    title: "Why parents still lose hours to email in 2026",
    read: "11 min read",
  },
  {
    date: "February 10, 2026",
    title: "Designing AI that respects school privacy norms",
    read: "9 min read",
  },
  {
    date: "February 3, 2026",
    title: "Batching household admin without missing deadlines",
    read: "8 min read",
  },
];

export function ArticlesSection() {
  return (
    <section
      id="articles"
      className="border-b border-border bg-surface-muted py-section"
      aria-labelledby="articles-heading"
    >
      <div className="mx-auto max-w-content px-gutter">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary/50">
          Articles
        </p>
        <h2
          id="articles-heading"
          className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold tracking-tight text-primary md:text-4xl"
        >
          Latest thoughts on family productivity
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-primary/70">
          Strategies, product notes, and honest takes on where AI helps—and where it should stay
          quiet.
        </p>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.title}>
              <article className="group flex h-full flex-col rounded-card border border-border bg-surface p-6 shadow-card transition hover:border-primary/20 hover:shadow-lg">
                <p className="text-xs font-medium uppercase tracking-wide text-primary/45">
                  {post.date}
                </p>
                <h3 className="mt-3 flex-1 text-lg font-semibold tracking-tight text-primary group-hover:text-primary/90">
                  <a href="#articles" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {post.title}
                  </a>
                </h3>
                <p className="mt-4 text-sm text-primary/55">{post.read}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
