import type { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { readSession } from "@/lib/admin-session"
import { getContent } from "@/lib/content-store"
import { AdminDesk } from "@/components/admin-desk"

export const metadata: Metadata = {
  title: "Shop editor",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm">Loading the editor.</p>}>
      <AdminGate />
    </Suspense>
  )
}

async function AdminGate() {
  if (!(await readSession())) redirect("/admin/login")
  const content = await getContent()
  return <AdminDesk initial={content} />
}
