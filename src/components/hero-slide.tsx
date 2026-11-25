"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { brand } from "@/config/brand"
import { cn } from "@/lib/cn"

export function HeroSlide() {
  const slides = brand.slides
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <section
      className="relative isolate h-[min(88vw,calc(100svh-6.5rem))] min-h-[260px] w-full overflow-hidden bg-paper-deep md:h-[min(62vw,calc(100svh-6.5rem))]"
      aria-roledescription="carousel"
      aria-label="Campaign"
    >
      {slides.map((item, itemIndex) => (
        <Image
          key={item.image}
          src={item.image}
          alt={itemIndex === index ? item.imageAlt : ""}
          fill
          priority={itemIndex === 0}
          sizes="100vw"
          className={cn(
            "object-cover object-center transition-opacity duration-500",
            itemIndex === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-4 py-5 text-paper md:px-8 md:py-8">
        <p className="text-xs uppercase tracking-[0.18em] text-paper/80">{slide.eyebrow}</p>
        <h1 className="mt-2 max-w-xl font-display text-5xl font-semibold uppercase leading-[0.86] sm:text-7xl lg:text-8xl">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-paper/85">{slide.text}</p>
        <Link
          href={slide.href}
          className="pointer-events-auto mt-4 inline-flex text-sm font-medium underline decoration-accent decoration-2 underline-offset-4"
        >
          {slide.cta}
        </Link>
      </div>
    </section>
  )
}
