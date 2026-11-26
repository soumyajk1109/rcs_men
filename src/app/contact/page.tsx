import type { Metadata } from "next"
import { Suspense } from "react"
import { InfoPage } from "@/components/info-page"
import { formatPhone } from "@/lib/format"
import { getContent } from "@/lib/content-store"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call Ranebennur Cloth Stores or open the store location.",
}

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm">Loading contact details.</p>}>
      <ContactBody />
    </Suspense>
  )
}

async function ContactBody() {
  const { brand } = await getContent()
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
