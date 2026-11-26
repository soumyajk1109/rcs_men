"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useContent } from "@/components/content-provider"
import { categoriesForAudience } from "@/lib/store-content"
import type { Audience } from "@/data/products"
import { useStore } from "@/lib/store"
import { CartView } from "@/components/cart-view"
import { Dialog } from "@/components/dialog"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { brand, categories } = useContent()
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const router = useRouter()
  const { cartOpen, setCartOpen } = useStore()
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [openAudience, setOpenAudience] = useState<Audience | null>(null)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    setNavOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    setNoticeOpen(false)
    setOpenAudience(null)
  }, [pathname, setCartOpen])

  function submitSearch(value: string) {
    const query = value.trim()
    if (!query) return
    setSearchOpen(false)
    setNavOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  if (pathname.startsWith("/admin")) {
    return (
      <>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main" className="flex-1">
          {children}
        </main>
      </>
    )
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header
        menuOpen={navOpen}
        onMenu={() => setNavOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onCart={() => setNoticeOpen(true)}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <a
        href={`https://wa.me/${brand.phones.header.replace(/\D/g, "")}?text=${encodeURIComponent(brand.whatsappMessage)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Send a WhatsApp message"
        className="fixed right-4 bottom-5 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-8 fill-current">
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.33 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.89c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.25-4.76-4.15-4.9-4.35-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.24-.27.64-.39.86-.39h.62c.2 0 .46-.07.72.55.27.64.91 2.22.99 2.38.08.16.13.35.03.56-.1.21-.15.34-.3.52-.15.18-.31.4-.44.54-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.65-.07.18-.2.76-.88.96-1.18.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.96.3.15.5.22.57.34.08.13.08.74-.16 1.42z" />
        </svg>
      </a>

      <Dialog id="site-nav" open={navOpen} onClose={() => setNavOpen(false)} title="Menu" side="left">
        <nav aria-label="Mobile" className="flex flex-col px-2 py-2">
          <form
            className="px-2 py-2"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              submitSearch(String(data.get("q") ?? ""))
            }}
          >
            <label htmlFor="nav-search" className="text-sm font-medium">
              Search
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="nav-search"
                name="q"
                className="h-11 min-w-0 flex-1 border border-line bg-paper px-3 text-sm"
              />
              <button type="submit" className="h-11 bg-ink px-3 text-sm text-paper">
                Go
              </button>
            </div>
          </form>
          <AudienceLinks
            label="Men's"
            audience="men"
            categories={categories}
            open={openAudience === "men"}
            onToggle={() => setOpenAudience((current) => (current === "men" ? null : "men"))}
          />
          <AudienceLinks
            label="Women's"
            audience="women"
            categories={categories}
            open={openAudience === "women"}
            onToggle={() => setOpenAudience((current) => (current === "women" ? null : "women"))}
          />
          <AudienceLinks
            label="Kid's"
            audience="kids"
            categories={categories}
            open={openAudience === "kids"}
            onToggle={() => setOpenAudience((current) => (current === "kids" ? null : "kids"))}
          />
          <a href={`tel:${brand.phones.header}`} className="px-2 py-3 text-sm">
            Contact us
          </a>
          <Link href="/wishlist" className="px-2 py-3 text-sm">
            Wishlist
          </Link>
          <Link href="/cart" className="px-2 py-3 text-sm">
            Cart
          </Link>
        </nav>
      </Dialog>

      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} title="Search" side="center">
        <form
          className="px-4 py-4"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch(searchValue)
          }}
        >
          <label htmlFor="header-search" className="text-sm">
            Search by product or category
          </label>
          <input
            id="header-search"
            data-autofocus
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="mt-2 h-12 w-full border border-line bg-paper px-3 text-sm"
          />
          <button type="submit" className="mt-3 h-12 w-full bg-ink text-sm text-paper">
            Search
          </button>
        </form>
      </Dialog>

      <Dialog open={noticeOpen} onClose={() => setNoticeOpen(false)} title="We will be online soon" side="center">
        {null}
      </Dialog>

      <Dialog open={cartOpen} onClose={() => setCartOpen(false)} title="Cart" side="right">
        <div className="px-4">
          <CartView compact />
        </div>
      </Dialog>
    </>
  )
}

function AudienceLinks({
  label,
  audience,
  categories,
  open,
  onToggle,
}: {
  label: string
  audience: Audience
  categories: ReturnType<typeof useContent>["categories"]
  open: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const allActive = pathname === "/collections" && useSearchParams().get("audience") === audience

  return (
    <>
      <button
        type="button"
        className="flex items-center justify-between px-2 py-3 text-left text-sm"
        aria-expanded={open}
        onClick={onToggle}
      >
        {label}
        <ChevronDown aria-hidden="true" size={16} className={open ? "rotate-180" : undefined} />
      </button>
      {open ? (
        <>
          <Link
            href={`/collections?audience=${audience}`}
            aria-current={allActive ? "page" : undefined}
            className="px-5 py-2.5 text-sm"
          >
            All
          </Link>
          {categoriesForAudience(categories, audience).map((category) => (
            <Link key={category.slug} href={`/collections/${category.slug}`} className="px-5 py-2.5 text-sm">
              {category.name}
            </Link>
          ))}
        </>
      ) : null}
    </>
  )
}
