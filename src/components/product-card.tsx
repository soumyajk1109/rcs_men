"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { isProductSoldOut, type Product } from "@/data/products"
import { cn } from "@/lib/cn"
import { useStore } from "@/lib/store"
import { Price } from "@/components/price"
import { ProductImage } from "@/components/product-image"

export function ProductCard({
  product,
  priority = false,
  pop = false,
  smooth = false,
}: {
  product: Product
  priority?: boolean
  pop?: boolean
  smooth?: boolean
}) {
  const { isWishlisted, toggleWishlist } = useStore()
  const saved = isWishlisted(product.id)
  const image = product.colours[0]?.images[0]
  const soldOut = isProductSoldOut(product)

  if (!image) return null

  return (
    <article className="group">
      <div className={cn("relative", smooth && "overflow-hidden rounded-xl")}>
        <Link href={`/product/${product.slug}`} className="block">
          <ProductImage src={image.src} alt={image.alt} priority={priority} pop={pop} />
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 grid size-11 place-items-center bg-paper/90"
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
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-5">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">{product.colours.map((colour) => colour.name).join(", ")}</p>
        <p className="text-sm">
          <Price amount={product.price} />
          {soldOut ? <span className="ml-2 text-muted">Sold out</span> : null}
        </p>
      </div>
    </article>
  )
}
