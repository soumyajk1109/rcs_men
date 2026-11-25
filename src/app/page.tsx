import Link from "next/link"
import { categories, products } from "@/data/products"
import { HeroSlide } from "@/components/hero-slide"
import { ProductCard } from "@/components/product-card"
import { ProductImage } from "@/components/product-image"

export default function HomePage() {
  const arrivals = products.filter((product) => product.newArrival).slice(0, 8)

  return (
    <>
      <HeroSlide />

      <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
        <h2 className="font-display text-3xl font-semibold uppercase">Collections</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.slug}>
              <Link href={`/collections/${category.slug}`} className="group relative block">
                <ProductImage
                  src={category.image}
                  alt={category.imageAlt}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  pop
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-3 text-paper">
                  <span className="block font-display text-2xl font-semibold uppercase leading-none md:text-3xl">
                    {category.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-10 md:px-8 md:pb-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold uppercase">New arrivals</h2>
          <Link
            href="/collections?sort=newest"
            className="text-sm underline decoration-accent decoration-2 underline-offset-4"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
          {arrivals.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} priority={index < 2} pop />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
