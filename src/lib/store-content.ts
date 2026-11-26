import { brand } from "@/config/brand"
import {
  categories,
  products,
  sizeLabels,
  type Audience,
  type Category,
  type Product,
  type ProductColour,
  type SizeStock,
} from "@/data/products"

export type Announcement = {
  text: string
  cta: string
  href: string
}

export type HeroSlideContent = {
  title: string
  text: string
  cta: string
  href: string
  image: string
  imageAlt: string
  imagePosition: string
}

export type Exclusive = {
  audience: Audience
  title: string
  href: string
  image: string
  imageAlt: string
}

export type ShopBrand = {
  name: string
  shortName: string
  wordmark: string
  description: string
  social: {
    facebook: string
    instagram: string
    linkedin: string
    youtube: string
  }
  location: {
    label: string
    lines: string[]
    href: string
  }
  phones: {
    header: string
    footer: string
  }
  whatsappMessage: string
  announcements: Announcement[]
  slides: HeroSlideContent[]
}

export type StoreContent = {
  brand: ShopBrand
  exclusives: Exclusive[]
  categories: Category[]
  products: Product[]
}

const audiences = new Set<Audience>(["men", "women", "kids"])

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function categoriesForAudience(list: Category[], audience: Audience) {
  return list.filter((category) => category.audience === audience)
}

export function seedContent(): StoreContent {
  return structuredClone({
    brand: {
      name: brand.name,
      shortName: brand.shortName,
      wordmark: brand.wordmark,
      description: brand.description,
      social: { ...brand.social },
      location: {
        label: brand.location.label,
        lines: [...brand.location.lines],
        href: brand.location.href,
      },
      phones: { ...brand.phones },
      whatsappMessage: brand.whatsappMessage,
      announcements: brand.announcements.map((item) => ({
        text: item.text,
        cta: "cta" in item ? item.cta : "",
        href: "href" in item ? item.href : "",
      })),
      slides: brand.slides.map((item) => ({
        title: item.title,
        text: item.text,
        cta: item.cta,
        href: item.href,
        image: item.image,
        imageAlt: item.imageAlt,
        imagePosition: item.imagePosition,
      })),
    },
    exclusives: [
      {
        audience: "women",
        title: "Women exclusive",
        href: "#women-collection",
        image: "/images/exclusive-women-city.jpg",
        imageAlt: "Woman in a red dress walking along a stone balcony with autumn trees behind her.",
      },
      {
        audience: "men",
        title: "Men exclusive",
        href: "#men-collection",
        image: "/images/exclusive-men-city.jpg",
        imageAlt: "Man in a white t-shirt, black overalls, and sneakers walking a city street.",
      },
      {
        audience: "kids",
        title: "Kids exclusive",
        href: "/collections/kids-sets",
        image: "/images/exclusive-kids-city.jpg",
        imageAlt: "A child in a denim outfit sitting on a stone post in a city plaza.",
      },
    ],
    categories: categories.map((category) => ({ ...category })),
    products,
  })
}

function requiredText(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`)
  const trimmed = value.trim()
  if (trimmed.length > max) throw new Error(`${label} is too long.`)
  return trimmed
}

function optionalText(value: unknown, max: number) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, max)
}

function localImage(value: unknown, label: string) {
  const src = requiredText(value, label, 240)
  const allowed = src.startsWith("/images/") || src.startsWith("/uploads/") || src.startsWith("/brand/")
  if (!allowed || src.includes("..")) throw new Error(`${label} must be a photo saved in this shop.`)
  return src
}

function shopHref(value: unknown, label: string) {
  const next = requiredText(value, label, 240)
  if (next.startsWith("/") || next.startsWith("#") || next.startsWith("https://") || next.startsWith("tel:")) return next
  throw new Error(`${label} must start with /, https://, or tel:.`)
}

function phone(value: unknown, label: string) {
  const next = requiredText(value, label, 20)
  if (!/^\+?[0-9]{8,15}$/.test(next)) throw new Error(`${label} needs a country code and digits.`)
  return next
}

function whole(value: unknown, label: string, min: number, max: number) {
  const number = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(number)) throw new Error(`${label} must be a number.`)
  const rounded = Math.round(number)
  if (rounded < min || rounded > max) throw new Error(`${label} must be between ${min} and ${max}.`)
  return rounded
}

