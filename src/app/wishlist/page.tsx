import type { Metadata } from "next"
import { WishlistView } from "@/components/wishlist-view"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces saved from Ranebennur Cloth Stores.",
}

export default function WishlistPage() {
  return <WishlistView />
}
