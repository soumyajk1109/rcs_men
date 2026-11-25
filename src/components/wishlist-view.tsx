"use client"

import Link from "next/link"
import { getProductById } from "@/data/products"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"

export function WishlistView() {
  const { wishlistIds } = useStore()
  const saved = wishlistIds
    .map((id) => getProductById(id))
    .filter((product) => product !== undefined)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-8">
      <h1 className="font-display text-4xl font-semibold uppercase leading-none md:text-6xl">Wishlist</h1>
      {saved.length === 0 ? (
        <div className="mt-8 max-w-md border border-line px-4 py-8">
          <p>Nothing saved yet.</p>
          <Link
            href="/collections"
            className="mt-4 inline-block text-sm underline decoration-accent decoration-2 underline-offset-4"
          >
            Shop all products
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
          {saved.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