function sizes(value: unknown): SizeStock[] {
  const list = Array.isArray(value) ? value : []
  return sizeLabels.map((label) => {
    const found = list.find((item) => item && typeof item === "object" && (item as SizeStock).label === label)
    const stock = found ? whole((found as SizeStock).stock, `${label} stock`, 0, 9999) : 0
    return { label, stock }
  })
}

export function assertContent(input: unknown): StoreContent {
  if (!input || typeof input !== "object") throw new Error("The shop file is not valid.")
  const raw = input as Partial<StoreContent>
  const brandRaw = raw.brand
  if (!brandRaw) throw new Error("Shop details are missing.")

  const name = requiredText(brandRaw.name, "Shop name", 80)
  const slides = (brandRaw.slides ?? []).map((slide, index) => ({
    title: requiredText(slide?.title, `Slide ${index + 1} title`, 80),
    text: requiredText(slide?.text, `Slide ${index + 1} text`, 280),
    cta: requiredText(slide?.cta, `Slide ${index + 1} button`, 80),
    href: shopHref(slide?.href, `Slide ${index + 1} link`),
    image: localImage(slide?.image, `Slide ${index + 1} photo`),
    imageAlt: requiredText(slide?.imageAlt, `Slide ${index + 1} description`, 240),
    imagePosition: requiredText(slide?.imagePosition, `Slide ${index + 1} position`, 40),
  }))
  if (slides.length < 1 || slides.length > 6) throw new Error("Keep between 1 and 6 home slides.")

  const announcements = (brandRaw.announcements ?? []).map((item, index) => ({
    text: requiredText(item?.text, `Announcement ${index + 1}`, 160),
    cta: optionalText(item?.cta, 40),
    href: optionalText(item?.href, 240),
  }))
  if (announcements.length < 1 || announcements.length > 6) {
    throw new Error("Keep between 1 and 6 announcements.")
  }
  for (const item of announcements) {
    if (item.cta && !item.href) throw new Error(`“${item.cta}” needs a link.`)
    if (item.href && !item.href.startsWith("/") && !item.href.startsWith("https://")) {
      throw new Error("Announcement links must start with / or https://.")
    }
  }

  const social = brandRaw.social ?? { facebook: "", instagram: "", linkedin: "", youtube: "" }
  const location = brandRaw.location ?? { label: "", lines: [], href: "" }
  const lines = Array.isArray(location.lines) ? location.lines.map((line) => optionalText(line, 80)).filter(Boolean) : []

  const exclusives = (raw.exclusives ?? []).map((item, index) => {
    const audience = item?.audience
    if (!audiences.has(audience)) throw new Error(`Exclusive ${index + 1} needs an audience.`)
    return {
      audience,
      title: requiredText(item?.title, `Exclusive ${index + 1} title`, 60),
      href: shopHref(item?.href, `Exclusive ${index + 1} link`),
      image: localImage(item?.image, `Exclusive ${index + 1} photo`),
      imageAlt: requiredText(item?.imageAlt, `Exclusive ${index + 1} description`, 240),
    }
  })
  if (exclusives.length > 6) throw new Error("Keep up to 6 exclusive circles.")

  const nextCategories = (raw.categories ?? []).map((category, index) => {
    const audience = category?.audience
    if (!audiences.has(audience)) throw new Error(`Category ${index + 1} needs an audience.`)
    const slug = slugify(requiredText(category?.slug, `Category ${index + 1} address`, 80))
    if (!slug) throw new Error(`Category ${index + 1} needs an address.`)
    return {
      slug,
      name: requiredText(category?.name, `Category ${index + 1} name`, 80),
      blurb: requiredText(category?.blurb, `Category ${index + 1} description`, 240),
      image: localImage(category?.image, `Category ${index + 1} photo`),
      imageAlt: requiredText(category?.imageAlt, `Category ${index + 1} photo description`, 240),
      audience,
    }
  })
  if (nextCategories.length < 1 || nextCategories.length > 60) {
    throw new Error("Keep between 1 and 60 categories.")
  }
  const slugs = new Set<string>()
  for (const category of nextCategories) {
    if (slugs.has(category.slug)) throw new Error(`Two categories use “${category.slug}”.`)
    slugs.add(category.slug)
  }

  const nextProducts = (raw.products ?? []).map((product, index) => normalizeProduct(product, index, slugs))
  if (nextProducts.length > 300) throw new Error("Keep the catalog under 300 products.")
  const ids = new Set<string>()
  for (const product of nextProducts) {
    if (ids.has(product.id) || ids.has(product.slug)) throw new Error(`Two products use “${product.slug}”.`)
    ids.add(product.id)
    ids.add(product.slug)
  }

  return {
    brand: {
      name,
      shortName: name,
      wordmark: requiredText(brandRaw.wordmark, "Wordmark", 80),
      description: requiredText(brandRaw.description, "Description", 280),
      social: {
        facebook: shopHref(social.facebook, "Facebook link"),
        instagram: shopHref(social.instagram, "Instagram link"),
        linkedin: shopHref(social.linkedin, "LinkedIn link"),
        youtube: shopHref(social.youtube, "YouTube link"),
      },
      location: {
        label: requiredText(location.label, "Location name", 80),
        lines: lines.length ? lines : [requiredText(location.label, "Location name", 80)],
        href: shopHref(location.href, "Location link"),
      },
      phones: {
        header: phone(brandRaw.phones?.header, "Header phone"),
        footer: phone(brandRaw.phones?.footer, "Footer phone"),
      },
      whatsappMessage: requiredText(brandRaw.whatsappMessage, "WhatsApp message", 160),
      announcements,
      slides,
    },
    exclusives,
    categories: nextCategories,
    products: nextProducts,
  }
}

