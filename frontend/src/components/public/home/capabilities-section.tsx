import { Reveal } from "@/components/public/reveal"
import { HOME_ICONS } from "@/components/public/home/icons"
import { capabilities } from "@/features/home/content"

/**
 * 08 Manufacturing Capabilities (tablet + desktop; not part of the mobile design).
 * The statistics band renders only when verified figures are supplied.
 */
export function CapabilitiesSection() {
  return (
    <section aria-labelledby="capabilities-title" className="section-y hidden bg-white md:block">
      <div className="container-site flex flex-col gap-8 xl:gap-12">
        <Reveal className="flex flex-col gap-4">
          <p className="type-overline text-teal-strong">{capabilities.overline}</p>
          <h2 id="capabilities-title" className="type-h2 max-w-[760px] text-navy">
            {capabilities.title}
          </h2>
        </Reveal>
        <ul className="grid grid-cols-2 gap-6 xl:grid-cols-3">
          {capabilities.items.map((item, i) => {
            const Icon = HOME_ICONS[item.icon]
            return (
              <Reveal
                as="li"
                index={i % 3}
                key={item.title}
                className="flex flex-col gap-4 rounded-md border border-line p-8"
              >
                <span className="flex size-[52px] items-center justify-center rounded-md bg-navy">
                  <Icon aria-hidden className="size-6 text-teal" strokeWidth={1.75} />
                </span>
                <h3 className="type-h4 text-navy">{item.title}</h3>
                {item.text && <p className="text-sm text-ink-muted">{item.text}</p>}
              </Reveal>
            )
          })}
        </ul>

        {capabilities.statistics.length > 0 && (
          <dl className="grid gap-8 rounded-md bg-navy px-10 pt-2 pb-10 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.statistics.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-2 border-t-2 border-teal pt-7">
                <dt className="text-base text-white">{s.label}</dt>
                <dd className="type-h1 text-teal">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
