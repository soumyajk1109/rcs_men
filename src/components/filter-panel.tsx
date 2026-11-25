"use client"

import { sizeLabels } from "@/data/products"
import {
  hasActiveFilters,
  priceBands,
  type Filters,
} from "@/lib/catalog"
import { cn } from "@/lib/cn"

export function FilterPanel({
  idPrefix,
  filters,
  colours,
  onToggleSize,
  onToggleColour,
  onPrice,
  onAvailability,
  onClear,
}: {
  idPrefix: string
  filters: Filters
  colours: { id: string; name: string; hex: string }[]
  onToggleSize: (size: string) => void
  onToggleColour: (colourId: string) => void
  onPrice: (price: string | null) => void
  onAvailability: (value: Filters["availability"]) => void
  onClear: () => void
}) {
  const active = hasActiveFilters(filters)

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-medium">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizeLabels.map((size) => {
            const selected = filters.sizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleSize(size)}
                className={cn(
                  "min-h-11 min-w-11 border px-3 text-sm",
                  selected ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Colour</legend>
        <div className="mt-2 flex flex-col gap-2">
          {colours.map((colour) => {
            const selected = filters.colours.includes(colour.id)
            return (
              <button
                key={colour.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleColour(colour.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 border px-3 text-left text-sm",
                  selected ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-4 shrink-0 rounded-full border border-line"
                  style={{ backgroundColor: colour.hex }}
                />
                {colour.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Price</legend>
        <div className="mt-2 space-y-2">
          {priceBands.map((band) => {
            const inputId = `${idPrefix}-price-${band.id}`
            return (
              <label key={band.id} htmlFor={inputId} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  id={inputId}
                  type="radio"
                  name={`${idPrefix}-price`}
                  checked={filters.price === band.id}
                  onChange={() => onPrice(filters.price === band.id ? null : band.id)}
                />
                {band.label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${idPrefix}-stock`} className="flex min-h-11 items-center gap-2 text-sm">
          <input
            id={`${idPrefix}-stock`}
            type="checkbox"
            checked={filters.availability === "in-stock"}
            onChange={(event) => onAvailability(event.target.checked ? "in-stock" : "all")}
          />
          In stock
        </label>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!active}
        className="text-sm underline decoration-accent decoration-2 underline-offset-4 disabled:no-underline disabled:opacity-40"
      >
        Clear filters
      </button>
    </div>
  )
}
