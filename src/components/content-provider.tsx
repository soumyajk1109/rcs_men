"use client"

import { createContext, useContext } from "react"
import { publishCatalog } from "@/lib/live-catalog"
import type { StoreContent } from "@/lib/store-content"

const ContentContext = createContext<StoreContent | null>(null)

export function ContentProvider({
  content,
  children,
}: {
  content: StoreContent
  children: React.ReactNode
}) {
  publishCatalog(content.categories, content.products)
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  const value = useContext(ContentContext)
  if (!value) throw new Error("useContent must be used within ContentProvider")
  return value
}
