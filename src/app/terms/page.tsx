import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "Terms and condition",
  description: "Prices, stock, and online checkout for Ranebennur Cloth Stores.",
}

export default function TermsPage() {
  return (
    <InfoPage title="Terms & condition">
      <p>Prices on this site are in INR and can change. A size is available only when the product page shows stock.</p>
      <p>Online checkout is not open yet. Call the store to buy a piece.</p>
    </InfoPage>
  )
}
