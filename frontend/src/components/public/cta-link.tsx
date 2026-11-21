import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

/** Button styles from the Figma "Button" component (Style variants). */
const VARIANTS = {
  primary:
    "bg-teal text-navy hover:bg-[#13a69f] focus-visible:ring-teal/60",
  outline:
    "border border-navy text-navy hover:bg-navy hover:text-white focus-visible:ring-teal/60",
  "outline-light":
    "border border-white/45 text-white hover:border-white hover:bg-white/10 focus-visible:ring-white/60",
  dark: "bg-navy text-white hover:bg-ocean focus-visible:ring-teal/60",
  text: "h-auto px-0 text-teal-strong hover:text-navy focus-visible:ring-teal/60",
} as const

export type CtaVariant = keyof typeof VARIANTS

const BASE =
  "group/cta inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 type-button whitespace-nowrap outline-none transition-colors duration-150 focus-visible:ring-3 motion-reduce:transition-none"

/** Same Figma "Button" styles for a <button> element (forms, admin actions). */
export function ctaClassName(variant: CtaVariant = "primary", className?: string) {
  return cn(BASE, VARIANTS[variant], "disabled:pointer-events-none disabled:opacity-50", className)
}

type CtaLinkProps = {
  href: string
  children: React.ReactNode
  variant?: CtaVariant
  /** Trailing arrow icon ("Show Icon" in Figma). Defaults to true for the text style. */
  icon?: boolean
  /** Stretch to the container width (mobile CTAs). */
  block?: boolean
  /** Text style on a dark background. */
  onDark?: boolean
  className?: string
  external?: boolean
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  icon,
  block,
  onDark,
  className,
  external,
}: CtaLinkProps) {
  const showIcon = icon ?? variant === "text"
  const classes = cn(
    BASE,
    VARIANTS[variant],
    variant === "text" && onDark && "text-teal hover:text-white",
    block && "w-full",
    className
  )
  const content = (
    <>
      {children}
      {showIcon && (
        <ArrowRight
          aria-hidden
          className="size-[18px] transition-transform duration-150 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  )
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
