import type { Metadata } from "next"
import { brand } from "@/config/brand"
import { InfoPage } from "@/components/info-page"
import { formatPhone } from "@/lib/format"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call Ranebennur Cloth Stores or open the store location.",
}

export default function ContactPage() {
  return (
    <InfoPage title="Contact us">
      <p>
        Call{" "}
        <a className="underline decoration-accent decoration-2 underline-offset-4" href={`tel:${brand.phones.footer}`}>
          {formatPhone(brand.phones.footer)}
        </a>{" "}
        or{" "}
        <a className="underline decoration-accent decoration-2 underline-offset-4" href={`tel:${brand.phones.header}`}>
          {formatPhone(brand.phones.header)}
        </a>
        .
      </p>
      <p>
        <a
          className="underline decoration-accent decoration-2 underline-offset-4"
          href={brand.location.href}
          target="_blank"
          rel="noreferrer"
        >
          Open the store location
        </a>
        . The shop is in Ranebennur, Karnataka.
      </p>
    </InfoPage>
  )
}
