"use client"

import { cn } from "@/lib/cn"
import type { ProductColour, SizeStock } from "@/data/products"

export function ColourSelector({
  colours,
  value,
  onChange,
}: {
  colours: ProductColour[]
  value: string
  onChange: (colourId: string) => void
}) {
  const selected = colours.find((colour) => colour.id === value)
  return (
    <fieldset>
      <legend className="text-sm">
        Colour <span className="font-medium text-ink">{selected?.name}</span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {colours.map((colour) => {
          const active = colour.id === value
          return (
            <button
              key={colour.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(colour.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 border px-3 text-sm",
                active ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink",
              )}
            >
              <span
                aria-hidden="true"
                className="size-4 rounded-full border border-line"
                style={{ backgroundColor: colour.hex }}
              />
              {colour.name}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function SizeSelector({
  sizes,
  value,
  onChange,
}: {
  sizes: SizeStock[]
  value: string | null
  onChange: (size: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Size</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const unavailable = size.stock < 1
          const active = value === size.label
          return (
            <button
              key={size.label}
              type="button"
              aria-pressed={active}
              disabled={unavailable}
              aria-label={unavailable ? `${size.label}, sold out` : size.label}
              onClick={() => onChange(size.label)}
              className={cn(
                "min-h-11 min-w-11 border px-3 text-sm",
                active && "border-ink bg-ink text-paper",
                !active && !unavailable && "border-line bg-paper hover:border-ink",
                unavailable && "border-line text-muted line-through",
              )}
            >
              {size.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
