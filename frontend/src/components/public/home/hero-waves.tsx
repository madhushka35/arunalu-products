/** "Depth / Ocean Wave Lines" — 7 teal curves from the Figma hero (1440×460). */
export function HeroWaves({ className }: { className?: string }) {
  const paths = Array.from({ length: 7 }, (_, i) => {
    const d = `M0 ${220 + i * 26} C 240 ${140 + i * 28}, 480 ${320 + i * 18}, 720 ${230 + i * 24} S 1200 ${130 + i * 28}, 1440 ${240 + i * 22}`
    return { d, opacity: (0.34 - i * 0.04).toFixed(2) }
  })
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 460"
      preserveAspectRatio="none"
      fill="none"
      className={className}
    >
      {paths.map((p) => (
        <path
          key={p.d}
          d={p.d}
          stroke="#16B8B0"
          strokeOpacity={p.opacity}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
