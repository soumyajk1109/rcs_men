"use client"

import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/cn"

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",")

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  side?: "left" | "right" | "center"
  id?: string
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  side = "right",
  id,
}: DialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])

    const preferred = panel?.querySelector<HTMLElement>("[data-autofocus]")
    const initial = preferred ?? focusables()[0] ?? panel
    initial?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== "Tab" || !panel) return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute z-10 flex flex-col bg-paper text-ink shadow-xl outline-none",
          side === "right" && "drawer-right inset-y-0 right-0 w-full max-w-md",
          side === "left" && "drawer-left inset-y-0 left-0 w-full max-w-sm",
          side === "center" &&
            "inset-x-4 top-[8vh] mx-auto max-h-[84vh] w-full max-w-lg",
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <h2 id={titleId} className="font-display text-2xl font-semibold uppercase leading-none">
            {title}
          </h2>
          <button
            type="button"
            className="grid size-11 place-items-center"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
