import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "Exchange and return policy",
  description: "How to exchange an unworn piece at Ranebennur Cloth Stores.",
}

export default function ExchangePage() {
  return (
    <InfoPage title="Exchange & return policy">
      <p>
        Bring an unworn piece, with its tags attached, back to the store within 7 days of purchase. Call before you
        visit and the shop will confirm what can be exchanged.
      </p>
    </InfoPage>
  )
}
