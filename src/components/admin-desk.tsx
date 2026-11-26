"use client"

import { useState } from "react"
import Link from "next/link"
import { logout, saveStoreContent, uploadAdminImage } from "@/app/admin/actions"
import { sizeLabels, type Audience, type Category, type Product, type ProductColour } from "@/data/products"
import type { Exclusive, HeroSlideContent, StoreContent } from "@/lib/store-content"

const audiences: Audience[] = ["men", "women", "kids"]

export function AdminDesk({ initial }: { initial: StoreContent }) {
  const [content, setContent] = useState(initial)
  const [section, setSection] = useState<"home" | "categories" | "products">("home")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [productIndex, setProductIndex] = useState(0)

  async function save(next: StoreContent = content) {
    setPending(true)
    setMessage("")
    const result = await saveStoreContent(next)
    setPending(false)
    if (result.error || !result.content) {
      setMessage(result.error ?? "Could not save.")
      return
    }
    setContent(result.content)
    setMessage("Saved. The shop is updated.")
  }

  const category = content.categories[categoryIndex] ?? content.categories[0]
  const product = content.products[productIndex]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Ranebennur Cloth Stores</p>
          <h1 className="font-display text-4xl font-semibold uppercase leading-none">Shop editor</h1>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/" className="underline decoration-accent decoration-2 underline-offset-4">
            View shop
          </Link>
          <form action={logout}>
            <button type="submit" className="underline decoration-accent decoration-2 underline-offset-4">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Editor sections">
        {(
          [
            ["home", "Homepage"],
            ["categories", "Categories"],
            ["products", "Products"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className={`h-11 px-4 text-sm ${section === id ? "bg-ink text-paper" : "border border-line"}`}
            onClick={() => {
              setSection(id)
              setMessage("")
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {message ? (
        <p className="mt-4 text-sm text-accent" role="status">
          {message}
        </p>
      ) : null}

      {section === "home" ? (
        <HomeEditor
          content={content}
          pending={pending}
          onChange={setContent}
          onError={setMessage}
          onSave={() => void save()}
        />
      ) : null}

      {section === "categories" && category ? (
        <CategoryEditor
          categories={content.categories}
          category={category}
          index={content.categories.indexOf(category)}
          pending={pending}
          onPick={setCategoryIndex}
          onChange={(next) => setContent((current) => ({ ...current, categories: next }))}
          onError={setMessage}
          onSave={(nextCategories) => {
            const slugMap = new Map<string, string>()
            content.categories.forEach((item, itemIndex) => {
              const renamed = nextCategories[itemIndex]
              if (renamed) slugMap.set(item.slug, renamed.slug)
            })
            const products = content.products.map((item) => ({
              ...item,
              category: slugMap.get(item.category) ?? item.category,
            }))
            const next = { ...content, categories: nextCategories, products }
            setContent(next)
            void save(next)
          }}
          onDelete={(slug) => {
            if (content.categories.length < 2) {
              setMessage("Keep at least one category.")
              return
            }
            if (content.products.some((item) => item.category === slug)) {
              setMessage("Move or delete the products in this category first.")
              return
            }
            const nextCategories = content.categories.filter((item) => item.slug !== slug)
            setCategoryIndex(0)
            const next = { ...content, categories: nextCategories }
            setContent(next)
            void save(next)
          }}
        />
      ) : null}

      {section === "products" ? (
        <ProductEditor
          content={content}
          product={product}
          pending={pending}
          onPick={setProductIndex}
          onChange={(products) => setContent((current) => ({ ...current, products }))}
          onError={setMessage}
          onSave={(products) => {
            const next = { ...content, products }
            setContent(next)
            void save(next)
          }}
        />
      ) : null}
    </div>
  )
}

function HomeEditor({
  content,
  pending,
  onChange,
  onError,
  onSave,
}: {
  content: StoreContent
  pending: boolean
  onChange: (next: StoreContent) => void
  onError: (message: string) => void
  onSave: () => void
}) {
  function patchBrand(patch: Partial<StoreContent["brand"]>) {
    onChange({ ...content, brand: { ...content.brand, ...patch } })
  }

  return (
    <div className="mt-6 space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <Field id="shop-name" label="Shop name" value={content.brand.name} onChange={(name) => patchBrand({ name, shortName: name })} />
        <Field id="wordmark" label="Wordmark" value={content.brand.wordmark} onChange={(wordmark) => patchBrand({ wordmark })} />
        <TextArea id="description" label="Description" value={content.brand.description} onChange={(description) => patchBrand({ description })} />
        <Field id="header-phone" label="Header phone" value={content.brand.phones.header} onChange={(header) => patchBrand({ phones: { ...content.brand.phones, header } })} />
        <Field id="footer-phone" label="Footer phone" value={content.brand.phones.footer} onChange={(footer) => patchBrand({ phones: { ...content.brand.phones, footer } })} />
        <Field id="whatsapp" label="WhatsApp draft" value={content.brand.whatsappMessage} onChange={(whatsappMessage) => patchBrand({ whatsappMessage })} />
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold uppercase">Announcements</h2>
          <button
            type="button"
            className="h-10 border border-line px-3 text-sm"
            onClick={() =>
              patchBrand({
                announcements: [...content.brand.announcements, { text: "New announcement", cta: "", href: "" }],
              })
            }
          >
            Add announcement
          </button>
        </div>
        <ul className="mt-4 space-y-4">
          {content.brand.announcements.map((item, index) => (
            <li key={index} className="grid gap-3 border border-line p-3 sm:grid-cols-3">
              <Field
                id={`announcement-${index}`}
                label="Statement"
                value={item.text}
                onChange={(text) => patchBrand({ announcements: replace(content.brand.announcements, index, { ...item, text }) })}
              />
              <Field
                id={`announcement-cta-${index}`}
                label="Link text"
                value={item.cta}
                onChange={(cta) => patchBrand({ announcements: replace(content.brand.announcements, index, { ...item, cta }) })}
              />
              <Field
                id={`announcement-href-${index}`}
                label="Link"
                value={item.href}
                onChange={(href) => patchBrand({ announcements: replace(content.brand.announcements, index, { ...item, href }) })}
              />
              {content.brand.announcements.length > 1 ? (
                <button
                  type="button"
                  className="text-left text-sm underline decoration-accent decoration-2 underline-offset-4"
                  onClick={() =>
                    patchBrand({ announcements: content.brand.announcements.filter((_, itemIndex) => itemIndex !== index) })
                  }
                >
                  Remove announcement
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold uppercase">Home slides</h2>
          <button
            type="button"
            className="h-10 border border-line px-3 text-sm"
            onClick={() =>
              patchBrand({
                slides: [
                  ...content.brand.slides,
                  {
                    title: "New slide",
                    text: "Describe the piece.",
                    cta: "Shop now",
                    href: "/collections",
                    image: "/images/hero-tee-wide.jpg",
                    imageAlt: "Campaign photo",
                    imagePosition: "center 18%",
                  },
                ],
              })
            }
          >
            Add slide
          </button>
        </div>
        {content.brand.slides.map((slide, index) => (
          <SlideFields
            key={index}
            index={index}
            slide={slide}
            canRemove={content.brand.slides.length > 1}
            onError={onError}
            onChange={(next) => patchBrand({ slides: replace(content.brand.slides, index, next) })}
            onRemove={() => patchBrand({ slides: content.brand.slides.filter((_, itemIndex) => itemIndex !== index) })}
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold uppercase">Exclusive circles</h2>
          <button
            type="button"
            className="h-10 border border-line px-3 text-sm"
            onClick={() =>
              onChange({
                ...content,
                exclusives: [
                  ...content.exclusives,
                  {
                    audience: "men",
                    title: "New exclusive",
                    href: "/collections",
                    image: "/images/tee-charcoal.jpg",
                    imageAlt: "Exclusive photo",
                  },
                ],
              })
            }
          >
            Add circle
          </button>
        </div>
        {content.exclusives.map((item, index) => (
          <ExclusiveFields
            key={index}
            index={index}
            item={item}
            onError={onError}
            onChange={(next) => onChange({ ...content, exclusives: replace(content.exclusives, index, next) })}
            onRemove={() =>
              onChange({ ...content, exclusives: content.exclusives.filter((_, itemIndex) => itemIndex !== index) })
            }
          />
        ))}
      </section>

      <SaveButton pending={pending} onSave={onSave} />
    </div>
  )
}

function SlideFields({
  slide,
  index,
  canRemove,
  onChange,
  onRemove,
  onError,
}: {
  slide: HeroSlideContent
  index: number
  canRemove: boolean
  onChange: (slide: HeroSlideContent) => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  return (
    <fieldset className="grid gap-3 border border-line p-3 sm:grid-cols-2">
      <legend className="px-1 text-sm font-medium">Slide {index + 1}</legend>
      <Field id={`slide-title-${index}`} label="Title" value={slide.title} onChange={(title) => onChange({ ...slide, title })} />
      <Field id={`slide-cta-${index}`} label="Button" value={slide.cta} onChange={(cta) => onChange({ ...slide, cta })} />
      <Field id={`slide-href-${index}`} label="Button link" value={slide.href} onChange={(href) => onChange({ ...slide, href })} />
      <Field
        id={`slide-position-${index}`}
        label="Photo position"
        value={slide.imagePosition}
        onChange={(imagePosition) => onChange({ ...slide, imagePosition })}
      />
      <TextArea id={`slide-text-${index}`} label="Text" value={slide.text} onChange={(text) => onChange({ ...slide, text })} />
      <TextArea id={`slide-alt-${index}`} label="Photo description" value={slide.imageAlt} onChange={(imageAlt) => onChange({ ...slide, imageAlt })} />
      <ImageField id={`slide-image-${index}`} label="Photo" src={slide.image} onSrc={(image) => onChange({ ...slide, image })} onError={onError} />
      {canRemove ? (
        <button type="button" className="text-left text-sm underline decoration-accent decoration-2 underline-offset-4" onClick={onRemove}>
          Remove slide
        </button>
      ) : null}
    </fieldset>
  )
}

function ExclusiveFields({
  item,
  index,
  onChange,
  onRemove,
  onError,
}: {
  item: Exclusive
  index: number
  onChange: (item: Exclusive) => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  return (
    <fieldset className="grid gap-3 border border-line p-3 sm:grid-cols-2">
      <legend className="px-1 text-sm font-medium">Circle {index + 1}</legend>
      <label className="block text-sm font-medium" htmlFor={`exclusive-audience-${index}`}>
        Audience
        <select
          id={`exclusive-audience-${index}`}
          value={item.audience}
          onChange={(event) => onChange({ ...item, audience: event.target.value as Audience })}
          className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm font-normal"
        >
          {audiences.map((audience) => (
            <option key={audience} value={audience}>
              {audience}
            </option>
          ))}
        </select>
      </label>
      <Field id={`exclusive-title-${index}`} label="Title" value={item.title} onChange={(title) => onChange({ ...item, title })} />
      <Field id={`exclusive-href-${index}`} label="Link" value={item.href} onChange={(href) => onChange({ ...item, href })} />
      <TextArea id={`exclusive-alt-${index}`} label="Photo description" value={item.imageAlt} onChange={(imageAlt) => onChange({ ...item, imageAlt })} />
      <ImageField id={`exclusive-image-${index}`} label="Photo" src={item.image} onSrc={(image) => onChange({ ...item, image })} onError={onError} />
      <button type="button" className="text-left text-sm underline decoration-accent decoration-2 underline-offset-4" onClick={onRemove}>
        Remove circle
      </button>
    </fieldset>
  )
}

function CategoryEditor({
  categories,
  category,
  index,
  pending,
  onPick,
  onChange,
  onSave,
  onDelete,
  onError,
}: {
  categories: Category[]
  category: Category
  index: number
  pending: boolean
  onPick: (index: number) => void
  onChange: (categories: Category[]) => void
  onSave: (categories: Category[]) => void
  onDelete: (slug: string) => void
  onError: (message: string) => void
}) {
  function patch(next: Category) {
    onChange(categories.map((item, itemIndex) => (itemIndex === index ? next : item)))
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="text-sm font-medium" htmlFor="category-pick">
          Category
          <select
            id="category-pick"
            className="mt-1 h-11 border border-line bg-paper px-3 text-sm font-normal"
            value={category.slug}
            onChange={(event) => onPick(categories.findIndex((item) => item.slug === event.target.value))}
          >
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.audience} · {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="h-11 self-end border border-line px-3 text-sm"
          onClick={() => {
            const slug = uniqueSlug("new-category", categories.map((item) => item.slug))
            onChange([
              ...categories,
              {
                slug,
                name: "New category",
                blurb: "Describe this category.",
                image: "/images/tee-charcoal.jpg",
                imageAlt: "Category photo",
                audience: "men",
              },
            ])
            onPick(categories.length)
          }}
        >
          Add category
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="category-name" label="Name" value={category.name} onChange={(name) => patch({ ...category, name })} />
        <Field
          id="category-slug"
          label="Address"
          value={category.slug}
          onChange={(slug) => patch({ ...category, slug })}
        />
        <label className="block text-sm font-medium" htmlFor="category-audience">
          Audience
          <select
            id="category-audience"
            value={category.audience}
            onChange={(event) => patch({ ...category, audience: event.target.value as Audience })}
            className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm font-normal"
          >
            {audiences.map((audience) => (
              <option key={audience} value={audience}>
                {audience}
              </option>
            ))}
          </select>
        </label>
        <TextArea id="category-blurb" label="Description" value={category.blurb} onChange={(blurb) => patch({ ...category, blurb })} />
        <TextArea id="category-alt" label="Photo description" value={category.imageAlt} onChange={(imageAlt) => patch({ ...category, imageAlt })} />
        <ImageField id="category-image" label="Photo" src={category.image} onSrc={(image) => patch({ ...category, image })} onError={onError} />
      </div>
      <div className="flex flex-wrap gap-3">
        <SaveButton pending={pending} onSave={() => onSave(categories)} />
        <button
          type="button"
          className="h-11 border border-line px-4 text-sm"
          onClick={() => {
            if (window.confirm(`Delete ${category.name}?`)) onDelete(category.slug)
          }}
        >
          Delete category
        </button>
      </div>
    </div>
  )
}

function ProductEditor({
  content,
  product,
  pending,
  onPick,
  onChange,
  onSave,
  onError,
}: {
  content: StoreContent
  product: Product | undefined
  pending: boolean
  onPick: (index: number) => void
  onChange: (products: Product[]) => void
  onSave: (products: Product[]) => void
  onError: (message: string) => void
}) {
  function patch(next: Product) {
    if (!product) return
    onChange(content.products.map((item) => (item.id === product.id ? next : item)))
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="text-sm font-medium" htmlFor="product-pick">
          Product
          <select
            id="product-pick"
            className="mt-1 h-11 max-w-full border border-line bg-paper px-3 text-sm font-normal"
            value={product?.id ?? ""}
            onChange={(event) => onPick(content.products.findIndex((item) => item.id === event.target.value))}
          >
            {content.products.length === 0 ? <option value="">No products yet</option> : null}
            {content.products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · ₹{item.price}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="h-11 self-end border border-line px-3 text-sm"
          onClick={() => {
            const slug = uniqueSlug("new-piece", content.products.map((item) => item.slug))
            const created: Product = {
              id: slug,
              slug,
              name: "New piece",
              category: content.categories[0]?.slug ?? "shirts",
              price: 1490,
              description: "Describe the piece.",
              fabric: "Cotton.",
              care: ["Machine wash cold."],
              newArrival: true,
              sortOrder: content.products.length + 1,
              createdAt: new Date().toISOString().slice(0, 10),
              colours: [blankColour(0)],
            }
            onChange([...content.products, created])
            onPick(content.products.length)
          }}
        >
          Add product
        </button>
      </div>

      {product ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="product-name" label="Name" value={product.name} onChange={(name) => patch({ ...product, name })} />
            <Field
              id="product-slug"
              label="Address"
              value={product.slug}
              onChange={(slug) => patch({ ...product, slug })}
            />
            <Field
              id="product-price"
              label="Price in INR"
              value={String(product.price)}
              onChange={(price) => patch({ ...product, price: Number(price) })}
            />
            <label className="block text-sm font-medium" htmlFor="product-category">
              Category
              <select
                id="product-category"
                value={product.category}
                onChange={(event) => patch({ ...product, category: event.target.value })}
                className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm font-normal"
              >
                {content.categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.audience} · {item.name}
                  </option>
                ))}
              </select>
            </label>
            <TextArea id="product-description" label="Description" value={product.description} onChange={(description) => patch({ ...product, description })} />
            <Field id="product-fabric" label="Fabric" value={product.fabric} onChange={(fabric) => patch({ ...product, fabric })} />
            <TextArea
              id="product-care"
              label="Care, one line each"
              value={product.care.join("\n")}
              onChange={(care) => patch({ ...product, care: care.split("\n").map((line) => line.trim()).filter(Boolean) })}
            />
            <label className="flex items-center gap-2 text-sm font-medium" htmlFor="product-new">
              <input
                id="product-new"
                type="checkbox"
                checked={product.newArrival}
                onChange={(event) => patch({ ...product, newArrival: event.target.checked })}
              />
              Show in New arrivals
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold uppercase">Colours</h2>
              <button
                type="button"
                className="h-10 border border-line px-3 text-sm"
                onClick={() => patch({ ...product, colours: [...product.colours, blankColour(product.colours.length)] })}
              >
                Add colour
              </button>
            </div>
            {product.colours.map((colour, index) => (
              <ColourFields
                key={colour.id}
                colour={colour}
                index={index}
                canRemove={product.colours.length > 1}
                onError={onError}
                onChange={(next) => patch({ ...product, colours: replace(product.colours, index, next) })}
                onRemove={() => patch({ ...product, colours: product.colours.filter((_, colourIndex) => colourIndex !== index) })}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <SaveButton pending={pending} onSave={() => onSave(content.products)} />
            <button
              type="button"
              className="h-11 border border-line px-4 text-sm"
              onClick={() => {
                if (!window.confirm(`Delete ${product.name}?`)) return
                const products = content.products.filter((item) => item.id !== product.id)
                onPick(0)
                onSave(products)
              }}
            >
              Delete product
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm">Add a product to start this category list.</p>
      )}
    </div>
  )
}

function ColourFields({
  colour,
  index,
  canRemove,
  onChange,
  onRemove,
  onError,
}: {
  colour: ProductColour
  index: number
  canRemove: boolean
  onChange: (colour: ProductColour) => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  const image = colour.images[0]
  return (
    <fieldset className="grid gap-3 border border-line p-3 sm:grid-cols-2">
      <legend className="px-1 text-sm font-medium">Colour {index + 1}</legend>
      <Field id={`colour-name-${colour.id}`} label="Colour name" value={colour.name} onChange={(name) => onChange({ ...colour, name })} />
      <Field id={`colour-hex-${colour.id}`} label="Hex" value={colour.hex} onChange={(hex) => onChange({ ...colour, hex })} />
      <TextArea
        id={`colour-alt-${colour.id}`}
        label="Photo description"
        value={image?.alt ?? ""}
        onChange={(alt) => onChange({ ...colour, images: [{ src: image?.src ?? "", alt }, ...colour.images.slice(1)] })}
      />
      <ImageField
        id={`colour-image-${colour.id}`}
        label="Photo"
        src={image?.src ?? ""}
        onSrc={(src) => onChange({ ...colour, images: [{ src, alt: image?.alt ?? colour.name }, ...colour.images.slice(1)] })}
        onError={onError}
      />
      <div className="grid grid-cols-5 gap-2 sm:col-span-2">
        {colour.sizes.map((size) => (
          <label key={size.label} className="text-sm font-medium" htmlFor={`stock-${colour.id}-${size.label}`}>
            {size.label}
            <input
              id={`stock-${colour.id}-${size.label}`}
              inputMode="numeric"
              value={String(size.stock)}
              onChange={(event) =>
                onChange({
                  ...colour,
                  sizes: colour.sizes.map((item) =>
                    item.label === size.label ? { ...item, stock: Number(event.target.value) } : item,
                  ),
                })
              }
              className="mt-1 h-11 w-full border border-line bg-paper px-2 text-sm font-normal"
            />
          </label>
        ))}
      </div>
      {canRemove ? (
        <button type="button" className="text-left text-sm underline decoration-accent decoration-2 underline-offset-4" onClick={onRemove}>
          Remove colour
        </button>
      ) : null}
    </fieldset>
  )
}

function ImageField({
  id,
  label,
  src,
  onSrc,
  onError,
}: {
  id: string
  label: string
  src: string
  onSrc: (src: string) => void
  onError: (message: string) => void
}) {
  const [busy, setBusy] = useState(false)
  return (
    <div>
      <Field id={id} label={label} value={src} onChange={onSrc} />
      <label className="mt-2 block text-sm" htmlFor={`${id}-file`}>
        Upload a replacement
        <input
          id={`${id}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (!file) return
            setBusy(true)
            const body = new FormData()
            body.set("file", file)
            const result = await uploadAdminImage(body)
            setBusy(false)
            if (result.src) onSrc(result.src)
            else onError(result.error ?? "Could not upload.")
          }}
        />
      </label>
      {busy ? <p className="mt-1 text-sm">Uploading.</p> : null}
      {src ? <img src={src} alt="" className="mt-2 h-28 w-24 object-cover" /> : null}
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm font-normal"
      />
    </label>
  )
}

function TextArea({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <textarea
        id={id}
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm font-normal"
      />
    </label>
  )
}

function SaveButton({ pending, onSave }: { pending: boolean; onSave: () => void }) {
  return (
    <button type="button" disabled={pending} onClick={onSave} className="h-11 bg-accent px-4 text-sm text-paper disabled:opacity-60">
      {pending ? "Saving" : "Save"}
    </button>
  )
}

function replace<T>(list: T[], index: number, next: T) {
  return list.map((item, itemIndex) => (itemIndex === index ? next : item))
}

function uniqueSlug(base: string, used: string[]) {
  let slug = base
  let count = 2
  while (used.includes(slug)) {
    slug = `${base}-${count}`
    count += 1
  }
  return slug
}

function blankColour(index: number): ProductColour {
  return {
    id: `colour-${index + 1}-${Math.random().toString(36).slice(2, 7)}`,
    name: "Colour",
    hex: "#221f1c",
    images: [{ src: "/images/tee-charcoal.jpg", alt: "Product photo" }],
    sizes: sizeLabels.map((label) => ({ label, stock: 0 })),
  }
}
