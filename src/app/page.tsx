"use client"

import Image from "next/image"
import Link from "next/link"
import type { Audience, Category, Product } from "@/data/products"
import { categoriesForAudience } from "@/lib/store-content"
import { useContent } from "@/components/content-provider"
import { HeroSlide } from "@/components/hero-slide"
import { ProductCard } from "@/components/product-card"
import { ProductImage } from "@/components/product-image"

function mixedArrivals(products: Product[], categoryList: Category[], limit = 8) {
  const groups: Record<Audience, Product[]> = { men: [], women: [], kids: [] }
  for (const product of products) {
    if (!product.newArrival) continue
    const audience = categoryList.find((category) => category.slug === product.category)?.audience
    if (!audience) continue
    groups[audience].push(product)
  }
  const order: Audience[] = ["men", "women", "kids"]
  const mixed: Product[] = []
  let step = 0
  while (mixed.length < limit && order.some((audience) => groups[audience].length > 0)) {
    const next = groups[order[step % order.length]].shift()
    if (next) mixed.push(next)
    step += 1
  }
  return mixed
}

export default function HomePage() {
  const { products, categories, exclusives } = useContent()
  const arrivals = mixedArrivals(products, categories)

  return (
    <>
      <HeroSlide />

      <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
        <h2 className="font-display text-3xl font-semibold uppercase text-[#e10600]">Categories</h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-8">
          {exclusives.map((item) => (
            <li key={item.audience} className="w-[min(100%,26rem)]">
              <Link href={item.href} className="group relative block">
                <div className="relative aspect-square overflow-hidden rounded-full bg-paper-deep">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 640px) 26rem, 90vw"
                    className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1.35,0.36,1)] group-hover:scale-[1.08]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pt-10 pb-6 text-center text-paper">
                    <span className="block font-display text-xl font-semibold uppercase leading-none sm:text-2xl">
                      {item.title}
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CollectionBand id="men-collection" title="Men collection" categories={categoriesForAudience(categories, "men")} />
      <CollectionBand id="women-collection" title="Women collection" categories={categoriesForAudience(categories, "women")} />

      <section className="mx-auto max-w-[1440px] px-4 pb-10 md:px-8 md:pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold uppercase text-[#e10600]">New arrivals</h2>
          <Link
            href="/collections?sort=newest"
            className="text-sm underline decoration-accent decoration-2 underline-offset-4"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {arrivals.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} priority={index < 2} pop smooth />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function CollectionBand({
  id,
  title,
  categories,
}: {
  id: string
  title: string
  categories: Category[]
}) {
  return (
    <section id={id} className="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-8 md:px-8 md:py-10">
      <h2 className="font-display text-3xl font-semibold uppercase text-[#e10600]">{title}</h2>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/collections/${category.slug}`} className="group relative block overflow-hidden rounded-xl">
              <ProductImage
                src={category.image}
                alt={category.imageAlt}
                sizes="(min-width: 1024px) 12vw, 30vw"
                pop
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-2 text-paper">
                <span className="block font-display text-sm font-semibold uppercase leading-none sm:text-base">
                  {category.name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
