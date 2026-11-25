import Image from "next/image"
import { cn } from "@/lib/cn"

export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  pop = false,
}: {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
  pop?: boolean
}) {
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden bg-paper-deep", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover",
          pop &&
            "transition-transform duration-500 ease-[cubic-bezier(0.22,1.35,0.36,1)] group-hover:scale-[1.08]",
        )}
      />
    </div>
  )
}
