"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Heart, Menu, Search, ShoppingBag } from "lucide-react"
import { brand } from "@/config/brand"
import { categories } from "@/data/products"
import { cn } from "@/lib/cn"
import { currencies, setCurrency, useCurrency, type CurrencyCode } from "@/lib/currency"
import { useStore } from "@/lib/store"

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
  const mensRef = useRef<HTMLDivElement>(null)
  const [mensPinned, setMensPinned] = useState(false)
  const [mensHovered, setMensHovered] = useState(false)
  const mensOpen = mensPinned || mensHovered
  const [menuPath, setMenuPath] = useState(pathname)
  const [notice, setNotice] = useState(0)
  const announcement = brand.announcements[notice] ?? brand.announcements[0]
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMensPinned(false)
    setMensHovered(false)
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches || brand.announcements.length < 2) return
    const timer = window.setInterval(() => {
      setNotice((current) => (current + 1) % brand.announcements.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!mensPinned) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMensPinned(false)
    }
    function onPointer(event: PointerEvent) {
      if (!mensRef.current?.contains(event.target as Node)) setMensPinned(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [mensPinned])

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-paper text-accent">
        <div className="mx-auto grid h-9 max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 md:px-8">
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
            <span className="grid size-8 place-items-center" aria-hidden="true">
              <svg viewBox="0 0 64 40" className="h-5 w-7 text-accent">
                <path
                  d="M8 16h7.5L29 8.5v23L15.5 24H8a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3z"
                  fill="#f7f4ef"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path d="M16.2 15.2 27.6 10.2v19.6L16.2 24.8z" fill="currentColor" opacity="0.08" />
                <path d="M18.4 14.2 23.2 12.2v15.6l-4.8-2z" fill="#8d3a3a" />
                <ellipse cx="30.2" cy="20" rx="3.3" ry="7.4" fill="currentColor" />
                <path
                  d="M11.2 24.5c.4 3.2 1.2 5.4.2 8.2-1.2.6-2.6-.8-2.2-2.6.5-2.4.8-3.8 2-5.6z"
                  fill="#f7f4ef"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path className="announcement-wave" d="M38 14.5c2.2 1.6 3.4 3.5 3.4 5.5s-1.2 3.9-3.4 5.5" />
                  <path className="announcement-wave announcement-wave-late" d="M43.5 11c3.2 2.4 5 5.2 5 9s-1.8 6.6-5 9" />
                  <path className="announcement-wave" d="M49 8.2c4 3 6.2 6.6 6.2 11.8S53 28.8 49 31.8" />
                </g>
              </svg>
            </span>
          </div>
          <p className="truncate text-center text-[11px] leading-none sm:text-xs" aria-live="polite">
            {announcement.text}
            {"cta" in announcement && announcement.cta && "href" in announcement && announcement.href ? (
              <>
                {" "}
                <Link href={announcement.href} className="underline decoration-accent decoration-2 underline-offset-2">
                  {announcement.cta}
                </Link>
              </>
            ) : null}
          </p>
          <label className="text-xs">
            <span className="sr-only">Currency</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="h-8 bg-transparent pr-1 text-accent"
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
            src="/brand/rcs-mark-gold.png"
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
        <nav aria-label="Categories" className="hidden items-center justify-center gap-8 lg:flex">
          <div
            ref={mensRef}
            className="relative"
            onMouseEnter={() => setMensHovered(true)}
            onMouseLeave={() => setMensHovered(false)}
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 py-2 text-sm text-paper/90 hover:text-paper",
                pathname.startsWith("/collections") &&
                  "text-paper underline decoration-accent decoration-2 underline-offset-8",
              )}
              aria-expanded={mensOpen}
              aria-controls="mens-menu"
              onClick={() => setMensPinned((open) => !open)}
            >
              Men&apos;s
              <ChevronDown aria-hidden="true" size={16} className={cn(mensOpen && "rotate-180")} />
            </button>
            <div className={cn("absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2", !mensOpen && "hidden")}>
              <div id="mens-menu" className="min-w-52 border border-paper/15 bg-ink py-2 shadow-lg">
                {categories.map((category) => {
                  const href = `/collections/${category.slug}`
                  const active = pathname.startsWith(href)
                  return (
                    <Link
                      key={category.slug}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        setMensPinned(false)
                        setMensHovered(false)
                      }}
                      className={cn(
                        "block px-4 py-2.5 text-sm text-paper/90 hover:bg-paper/10 hover:text-paper",
                        active && "text-paper",
                      )}
                    >
                      {category.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          <a href={`tel:${brand.phones.header}`} className="py-2 text-sm text-paper/90 hover:text-paper">
            Contact us
          </a>
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
