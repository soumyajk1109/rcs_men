export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-4xl font-semibold uppercase">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-7">{children}</div>
    </article>
  )
}