function normalizeProduct(product: Partial<Product> | undefined, index: number, slugs: Set<string>): Product {
  const label = `Product ${index + 1}`
  const name = requiredText(product?.name, `${label} name`, 80)
  const slug = slugify(requiredText(product?.slug, `${label} address`, 80))
  if (!slug) throw new Error(`${label} needs an address.`)
  const category = requiredText(product?.category, `${label} category`, 80)
  if (!slugs.has(category)) throw new Error(`${name} is in a category that does not exist.`)
  const colours = (product?.colours ?? []).map((colour, colourIndex) => normalizeColour(colour, name, colourIndex))
  if (colours.length < 1 || colours.length > 8) throw new Error(`${name} needs between 1 and 8 colours.`)
  const colourIds = new Set<string>()
  for (const colour of colours) {
    if (colourIds.has(colour.id)) throw new Error(`${name} has two colours with the same name.`)
    colourIds.add(colour.id)
  }
  const care = (product?.care ?? []).map((line) => optionalText(line, 160)).filter(Boolean)
  return {
    id: slugify(optionalText(product?.id, 80)) || slug,
    slug,
    name,
    category,
    price: whole(product?.price, `${name} price`, 0, 10000000),
    description: requiredText(product?.description, `${name} description`, 2000),
    fabric: optionalText(product?.fabric, 160),
    care: care.length ? care : ["Machine wash cold."],
    colours,
    newArrival: Boolean(product?.newArrival),
    sortOrder: whole(product?.sortOrder ?? index + 1, `${name} order`, 0, 9999),
    createdAt: /^\d{4}-\d{2}-\d{2}$/.test(product?.createdAt ?? "")
      ? (product?.createdAt as string)
      : new Date().toISOString().slice(0, 10),
  }
}

function normalizeColour(colour: Partial<ProductColour> | undefined, productName: string, index: number): ProductColour {
  const name = requiredText(colour?.name, `${productName} colour ${index + 1}`, 40)
  const id = slugify(optionalText(colour?.id, 40)) || slugify(name) || `colour-${index + 1}`
  const hex = optionalText(colour?.hex, 7)
  const images = (colour?.images ?? []).map((image, imageIndex) => ({
    src: localImage(image?.src, `${productName} ${name} photo ${imageIndex + 1}`),
    alt: requiredText(image?.alt, `${productName} ${name} photo description`, 240),
  }))
  if (images.length < 1) throw new Error(`${productName} ${name} needs a photo.`)
  return {
    id,
    name,
    hex: /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#221f1c",
    images,
    sizes: sizes(colour?.sizes),
  }
}
