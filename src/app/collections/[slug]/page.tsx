import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { categories, getCategory } from "@/data/products"
import { Catalog, CatalogFallback } from "@/components/catalog"

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return { title: "Collection" }
  return {
    title: category.name,
    description: category.blurb,
  }
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CollectionRoute params={params} />
    </Suspense>
  )
}

async function CollectionRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()
  return <Catalog categorySlug={category.slug} />
}
