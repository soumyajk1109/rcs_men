"use client"

import { cn } from "@/lib/cn"
import { formatMoney, useCurrency } from "@/lib/currency"

export function Price({ amount, className }: { amount: number; className?: string }) {
  const currency = useCurrency()
  return <span className={cn("font-semibold tabular-nums text-accent", className)}>{formatMoney(amount, currency)}</span>
}
