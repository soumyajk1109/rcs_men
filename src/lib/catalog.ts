import {
  products,
  getCategory,
  type Product,
} from "@/data/products"

export const priceBands = [
  { id: "under-1499", label: "Under ₹1,499", min: 0, max: 1498 },
  { id: "1499-2499", label: "₹1,499 – ₹2,499", min: 1499, max: 2499 },
  { id: "2499-3999", label: "₹2,499 – ₹3,999", min: 2499, max: 3999 },
  { id: "3999-plus", label: "₹3,999 and above", min: 3999, max: Number.POSITIVE_INFINITY },
] as const

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name" },
] as const

export type SortKey = (typeof sortOptions)[number]["id"]

export type Filters = {
  sizes: string[]
  colours: string[]
  price: string | null
  availability: "all" | "in-stock"
  sort: SortKey
}

const sortIds = new Set<string>(sortOptions.map((option) => option.id))
const priceIds = new Set<string>(priceBands.map((band) => band.id))

function splitParam(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

export function parseFilters(params: URLSearchParams): Filters {
  const sortValue = params.get("sort") ?? "featured"
  const price = params.get("price")
  return {
    sizes: splitParam(params.get("size")),
    colours: splitParam(params.get("colour")),
    price: price && priceIds.has(price) ? price : null,
    availability: params.get("availability") === "in-stock" ? "in-stock" : "all",
    sort: sortIds.has(sortValue) ? (sortValue as SortKey) : "featured",
  }
}

export function hasActiveFilters(filters: Filters) {
  return (
    filters.sizes.length > 0 ||
    filters.colours.length > 0 ||
    filters.price !== null ||
    filters.availability === "in-stock"
  )
}

export function applyFilters(list: Product[], filters: Filters) {
  const band = priceBands.find((item) => item.id === filters.price)
  const filtered = list.filter((product) => {
    if (band && (product.price < band.min || product.price > band.max)) return false
    const colours = filters.colours.length
      ? product.colours.filter((colour) => filters.colours.includes(colour.id))
      : product.colours
    if (filters.colours.length > 0 && colours.length === 0) return false
    const needsVariant =
      filters.sizes.length > 0 || filters.availability === "in-stock"
    if (!needsVariant) return true
    return colours.some((colour) =>
      colour.sizes.some((size) => {
        const sizeOk = filters.sizes.length === 0 || filters.sizes.includes(size.label)
        const stockOk = filters.availability !== "in-stock" || size.stock > 0
        return sizeOk && stockOk
      }),
    )
  })

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "newest":
        return b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name)
      case "price-asc":
        return a.price - b.price || a.name.localeCompare(b.name)
      case "price-desc":
        return b.price - a.price || a.name.localeCompare(b.name)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return a.sortOrder - b.sortOrder
    }
  })
}

export function colourChoices(list: Product[]) {
  const seen = new Map<string, { id: string; name: string; hex: string }>()
  for (const product of list) {
    for (const colour of product.colours) {
      if (!seen.has(colour.id)) {
        seen.set(colour.id, { id: colour.id, name: colour.name, hex: colour.hex })
      }
    }
  }
  return [...seen.values()]
}

export function searchProducts(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return products
    .filter((product) => {
      const category = getCategory(product.category)
      const haystack = [product.name, category?.name ?? "", product.category]
        .join(" ")
        .toLowerCase()
      return haystack.includes(needle)
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
}
