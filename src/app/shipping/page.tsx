import type { Metadata } from "next"
import { brand } from "@/config/brand"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "Shipping and delivery policy",
  description: "How to ask Ranebennur Cloth Stores about delivery.",
}

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping & delivery policy">
      <p>Call the store to ask about delivery from Ranebennur. The shop confirms timing and charges on the call.</p>
      <p>
        <a
          className="underline decoration-accent decoration-2 underline-offset-4"
          href={brand.location.href}
          target="_blank"
          rel="noreferrer"
        >
          Open the store location
        </a>
        .
      </p>
    </InfoPage>
  )
}
