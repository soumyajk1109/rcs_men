import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchFallback, SearchResults } from "@/components/search-results"

export const metadata: Metadata = {
  title: "Search",
  description: "Search Ranebennur Cloth Stores by product name or category.",
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  )
}
