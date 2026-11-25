import type { Metadata } from "next"
import { Suspense } from "react"
import { Catalog, CatalogFallback } from "@/components/catalog"

export const metadata: Metadata = {
  title: "All products",
  description: "Every piece in the Ranebennur Cloth Stores preview.",
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <Catalog categorySlug={null} />
    </Suspense>
  )
}
