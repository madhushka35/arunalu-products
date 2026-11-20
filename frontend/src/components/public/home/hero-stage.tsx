"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { cn } from "@/lib/utils"

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false })

const QUERY = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)"

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", cb)
  return () => mql.removeEventListener("change", cb)
}

/** Static poster = the Figma composition; also the reduced-motion fallback. */
const POSTER = [
  { src: "/images/hero/dried-prawns-100g.jpg", alt: "", x: 160, y: 150, w: 280, h: 360, rot: 8 },
  { src: "/images/hero/head-on-sprats-200g.jpg", alt: "Arunalu Head-on Sprats pack", x: 40, y: 250, w: 330, h: 430, rot: -4 },
  { src: "/images/hero/baby-shrimp-100g.jpg", alt: "", x: 330, y: 520, w: 190, h: 210, rot: 12 },
]

/**
 * Right-hand hero stage (desktop ≥1280px), 560×900 like the Figma frame.
 * The WebGL scene is loaded after first paint and only when the viewport is
 * desktop-sized and motion is allowed; the poster stays until it is ready.
 */
export function HeroStage() {
  const allow3d = React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
  const [idle, setIdle] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const onReady = React.useCallback(() => setReady(true), [])

  React.useEffect(() => {
    if (!allow3d) return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const t = setTimeout(() => setIdle(true), 600)
    return () => clearTimeout(t)
  }, [allow3d])

  const show3d = allow3d && idle

  return (
    <div className="pointer-events-none absolute top-0 right-0 hidden h-[900px] w-[560px] xl:block">
      {/* Depth / Orbit Ring */}
      <div
        className={cn(
          "absolute top-[150px] left-0 size-[560px] rounded-full border border-teal/35 transition-opacity duration-500",
          show3d && ready && "opacity-0"
        )}
      />
      {/* 3D Layer / … poster */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          show3d && ready && "opacity-0"
        )}
      >
        {POSTER.map((p, i) => (
          <div
            key={p.src}
            className="absolute overflow-hidden rounded-[6px] shadow-[0_24px_48px_-16px_rgb(5_16_28/0.6)] motion-safe:animate-[hero-float_7s_ease-in-out_infinite]"
            style={
              {
                left: p.x,
                top: p.y,
                width: p.w,
                height: p.h,
                "--r": `${p.rot}deg`,
                transform: `rotate(${p.rot}deg)`,
                animationDelay: `${i * -2.3}s`,
              } as React.CSSProperties
            }
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              priority={i === 1}
              sizes={`${p.w}px`}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {show3d && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            ready && "opacity-100"
          )}
        >
          <HeroScene onReady={onReady} />
        </div>
      )}
    </div>
  )
}
