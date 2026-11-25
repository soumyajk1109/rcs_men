"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, Search, ShoppingBag } from "lucide-react"
import { brand } from "@/config/brand"
import { categories } from "@/data/products"
import { cn } from "@/lib/cn"
import { currencies, setCurrency, useCurrency, type CurrencyCode } from "@/lib/currency"
import { useStore } from "@/lib/store"

const links = [
  ...categories.map((category) => ({
    href: `/collections/${category.slug}`,
    label: category.name,
  })),
  { href: "/collections", label: "All" },
]

export function Header({
  menuOpen,
  onMenu,
  onSearch,
  onCart,
}: {
  menuOpen: boolean
  onMenu: () => void
  onSearch: () => void
  onCart: () => void
}) {
  const pathname = usePathname()
  const currency = useCurrency()
  const { cartCount, wishlistCount } = useStore()
  const [lead, ...rest] = brand.wordmark.split(" ")

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-paper text-ink">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-3 md:px-8">
          <div className="flex items-center">
            <a
              href={brand.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="grid size-8 place-items-center"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                <path d="M14.5 8.5V6.8c0-.5.3-.8.8-.8h1.5V3.5h-2.2C12.2 3.5 11 5 11 7.1v1.4H9v2.5h2V20h2.7v-8.9h2.1l.4-2.6h-2.5z" />
              </svg>
            </a>
            <a
              href={brand.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-8 place-items-center"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.3 6.7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
            </a>
          </div>
          <label className="text-xs">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="h-8 bg-transparent pr-1"
            >
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="border-b-2 border-accent bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center px-3 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
        <button
          type="button"
          className="grid size-11 place-items-center lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={onMenu}
        >
          <Menu aria-hidden="true" size={20} />
        </button>
        <Link
          href="/"
          aria-label={brand.name}
          className="flex min-w-0 items-center gap-2"
        >
          <Image
            src="/brand/rcs-mark.png"
            alt=""
            width={96}
            height={60}
            className="h-10 w-auto sm:h-12"
          />
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold uppercase tracking-wide sm:text-3xl lg:text-4xl">
              {lead}
            </span>
            <span className="block font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper/75 sm:text-xs">
              {rest.join(" ")}
            </span>
          </span>
        </Link>
        </div>
        <nav aria-label="Categories" className="hidden items-center justify-center gap-6 lg:flex">
          {links.map((link) => {
            const active = link.href === "/collections" ? pathname === "/collections" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm text-paper/90 hover:text-paper",
                  active && "text-paper underline decoration-accent decoration-2 underline-offset-8",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center justify-end">
        <button type="button" className="grid size-11 place-items-center" aria-label="Search" onClick={onSearch}>
          <Search aria-hidden="true" size={20} />
        </button>
        <Link
          href="/wishlist"
          className="relative grid size-11 place-items-center"
          aria-label={`Wishlist, ${wishlistCount} saved`}
        >
          <Heart aria-hidden="true" size={20} />
          {wishlistCount > 0 ? (
            <span aria-hidden="true" className="absolute top-1 right-1 min-w-4 bg-accent px-1 text-center text-[10px] leading-4 text-paper">
              {wishlistCount}
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          className="relative grid size-11 place-items-center"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          onClick={onCart}
        >
          <ShoppingBag aria-hidden="true" size={20} />
          {cartCount > 0 ? (
            <span aria-hidden="true" className="absolute top-1 right-1 min-w-4 bg-accent px-1 text-center text-[10px] leading-4 text-paper">
              {cartCount}
            </span>
          ) : null}
        </button>
        </div>
      </div>
      </div>
    </header>
  )
}
