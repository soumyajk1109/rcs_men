import { categories as seedCategories, products as seedProducts, type Category, type Product } from "@/data/products"

let categories = seedCategories
let products = seedProducts

export function publishCatalog(nextCategories: Category[], nextProducts: Product[]) {
  categories = nextCategories
  products = nextProducts
}

export function getLiveProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function getLiveCategory(slug: string) {
  return categories.find((category) => category.slug === slug)
}
