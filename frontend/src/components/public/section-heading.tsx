import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  overline: string
  title: string
  body?: string
  /** Light text for navy / ocean sections (overline turns sand). */
  dark?: boolean
  center?: boolean
  titleAs?: "h1" | "h2"
  id?: string
  className?: string
  titleClassName?: string
}

/** Figma "Section Heading": overline (teal / sand on dark) + H2 + optional lead. */
export function SectionHeading({
  overline,
  title,
  body,
  dark,
  center,
  titleAs: Title = "h2",
  id,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        center && "items-center text-center",
        className
      )}
    >
      <p className={cn("type-overline", dark ? "text-sand" : "text-teal-strong")}>
        {overline}
      </p>
      <Title
        id={id}
        className={cn(
          "type-h2 max-w-[720px] text-balance",
          dark ? "text-white" : "text-navy",
          titleClassName
        )}
      >
        {title}
      </Title>
      {body && (
        <p
          className={cn(
            "max-w-[640px] text-base leading-relaxed xl:text-lg",
            dark ? "text-white/72" : "text-ink-muted"
          )}
        >
          {body}
        </p>
      )}
    </div>
  )
}
