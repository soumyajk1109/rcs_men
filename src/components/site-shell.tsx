"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { categories } from "@/data/products"
import { useStore } from "@/lib/store"
import { CartView } from "@/components/cart-view"
import { Dialog } from "@/components/dialog"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const router = useRouter()
  const { cartOpen, setCartOpen } = useStore()
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [noticeOpen, setNoticeOpen] = useState(false)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    setNavOpen(false)
    setSearchOpen(false)
    setCartOpen(false)
    setNoticeOpen(false)
  }, [pathname, setCartOpen])

  function submitSearch(value: string) {
    const query = value.trim()
    if (!query) return
    setSearchOpen(false)
    setNavOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
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
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="px-2 py-3 text-sm"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/collections" className="px-2 py-3 text-sm">
            All products
          </Link>
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
