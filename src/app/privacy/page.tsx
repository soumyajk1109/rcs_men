import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Ranebennur Cloth Stores stores cart, wishlist, and newsletter details in the browser.",
}

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy policy">
      <p>
        Your cart, wishlist, and currency choice stay in this browser. There is no account login on this site.
      </p>
      <p>
        A newsletter address you submit is saved only in this browser. It is not sent to a server.
      </p>
    </InfoPage>
  )
}
