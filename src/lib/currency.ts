"use client"

import { useSyncExternalStore } from "react"
import { brand } from "@/config/brand"

export const currencies = [
  { code: "INR", label: "INR ₹", rate: 1, locale: "en-IN", digits: 0 },
  { code: "USD", label: "USD $", rate: 0.012, locale: "en-US", digits: 2 },
  { code: "EUR", label: "EUR €", rate: 0.011, locale: "en-IE", digits: 2 },
  { code: "GBP", label: "GBP £", rate: 0.0092, locale: "en-GB", digits: 2 },
  { code: "AED", label: "AED", rate: 0.044, locale: "en-AE", digits: 2 },
] as const

export type CurrencyCode = (typeof currencies)[number]["code"]

const fallback = currencies[0]
let current: CurrencyCode = fallback.code
let loaded = false
const listeners = new Set<() => void>()

function isCurrency(value: string | null): value is CurrencyCode {
  return currencies.some((item) => item.code === value)
}

function readCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(brand.storageKeys.currency)
    if (isCurrency(stored)) return stored
  } catch {
    return fallback.code
  }
  return fallback.code
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  if (!loaded) {
    loaded = true
    current = readCurrency()
  }
  return current
}

function getServerSnapshot() {
  return fallback.code
}

export function setCurrency(code: CurrencyCode) {
  loaded = true
  current = code
  localStorage.setItem(brand.storageKeys.currency, code)
  for (const listener of listeners) listener()
}

export function useCurrency() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function formatMoney(amountInr: number, code: CurrencyCode) {
  const currency = currencies.find((item) => item.code === code) ?? fallback
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.digits,
    maximumFractionDigits: currency.digits,
  }).format(amountInr * currency.rate)
}
