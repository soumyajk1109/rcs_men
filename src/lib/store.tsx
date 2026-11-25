"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { brand } from "@/config/brand"
import { colourById, getProductById, type Product } from "@/data/products"

export type CartLine = {
  productId: string
  colourId: string
  size: string
  quantity: number
}

type StoreValue = {
  lines: CartLine[]
  wishlistIds: string[]
  cartCount: number
  wishlistCount: number
  subtotal: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addItem: (productId: string, colourId: string, size: string) => boolean
  setQuantity: (line: CartLine, quantity: number) => void
  removeLine: (line: CartLine) => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

type PersistedState = {
  lines: CartLine[]
  wishlistIds: string[]
}

const StoreContext = createContext<StoreValue | null>(null)
const emptyState: PersistedState = { lines: [], wishlistIds: [] }
let snapshot: PersistedState = emptyState
let loaded = false
const listeners = new Set<() => void>()

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false
  const line = value as Partial<CartLine>
  return (
    typeof line.productId === "string" &&
    typeof line.colourId === "string" &&
    typeof line.size === "string" &&
    typeof line.quantity === "number" &&
    line.quantity > 0
  )
}

function readJson(key: string) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

function readPersisted(): PersistedState {
  const cart = readJson(brand.storageKeys.cart)
  const wishlist = readJson(brand.storageKeys.wishlist)
  return {
    lines: Array.isArray(cart) ? cart.filter(isLine) : [],
    wishlistIds: Array.isArray(wishlist)
      ? wishlist.filter((item): item is string => typeof item === "string")
      : [],
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  if (!loaded) {
    loaded = true
    const stored = readPersisted()
    if (stored.lines.length > 0 || stored.wishlistIds.length > 0) snapshot = stored
  }
  return snapshot
}

function getServerSnapshot() {
  return emptyState
}

function writeState(next: PersistedState) {
  loaded = true
  snapshot = next
  localStorage.setItem(brand.storageKeys.cart, JSON.stringify(next.lines))
  localStorage.setItem(brand.storageKeys.wishlist, JSON.stringify(next.wishlistIds))
  emit()
}

function stockFor(productId: string, colourId: string, size: string) {
  const product = getProductById(productId)
  if (!product) return 0
  const colour = colourById(product, colourId)
  if (!colour || colour.id !== colourId) return 0
  return colour.sizes.find((item) => item.label === size)?.stock ?? 0
}

function sameLine(a: CartLine, b: Pick<CartLine, "productId" | "colourId" | "size">) {
  return a.productId === b.productId && a.colourId === b.colourId && a.size === b.size
}

export function lineLabel(line: CartLine) {
  const product = getProductById(line.productId)
  if (!product) return "Item"
  const colour = product.colours.find((item) => item.id === line.colourId)
  return `${product.name}, ${colour?.name ?? line.colourId}, size ${line.size}`
}

export function lineProduct(line: CartLine): Product | undefined {
  return getProductById(line.productId)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { lines, wishlistIds } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback((productId: string, colourId: string, size: string) => {
    const stock = stockFor(productId, colourId, size)
    if (stock < 1) return false
    const current = getSnapshot().lines
    const index = current.findIndex((line) => sameLine(line, { productId, colourId, size }))
    const linesNext =
      index === -1
        ? [...current, { productId, colourId, size, quantity: 1 }]
        : current.map((line, lineIndex) =>
            lineIndex === index
              ? { ...line, quantity: Math.min(stock, line.quantity + 1) }
              : line,
          )
    writeState({ ...getSnapshot(), lines: linesNext })
    return true
  }, [])

  const setQuantity = useCallback((line: CartLine, quantity: number) => {
    const stock = stockFor(line.productId, line.colourId, line.size)
    const current = getSnapshot().lines
    const linesNext =
      quantity < 1 || stock < 1
        ? current.filter((item) => !sameLine(item, line))
        : current.map((item) =>
            sameLine(item, line) ? { ...item, quantity: Math.min(stock, quantity) } : item,
          )
    writeState({ ...getSnapshot(), lines: linesNext })
  }, [])

  const removeLine = useCallback((line: CartLine) => {
    writeState({
      ...getSnapshot(),
      lines: getSnapshot().lines.filter((item) => !sameLine(item, line)),
    })
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    const current = getSnapshot().wishlistIds
    const wishlistIdsNext = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    writeState({ ...getSnapshot(), wishlistIds: wishlistIdsNext })
  }, [])

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds],
  )

  const cartCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => {
    const product = getProductById(line.productId)
    return sum + (product ? product.price * line.quantity : 0)
  }, 0)

  const value = useMemo<StoreValue>(
    () => ({
      lines,
      wishlistIds,
      cartCount,
      wishlistCount: wishlistIds.length,
      subtotal,
      cartOpen,
      setCartOpen,
      addItem,
      setQuantity,
      removeLine,
      toggleWishlist,
      isWishlisted,
    }),
    [
      lines,
      wishlistIds,
      cartCount,
      subtotal,
      cartOpen,
      addItem,
      setQuantity,
      removeLine,
      toggleWishlist,
      isWishlisted,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error("useStore must be used within StoreProvider")
  return value
}
