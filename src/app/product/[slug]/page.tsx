import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { products } from "@/data/products"
import { getContent } from "@/lib/content-store"
import { ProductDetail } from "@/components/product-detail"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const content = await getContent()
  const product = content.products.find((item) => item.slug === slug)
  if (!product) return { title: "Product" }
  return {
    title: product.name,
    description: product.description,
  }
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm text-muted md:px-8">Loading product.</p>}>
      <ProductRoute params={params} />
    </Suspense>
  )
}

async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = await getContent()
  const product = content.products.find((item) => item.slug === slug)
  if (!product) notFound()
  const related = content.products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
