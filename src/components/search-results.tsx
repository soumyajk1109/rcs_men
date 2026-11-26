"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { searchProducts } from "@/lib/catalog"
import { useContent } from "@/components/content-provider"
import { plural } from "@/lib/format"
import { ProductCard } from "@/components/product-card"

export function SearchFallback() {
  return <p className="px-4 py-10 text-sm text-muted md:px-8">Loading search.</p>
}

function SearchForm({ initial }: { initial: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initial)

  return (
    <form
      className="mt-6 flex max-w-xl gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const next = value.trim()
        router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search")
      }}
    >
      <label htmlFor="catalog-search" className="sr-only">
        Search by product or category
      </label>
      <input
        id="catalog-search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tees, shirts, sets, outerwear"
        className="h-12 min-w-0 flex-1 border border-line bg-paper px-3 text-sm"
      />
      <button type="submit" className="h-12 bg-ink px-4 text-sm text-paper">
        Search
      </button>
    </form>
  )
}

export function SearchResults() {
  const params = useSearchParams()
  const { products, categories } = useContent()
  const query = params.get("q") ?? ""
  const results = searchProducts(products, categories, query)
  const trimmed = query.trim()

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
      <h1 className="font-display text-4xl font-semibold uppercase leading-none md:text-6xl">Search</h1>
      <SearchForm key={trimmed} initial={trimmed} />

      {!trimmed ? (
        <p className="mt-8 max-w-md text-sm text-muted">
          Search the catalog by product name or category.{" "}
          <Link href="/collections" className="underline decoration-accent decoration-2 underline-offset-4">
            Browse all products
          </Link>
        </p>
      ) : results.length === 0 ? (
        <div className="mt-8 max-w-md border border-line px-4 py-8">
          <p>No matches for “{trimmed}”.</p>
          <Link
            href="/collections"
            className="mt-4 inline-block text-sm underline decoration-accent decoration-2 underline-offset-4"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted" aria-live="polite">
            {plural(results.length, "result")} for “{trimmed}”
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {results.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
