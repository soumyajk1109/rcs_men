import Image from "next/image"
import { cn } from "@/lib/cn"

export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
}: {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden bg-paper-deep", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  )
}
