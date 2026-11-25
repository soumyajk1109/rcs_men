"use client"

import Link from "next/link"
import { Minus, Plus } from "lucide-react"
import { colourById } from "@/data/products"
import { lineLabel, lineProduct, useStore, type CartLine } from "@/lib/store"
import { Price } from "@/components/price"
import { ProductImage } from "@/components/product-image"

function stockOf(line: CartLine) {
  const product = lineProduct(line)
  if (!product) return 0
  const colour = colourById(product, line.colourId)
  if (colour.id !== line.colourId) return 0
  return colour.sizes.find((size) => size.label === line.size)?.stock ?? 0
}

export function CartView({ compact = false }: { compact?: boolean }) {
  const { lines, setQuantity, removeLine, subtotal } = useStore()
  const visible = lines.filter((line) => lineProduct(line))

  if (visible.length === 0) {
    return (
      <div className={compact ? "px-4 py-8" : "py-8"}>
        <p>Your cart is empty.</p>
        <Link
          href="/collections?sort=newest"
          className="mt-4 inline-block text-sm underline decoration-accent decoration-2 underline-offset-4"
        >
          Browse new arrivals
        </Link>
      </div>
    )
  }

  return (
    <div className={compact ? "" : "space-y-8"}>
      <ul className={compact ? "divide-y divide-line" : "divide-y divide-line border-y border-line"}>
        {visible.map((line) => {
          const product = lineProduct(line)
          if (!product) return null
          const colour = product.colours.find((item) => item.id === line.colourId)
          const image = colour?.images[0]
          const label = lineLabel(line)
          const stock = stockOf(line)
          return (
            <li key={`${line.productId}:${line.colourId}:${line.size}`} className="flex gap-3 py-4">
              {image ? (
                <Link href={`/product/${product.slug}`} className="w-20 shrink-0 sm:w-24">
                  <ProductImage src={image.src} alt={image.alt} sizes="96px" />
                </Link>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium">
                      <Link href={`/product/${product.slug}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {colour?.name} / {line.size}
                    </p>
                  </div>
                  <Price amount={product.price * line.quantity} className="text-sm" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center border border-line">
                    <button
                      type="button"
                      className="grid size-11 place-items-center"
                      aria-label={`Decrease quantity of ${label}`}
                      onClick={() => setQuantity(line, line.quantity - 1)}
                    >
                      <Minus aria-hidden="true" size={14} />
                    </button>
                    <span className="min-w-8 text-center text-sm tabular-nums">{line.quantity}</span>
                    <button
                      type="button"
                      className="grid size-11 place-items-center disabled:opacity-40"
                      aria-label={`Increase quantity of ${label}`}
                      disabled={line.quantity >= stock}
                      onClick={() => setQuantity(line, line.quantity + 1)}
                    >
                      <Plus aria-hidden="true" size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-sm underline decoration-accent decoration-2 underline-offset-4"
                    onClick={() => removeLine(line)}
                  >
                    <span className="sr-only">Remove {label}</span>
                    <span aria-hidden="true">Remove</span>
                  </button>
                </div>
                {line.quantity >= stock && stock > 0 ? (
                  <p className="mt-2 text-xs text-muted">{stock} available</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
      <div className={compact ? "border-t border-line px-4 py-4" : ""}>
        <div className="flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <Price amount={subtotal} className="font-medium" />
        </div>
        <p className="mt-2 text-sm text-muted">Checkout is not part of this demo.</p>
        {compact ? (
          <Link
            href="/cart"
            className="mt-4 flex h-12 items-center justify-center bg-ink text-sm text-paper"
          >
            View cart
          </Link>
        ) : null}
      </div>
    </div>
  )
}
