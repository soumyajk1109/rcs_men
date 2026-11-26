"use client"

import { useActionState } from "react"
import { login } from "@/app/admin/actions"

export function LoginForm() {
  const [state, action, pending] = useActionState(async (_previous: { error: string }, formData: FormData) => {
    return (await login(formData)) ?? { error: "" }
  }, { error: "" })

  return (
    <form className="mx-auto mt-10 max-w-sm border border-line bg-paper px-4 py-6" action={action}>
      <label className="block text-sm font-medium" htmlFor="admin-user">
        Username
      </label>
      <input
        id="admin-user"
        name="username"
        autoComplete="username"
        required
        className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm"
      />
      <label className="mt-4 block text-sm font-medium" htmlFor="admin-pass">
        Password
      </label>
      <input
        id="admin-pass"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-1 h-11 w-full border border-line bg-paper px-3 text-sm"
      />
      {state.error ? (
        <p className="mt-3 text-sm text-accent" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="mt-5 h-11 w-full bg-ink text-sm text-paper disabled:opacity-60">
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  )
}
