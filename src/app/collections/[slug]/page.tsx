import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { categories } from "@/data/products"
import { getContent } from "@/lib/content-store"
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
  const content = await getContent()
  const category = content.categories.find((item) => item.slug === slug)
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
  const content = await getContent()
  const category = content.categories.find((item) => item.slug === slug)
  if (!category) notFound()
  return <Catalog categorySlug={category.slug} />
}
