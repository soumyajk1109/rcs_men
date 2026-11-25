import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl font-semibold uppercase">Page not found</h1>
      <p className="mt-4 text-sm text-muted">That page is not in the store.</p>
      <Link
        href="/collections"
        className="mt-6 inline-block text-sm underline decoration-accent decoration-2 underline-offset-4"
      >
        Browse all products
      </Link>
    </div>
  )
}
