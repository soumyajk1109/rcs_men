import type { Metadata } from "next"
import { CartView } from "@/components/cart-view"

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the pieces in your Ranebennur cart.",
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
      <h1 className="font-display text-4xl font-semibold uppercase leading-none md:text-6xl">Cart</h1>
      <div className="mt-6">
        <CartView />
      </div>
    </div>
  )
}
