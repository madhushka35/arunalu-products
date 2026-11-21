import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export const ORDER_STEPS = ["Product", "Your details", "Review", "Submitted"] as const

/**
 * Figma "Stepper" (Current = 1–4): 32px circles, done = teal + check,
 * current = navy, upcoming = white + border; connectors teal when passed.
 */
export function Stepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Order request progress">
      {ORDER_STEPS.map((label, idx) => {
        const i = idx + 1
        const done = i < current || current === 4
        const now = i === current && current !== 4
        return (
          <li key={label} className={cn("flex items-center gap-3", i < 4 && "flex-1")}>
            <span className="flex items-center gap-2.5" aria-current={now ? "step" : undefined}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  done && "bg-teal text-navy",
                  now && "bg-navy text-white",
                  !done && !now && "border border-line bg-white text-ink-muted"
                )}
              >
                {done ? <Check aria-hidden className="size-4" /> : i}
              </span>
              <span className={cn("text-sm font-medium whitespace-nowrap", done || now ? "text-navy" : "text-ink-muted")}>
                {label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </span>
            {i < 4 && <span aria-hidden className={cn("h-0.5 flex-1", i < current ? "bg-teal" : "bg-line")} />}
          </li>
        )
      })}
    </ol>
  )
}

/** Mobile progress: "Step N of 4 · Label" + 4px bar (Figma Order Request – Mobile). */
export function MobileProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="type-overline text-teal-strong">
        Step {current} of 4 · {ORDER_STEPS[current - 1]}
      </p>
      <div
        className="h-1 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={current}
        aria-label="Order request progress"
      >
        <div className="h-full bg-teal transition-[width] duration-300" style={{ width: `${(current / 4) * 100}%` }} />
      </div>
    </div>
  )
}
