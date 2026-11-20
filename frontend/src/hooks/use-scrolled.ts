"use client"

import * as React from "react"

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}

/** True once the window has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 80) {
  return React.useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false
  )
}
