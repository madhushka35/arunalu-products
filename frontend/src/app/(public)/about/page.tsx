import Image from "next/image"
import type { Metadata } from "next"

import { MediaImage } from "@/components/public/media-image"
import { PageHero } from "@/components/public/page-hero"
import { Reveal } from "@/components/public/reveal"
import { SectionHeading } from "@/components/public/section-heading"
import { illustrative } from "@/features/home/content"
import { productHref, products } from "@/features/products/catalog"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About us",
  description:
    "Arunalu Products is a Sri Lankan business specialising in preserved seafood, with a focus on local supply and international export of dried fish products.",
  alternates: { canonical: "/about" },
}

/*
 * Copy: Figma "About – Desktop" (Revision 02, company text supplied by
 * Arunalu Products). The supermarket and export-destination statements are
 * flagged in Figma for client confirmation before launch.
 * Not rendered: "Team & management" (names/roles not supplied).
 */

const facility = [
  { label: "Seafood processing", key: "processing" as const },
  { label: "Machine-assisted drying", key: "drying" as const },
  { label: "Packaging process", key: "packaging" as const },
]

const commitments = [
  ["Product quality", "Traditional preservation knowledge combined with modern processing practices."],
  ["Responsible sourcing", "A continued focus on how raw seafood is sourced."],
  ["Customer satisfaction", "Serving local and international customers."],
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
        overline="About Arunalu Products"
        title="Preserving Sri Lanka’s seafood heritage."
        body="Dried fish processing, preserved seafood manufacturing, packaging and supply."
      />

      {/* Company story */}
      <section aria-labelledby="story-title" className="section-y bg-white">
        <div className="container-site grid items-start gap-10 xl:grid-cols-[520px_1fr] xl:gap-20">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
            <Image
              src="/images/products/dried-prawns-100g.jpg"
              alt="Arunalu Dried Prawns 100g pack"
              fill
              sizes="(min-width: 1280px) 520px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal index={1} className="flex flex-col gap-5">
            <p className="type-overline text-teal-strong">Our story</p>
            <h2 id="story-title" className="type-h2 text-navy">
              Arunalu Products
            </h2>
            <p className="text-lg leading-relaxed text-ink">
              Arunalu Products is a Sri Lankan business specializing in preserved seafood, with a
              strong focus on the local supply and international export of dried fish products.
            </p>
            <p className="text-base leading-relaxed text-ink/85">
              The business began as a supplier of dried fish, driven by a passion for preserving Sri
              Lanka’s rich seafood heritage while responding to the evolving needs of modern markets.
            </p>
            <p className="text-base leading-relaxed text-ink/85">
              Today, Arunalu Products serves customers across local and international markets,
              including leading supermarket chains in Sri Lanka such as Keells, Cargills, Arpico,
              Glomark and SPAR.
            </p>
            <p className="text-base leading-relaxed text-ink/85">
              The company also reports export activity in the United States, Canada, the United
              Kingdom, South Korea, Australia and New Zealand, with a product portfolio of more than
              20 dried seafood products.
            </p>
            <p className="text-base leading-relaxed text-ink/85">
              Building on its experience, Arunalu Products aims to bring together traditional
              seafood-preservation knowledge and modern processing practices, with a continued focus
              on product quality, responsible sourcing and customer satisfaction.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-label="Mission and vision" className="section-y bg-navy text-white">
        <div className="container-site grid gap-6 md:grid-cols-2">
          {[
            [
              "Our mission",
              "To supply premium-grade preserved seafood products to customers in Sri Lanka and around the world by combining traditional methods with modern processing standards. We strive to meet evolving market needs through consistent quality, responsible sourcing, food-safety practices and a commitment to customer satisfaction.",
            ],
            [
              "Our vision",
              "To become one of the most trusted names in Sri Lanka’s preserved seafood industry and a recognised name in international markets by consistently delivering high-quality products and pursuing excellence in every aspect of our business.",
            ],
          ].map(([title, text], i) => (
            <Reveal key={title} index={i} className="flex flex-col gap-5 rounded-md border border-white/15 p-7 md:p-12">
              <h2 className="type-overline text-teal">{title}</h2>
              <p className="text-lg leading-relaxed">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our products */}
      <section aria-labelledby="about-products" className="section-y bg-white">
        <div className="container-site flex flex-col gap-10">
          <SectionHeading id="about-products" overline="Our products" title="Dried fish and preserved seafood." />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5">
            {products.map((p, i) => (
              <Reveal as="li" index={i} key={p.slug}>
                <Link href={productHref(p.slug)} className="group flex flex-col gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-teal/60">
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-surface">
                    <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1280px) 240px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
                  </span>
                  <span className="text-sm font-medium text-navy">{p.name}</span>
                  <span className="text-[13px] text-ink-muted">{p.packSize}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Processing (illustrative imagery until real photos are supplied) */}
      <section aria-labelledby="about-processing" className="section-y bg-surface">
        <div className="container-site flex flex-col gap-10">
          <SectionHeading id="about-processing" overline="Processing" title="From sourcing to packing." />
          <ul className="grid gap-6 md:grid-cols-3">
            {facility.map((f, i) => (
              <Reveal as="li" index={i} key={f.label} className="flex flex-col gap-3">
                <div className="relative h-[260px] overflow-hidden rounded-md xl:h-[360px]">
                  <MediaImage src={illustrative[f.key]} alt={`${f.label} — illustrative image`} label={`${f.label} · illustrative`} tone="deep" sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <p className="text-sm font-medium text-navy">{f.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Commitment */}
      <section aria-labelledby="about-commitment" className="section-y bg-sand">
        <div className="container-site flex flex-col gap-10">
          <SectionHeading id="about-commitment" overline="Our commitment" title="Quality, responsible sourcing and customer satisfaction." titleClassName="max-w-[820px]" />
          <ul className="grid gap-6 md:grid-cols-3">
            {commitments.map(([title, text], i) => (
              <Reveal as="li" index={i} key={title} className="flex flex-col gap-3 rounded-md bg-white p-8">
                <h3 className="type-h4 text-navy">{title}</h3>
                <p className="text-sm text-ink-muted">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
