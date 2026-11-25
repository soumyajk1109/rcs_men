import type { Metadata } from "next"
import { brand } from "@/config/brand"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "About us",
  description: brand.description,
}

export default function AboutPage() {
  return (
    <InfoPage title="About us">
      <p>
        Ranebennur Cloth Stores is a men&apos;s cloth shop in Ranebennur. The floor is oversized t-shirts, shirts,
        co-ord sets, and outerwear.
      </p>
      <p>Prices on this site are in INR. Call the store if you want a piece held or brought to you.</p>
    </InfoPage>
  )
}
