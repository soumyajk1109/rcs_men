import { brand } from "@/config/brand"
import { photoCreditNote } from "@/data/image-credits"
import { formatPhone } from "@/lib/format"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-semibold uppercase leading-none">{brand.wordmark}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a href={brand.location.href} target="_blank" rel="noreferrer" className="hover:underline">
            {brand.location.label}
          </a>
          <a href={`tel:${brand.phones.footer}`} className="hover:underline">
            <span className="block">Contact us</span>
            <span className="block">{formatPhone(brand.phones.footer)}</span>
          </a>
        </div>
      </div>
      <p className="mx-auto max-w-[1440px] px-4 pb-6 text-xs text-muted md:px-8">{photoCreditNote}</p>
    </footer>
  )
}
