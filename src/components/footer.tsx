import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { brand } from "@/config/brand"
import { categories } from "@/data/products"
import { photoCreditNote } from "@/data/image-credits"
import { formatPhone } from "@/lib/format"
import { NewsletterForm } from "@/components/newsletter-form"

const information = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/exchange-returns", label: "Exchange & Return Policy" },
  { href: "/terms", label: "Terms & Condition" },
  { href: "/shipping", label: "Shipping & Delivery Policy" },
]

const useful = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
]

const socials = [
  {
    href: brand.social.facebook,
    label: "Facebook",
    path: "M14.5 8.5V6.8c0-.5.3-.8.8-.8h1.5V3.5h-2.2C12.2 3.5 11 5 11 7.1v1.4H9v2.5h2V20h2.7v-8.9h2.1l.4-2.6h-2.5z",
  },
  {
    href: brand.social.instagram,
    label: "Instagram",
    path: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8A3.2 3.2 0 0 0 19.2 16V8A3.2 3.2 0 0 0 16 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.3 6.7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z",
  },
  {
    href: brand.social.linkedin,
    label: "LinkedIn",
    path: "M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6a2.1 2.1 0 0 0-2 1.4 2.6 2.6 0 0 0-.1.9V20H11V9h2.4v1.5a3.4 3.4 0 0 1 3.1-1.7c2.2 0 3.5 1.4 3.5 4.5V20z",
  },
  {
    href: brand.social.youtube,
    label: "YouTube",
    path: "M22 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C17.9 5 12 5 12 5s-5.9 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12.2 2 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1C6.1 19.4 12 19.4 12 19.4s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3L10 15.5z",
  },
]

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">{title}</h2>
      {children}
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_1.15fr_0.85fr_1.25fr] lg:gap-8 md:px-8">
        <div>
          <Link href="/" aria-label={brand.name} className="inline-flex items-center gap-3">
            <Image src="/brand/rcs-mark-gold.png" alt="" width={88} height={56} className="h-12 w-auto" />
            <span className="font-display text-2xl font-semibold uppercase leading-none tracking-wide">
              Ranebennur
            </span>
          </Link>
          <ul className="mt-6 space-y-3 text-sm text-paper/80">
            <li>
              <a href={brand.location.href} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-paper">
                <MapPin aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
                <span>
                  {brand.location.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </a>
            </li>
            <li>
              <a href={`tel:${brand.phones.footer}`} className="flex items-center gap-2 hover:text-paper">
                <Phone aria-hidden="true" size={16} className="shrink-0" />
                {formatPhone(brand.phones.footer)}
              </a>
            </li>
          </ul>
          <ul className="mt-5 flex items-center gap-1">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid size-9 place-items-center"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d={item.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Column title="Categories">
          <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/collections/${category.slug}`} className="hover:text-paper">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Information">
          <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
            {information.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Useful links">
          <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
            {useful.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Newsletter signup">
          <p className="mt-4 text-sm text-paper/80">Subscribe to our newsletter and get latest updates</p>
          <NewsletterForm />
        </Column>
      </div>
      <p className="mx-auto max-w-[1440px] border-t border-paper/15 px-4 py-4 text-xs text-paper/55 md:px-8">
        {photoCreditNote}
      </p>
    </footer>
  )
}
