"use client"

import { cn } from "@/lib/cn"
import { formatMoney, useCurrency } from "@/lib/currency"

export function Price({ amount, className }: { amount: number; className?: string }) {
  const currency = useCurrency()
  return <span className={cn("tabular-nums", className)}>{formatMoney(amount, currency)}</span>
}
