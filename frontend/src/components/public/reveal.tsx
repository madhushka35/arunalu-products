"use client"

import { motion } from "framer-motion"

const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Position in a staggered group (60ms per step). */
  index?: number
  as?: "div" | "li" | "section" | "article"
}

/**
 * Reveal on scroll (design spec): 16px translate + fade, 550ms,
 * cubic-bezier(0.22, 1, 0.36, 1), once per element, 60ms stagger.
 * prefers-reduced-motion: neutralised in CSS ([data-reveal] in globals.css),
 * so server and client markup stay identical.
 */
export function Reveal({ children, className, index = 0, as = "div" }: RevealProps) {
  const Component = motion[as]
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
    >
      {children}
    </Component>
  )
}
