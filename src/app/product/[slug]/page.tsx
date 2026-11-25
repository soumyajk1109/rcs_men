import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getProductBySlug, getRelated, products } from "@/data/products"
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
  const product = getProductBySlug(slug)
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
  const product = getProductBySlug(slug)
  if (!product) notFound()

  return <ProductDetail product={product} related={getRelated(product)} />
}
