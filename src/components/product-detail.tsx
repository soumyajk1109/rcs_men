"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { colourById, getCategory, type Product } from "@/data/products"
import { getSizeGuide } from "@/data/size-guides"
import { useStore } from "@/lib/store"
import { Dialog } from "@/components/dialog"
import { Price } from "@/components/price"
import { ProductCard } from "@/components/product-card"
import { ProductImage } from "@/components/product-image"
import { ColourSelector, SizeSelector } from "@/components/variant-selector"

export function ProductDetail({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const { addItem, setCartOpen, isWishlisted, toggleWishlist } = useStore()
  const [colourId, setColourId] = useState(product.colours[0]?.id ?? "")
  const [size, setSize] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)
  const [error, setError] = useState("")
  const colour = colourById(product, colourId)
  const images = colour?.images ?? []
  const image = images[Math.min(imageIndex, Math.max(images.length - 1, 0))]
  const selectedSize = colour?.sizes.find((item) => item.label === size)
  const colourSoldOut = colour ? colour.sizes.every((item) => item.stock < 1) : true
  const saved = isWishlisted(product.id)
  const guide = getSizeGuide(product.category)

  function selectColour(nextId: string) {
    setColourId(nextId)
    setImageIndex(0)
    setError("")
    const next = product.colours.find((item) => item.id === nextId)
    if (size && !next?.sizes.some((item) => item.label === size && item.stock > 0)) {
      setSize(null)
    }
  }

  function addToCart() {
    if (!colour || !size || !selectedSize || selectedSize.stock < 1) {
      setError(colourSoldOut ? "This colour is sold out." : "Choose an available size.")
      return
    }
    const added = addItem(product.id, colour.id, size)
    if (!added) {
      setError("That size is no longer available.")
      return
    }
    setError("")
    setCartOpen(true)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
      <p className="text-sm text-muted">
        <Link href={`/collections/${product.category}`} className="underline decoration-accent decoration-2 underline-offset-4">
          {getCategory(product.category)?.name}
        </Link>
      </p>
      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          {image ? (
            <ProductImage
              src={image.src}
              alt={image.alt}
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          ) : null}
          {images.length > 1 ? (
            <ul className="mt-3 flex gap-2">
              {images.map((item, index) => (
                <li key={item.src}>
                  <button
                    type="button"
                    aria-pressed={index === imageIndex}
                    aria-label={`Show image ${index + 1} of ${images.length}`}
                    onClick={() => setImageIndex(index)}
                    className={index === imageIndex ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : ""}
                  >
                    <ProductImage src={item.src} alt="" sizes="80px" className="w-16" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div>
          <h1 className="font-display text-4xl font-semibold uppercase leading-none md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg">
            <Price amount={product.price} />
          </p>
          <p className="mt-4 max-w-prose text-sm leading-6 text-muted">{product.description}</p>

          <div className="mt-6 space-y-5">
            <ColourSelector colours={product.colours} value={colour?.id ?? ""} onChange={selectColour} />
            {colour ? (
              <SizeSelector
                sizes={colour.sizes}
                value={size}
                onChange={(next) => {
                  setSize(next)
                  setError("")
                }}
              />
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">
                {colourSoldOut
                  ? "This colour is sold out."
                  : selectedSize
                    ? selectedSize.stock > 0
                      ? `${selectedSize.stock} available in ${selectedSize.label}`
                      : `${selectedSize.label} is sold out.`
                    : "Select a size to see availability."}
              </p>
              <button
                type="button"
                className="text-sm underline decoration-accent decoration-2 underline-offset-4"
                onClick={() => setGuideOpen(true)}
              >
                Size guide
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addToCart}
                className="h-12 flex-1 bg-ink text-sm text-paper hover:bg-accent"
              >
                Add to cart
              </button>
              <button
                type="button"
                className="grid size-12 place-items-center border border-line"
                aria-pressed={saved}
                aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart
                  aria-hidden="true"
                  size={18}
                  className={saved ? "fill-accent text-accent" : "text-ink"}
                />
              </button>
            </div>
            {error ? (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            ) : null}
          </div>

          <section className="mt-8 border-t border-line pt-6">
            <h2 className="text-sm font-medium">Fabric and care</h2>
            <p className="mt-2 text-sm">{product.fabric}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {product.care.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl font-semibold uppercase">Related</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Dialog open={guideOpen} onClose={() => setGuideOpen(false)} title="Size guide" side="center">
        <div className="px-4 py-4">
          <p className="text-sm text-muted">{guide.note}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 pr-3 font-medium">Size</th>
                  {guide.columns.map((column) => (
                    <th key={column} scope="col" className="py-2 pr-3 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <th scope="row" className="py-2 pr-3 font-medium">{row.size}</th>
                    {row.values.map((value, index) => (
                      <td key={`${row.size}-${guide.columns[index]}`} className="py-2 pr-3 tabular-nums">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
