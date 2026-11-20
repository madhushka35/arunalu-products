import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SiteLogoProps = {
  /** "light" = full-colour logo for white backgrounds, "dark" = reversed logo for navy. */
  theme?: "light" | "dark"
  className?: string
  priority?: boolean
  onClick?: () => void
}

/** Official Arunalu Products logo (640×518 PNG), linked to the homepage. */
export function SiteLogo({
  theme = "light",
  className,
  priority,
  onClick,
}: SiteLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
        className
      )}
    >
      <Image
        src={
          theme === "dark"
            ? "/images/brand/arunalu-logo-dark.png"
            : "/images/brand/arunalu-logo-light.png"
        }
        alt="Arunalu Products — home"
        width={640}
        height={518}
        priority={priority}
        sizes="96px"
        className="h-full w-auto"
      />
    </Link>
  )
}
