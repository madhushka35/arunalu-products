import { Breadcrumbs, type Crumb } from "@/components/public/breadcrumbs"

type PageHeroProps = {
  crumbs: Crumb[]
  overline: string
  title: string
  /** Desktop lead (Body/Large). */
  body?: string
  /** Shorter tablet/mobile lead from the Figma tablet/mobile frames. */
  bodyCompact?: string
}

/**
 * Figma "Page Hero" for inner pages (ocean → navy).
 * Desktop: 64/80/80 padding, breadcrumb, overline, H1 52, Body/Large.
 * Tablet: 48/40/56, Mobile/H2. Mobile: 32/20/28, Mobile/H2, Body/Small.
 * Breadcrumbs appear in the desktop frame only.
 */
export function PageHero({ crumbs, overline, title, body, bodyCompact }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-b from-ocean to-navy text-white">
      <div className="container-site flex flex-col gap-6 pt-8 pb-7 md:pt-12 md:pb-14 xl:pt-16 xl:pb-20">
        <Breadcrumbs items={crumbs} dark className="hidden xl:block" />
        <div className="flex flex-col gap-3 md:gap-3.5 xl:gap-4 xl:pt-6">
          <p className="type-overline text-teal">{overline}</p>
          <h1 className="max-w-[840px] font-heading text-[30px] leading-[1.15] font-bold xl:text-[52px] xl:leading-[1.08]">
            {title}
          </h1>
          {(body || bodyCompact) && (
            <p className="max-w-[640px] text-sm leading-relaxed text-white/72 md:text-base xl:text-lg">
              {bodyCompact ? (
                <>
                  <span className="xl:hidden">{bodyCompact}</span>
                  <span className="hidden xl:inline">{body}</span>
                </>
              ) : (
                body
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
