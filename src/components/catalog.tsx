"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { getCategory, productsInCategory } from "@/data/products"
import {
  applyFilters,
  colourChoices,
  hasActiveFilters,
  parseFilters,
  sortOptions,
  type Filters,
  type SortKey,
} from "@/lib/catalog"
import { plural } from "@/lib/format"
import { Dialog } from "@/components/dialog"
import { FilterPanel } from "@/components/filter-panel"
import { ProductCard } from "@/components/product-card"

export function CatalogFallback() {
  return <p className="px-4 py-10 text-sm text-muted md:px-8">Loading products.</p>
}

export function Catalog({ categorySlug }: { categorySlug: string | null }) {
  const category = categorySlug ? getCategory(categorySlug) : undefined
  const source = productsInCategory(categorySlug)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = parseFilters(searchParams)
  const results = applyFilters(source, filters)
  const colours = colourChoices(source)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const active = hasActiveFilters(filters)

  function write(next: URLSearchParams) {
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function updateList(key: "size" | "colour", value: string) {
    const next = new URLSearchParams(searchParams.toString())
    const current = (next.get(key) ?? "").split(",").map((item) => item.trim()).filter(Boolean)
    const values = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    if (values.length) next.set(key, values.join(","))
    else next.delete(key)
    write(next)
  }

  function updatePrice(price: string | null) {
    const next = new URLSearchParams(searchParams.toString())
    if (price) next.set("price", price)
    else next.delete("price")
    write(next)
  }

  function updateAvailability(value: Filters["availability"]) {
    const next = new URLSearchParams(searchParams.toString())
    if (value === "in-stock") next.set("availability", "in-stock")
    else next.delete("availability")
    write(next)
  }

  function updateSort(sort: SortKey) {
    const next = new URLSearchParams(searchParams.toString())
    if (sort === "featured") next.delete("sort")
    else next.set("sort", sort)
    write(next)
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams.toString())
    next.delete("size")
    next.delete("colour")
    next.delete("price")
    next.delete("availability")
    write(next)
  }

  const panelProps = {
    filters,
    colours,
    onToggleSize: (size: string) => updateList("size", size),
    onToggleColour: (colourId: string) => updateList("colour", colourId),
    onPrice: updatePrice,
    onAvailability: updateAvailability,
    onClear: clearFilters,
  }

  const title = category?.name ?? "All products"
  const countLabel = plural(results.length, "product")

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold uppercase leading-none md:text-6xl">
          {title}
        </h1>
        {category ? <p className="mt-3 text-sm text-muted">{category.blurb}</p> : null}
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 border border-line px-3 text-sm lg:hidden"
          aria-expanded={filtersOpen}
          aria-controls="filter-drawer"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal aria-hidden="true" size={16} />
          Filters{active ? ` (${filters.sizes.length + filters.colours.length + (filters.price ? 1 : 0) + (filters.availability === "in-stock" ? 1 : 0)})` : ""}
        </button>
        <label className="ml-auto flex min-h-11 items-center gap-2 text-sm">
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => updateSort(event.target.value as SortKey)}
            className="h-11 border border-line bg-paper px-2"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {countLabel}
      </p>

      <div className="mt-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <h2 className="font-display text-2xl font-semibold uppercase">Filters</h2>
          <div className="mt-4">
            <FilterPanel idPrefix="desktop" {...panelProps} />
          </div>
        </aside>
        {results.length === 0 ? (
          <div className="border border-line px-4 py-10">
            <p className="text-sm">No products match these filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm underline decoration-accent decoration-2 underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3">
            {results.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} priority={index < 2} pop />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog
        id="filter-drawer"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="right"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 px-4 py-4">
            <FilterPanel idPrefix="mobile" {...panelProps} />
          </div>
          <div className="sticky bottom-0 border-t border-line bg-paper p-4">
            <button
              type="button"
              className="h-12 w-full bg-ink text-sm text-paper"
              onClick={() => setFiltersOpen(false)}
            >
              Show {countLabel}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
