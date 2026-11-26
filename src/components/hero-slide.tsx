"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useContent } from "@/components/content-provider"
import { cn } from "@/lib/cn"

export function HeroSlide() {
  const slides = useContent().brand.slides
  const [index, setIndex] = useState(0)
  const slide = slides[index] ?? slides[0]

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (!slide) return null

  return (
    <section
      className="relative isolate h-[calc(100svh-15.5rem)] min-h-[220px] max-h-[640px] w-full overflow-hidden bg-paper-deep"
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
            "object-cover transition-opacity duration-500",
            itemIndex === index ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition: item.imagePosition }}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-4 py-5 text-paper md:px-8 md:py-8">
        <h1 className="max-w-xl font-display text-5xl font-semibold uppercase leading-[0.86] sm:text-7xl lg:text-8xl">
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
