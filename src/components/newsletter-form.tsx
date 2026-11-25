"use client"

import { useState } from "react"
import { brand } from "@/config/brand"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMessage("Enter a valid email address.")
      return
    }
    let parsed: unknown = []
    try {
      const saved = window.localStorage.getItem(brand.storageKeys.newsletter)
      parsed = saved ? JSON.parse(saved) : []
    } catch {
      parsed = []
    }
    const emails = Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []
    if (!emails.includes(value)) emails.push(value)
    window.localStorage.setItem(brand.storageKeys.newsletter, JSON.stringify(emails))
    setEmail("")
    setMessage("You are signed up for updates.")
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-full border border-paper/40 py-1 pr-1 pl-4">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-paper/55"
        />
        <button type="submit" className="h-10 shrink-0 rounded-full bg-accent px-4 text-sm text-paper">
          Subscribe
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-paper/75">
        {message}
      </p>
    </form>
  )
}
