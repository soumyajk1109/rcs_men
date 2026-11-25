import Link from "next/link"
import { brand } from "@/config/brand"
import { categories } from "@/data/products"
import { photoCreditNote } from "@/data/image-credits"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-semibold uppercase leading-none">{brand.wordmark}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {categories.map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          ))}
          <Link href="/collections" className="hover:underline">
            All products
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-[1440px] px-4 pb-6 text-xs text-muted md:px-8">{photoCreditNote}</p>
    </footer>
  )
}
