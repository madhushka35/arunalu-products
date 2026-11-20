import { MediaImage } from "@/components/public/media-image"
import { Reveal } from "@/components/public/reveal"
import { packaging } from "@/features/home/content"

/** 09 Packaging Showcase (sand; tablet + desktop — not part of the mobile design). */
export function PackagingSection() {
  return (
    <section aria-labelledby="packaging-title" className="section-y hidden bg-sand md:block">
      <div className="container-site flex flex-col gap-8 xl:gap-12">
        <Reveal className="flex flex-col gap-4">
          <p className="type-overline text-teal-strong">{packaging.overline}</p>
          <h2 id="packaging-title" className="type-h2 max-w-[720px] text-navy">
            {packaging.title}
          </h2>
        </Reveal>
        <ul className="grid grid-cols-3 gap-6">
          {packaging.items.map((item, i) => (
            <Reveal as="li" index={i} key={item.title} className="flex flex-col gap-4">
              <div className="relative h-[300px] overflow-hidden rounded-sm bg-navy xl:h-[480px]">
                <MediaImage
                  src={item.image}
                  alt={`${item.title}${item.image?.startsWith("/images/products") ? "" : " — illustrative image"}`}
                  label={`${item.title} · pack shot`}
                  tone="dark"
                  sizes="(min-width: 1280px) 410px, 33vw"
                />
              </div>
              <h3 className="type-h4 text-navy">{item.title}</h3>
              <p className="text-sm text-ink/75">{item.text}</p>
            </Reveal>
          ))}
        </ul>
        <p className="text-center type-h3 text-navy uppercase">{packaging.brandMessage}</p>
      </div>
    </section>
  )
}
