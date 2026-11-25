import type { Metadata } from "next"
import { Barlow_Condensed, Outfit } from "next/font/google"
import { brand } from "@/config/brand"
import { StoreProvider } from "@/lib/store"
import { SiteShell } from "@/components/site-shell"
import "./globals.css"

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display-face",
})

const sans = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-face",
})

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s · ${brand.shortName}`,
  },
  description: brand.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  )
}
