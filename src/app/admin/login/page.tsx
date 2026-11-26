import type { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { readSession } from "@/lib/admin-session"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-sm">Loading sign in.</p>}>
      <LoginGate />
    </Suspense>
  )
}

async function LoginGate() {
  if (await readSession()) redirect("/admin")
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-center font-display text-4xl font-semibold uppercase">Shop editor</h1>
      <LoginForm />
    </div>
  )
}
