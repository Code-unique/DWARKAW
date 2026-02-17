import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about DWARKA, a Nepal-based sustainable fashion brand by Merina Giri, dedicated to natural fabrics and slow fashion.",
}

const values = [
  {
    title: "Sustainability First",
    description:
      "Every decision we make is filtered through our commitment to the environment. From sourcing natural fibers to using plant-based dyes, we ensure our footprint remains gentle.",
  },
  {
    title: "Artisan Craftsmanship",
    description:
      "We work with skilled artisans across Nepal, preserving traditional weaving and dyeing techniques while providing fair wages and dignified working conditions.",
  },
  {
    title: "Timeless Design",
    description:
      "We design pieces that transcend seasons. Our garments are meant to be worn, loved, and passed on -- not discarded after a single season.",
  },
]

const fabricBenefits = [
  {
    name: "Cotton",
    benefits: [
      "Breathable and hypoallergenic",
      "Grown without synthetic pesticides",
      "Biodegradable at end of life",
      "Gets softer with every wash",
    ],
  },
  {
    name: "Hemp",
    benefits: [
      "Requires 50% less water than cotton",
      "Naturally pest-resistant",
      "Strongest natural fiber available",
      "UV and mould resistant",
    ],
  },
  {
    name: "Linen",
    benefits: [
      "Made from flax requiring minimal water",
      "Naturally temperature-regulating",
      "Antibacterial properties",
      "Fully biodegradable",
    ],
  },
]

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src="/images/about-hero.jpg"
          alt="Artisan hands weaving natural fabric on a traditional loom"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-primary-foreground/80 mb-4">
            Our Story
          </p>
          <h1 className="brand-name text-4xl md:text-6xl text-primary-foreground">
            DWARKA
          </h1>
        </div>
      </section>

      {/* Founder Story */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/brand-story.jpg"
              alt="Merina Giri, founder of DWARKA"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              The Founder
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-balance leading-tight">
              Merina Giri{"'"}s Vision
            </h2>
            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                Merina Giri, a fashion designer and instructor based in Nepal, founded DWARKA with a singular conviction: that fashion can be a force for good. Having witnessed the devastating impact of fast fashion on communities and ecosystems, she set out to prove that luxury and sustainability are not contradictions.
              </p>
              <p>
                Drawing from Nepal{"'"}s rich textile heritage, Merina works directly with local farmers and artisans, creating a supply chain that is transparent, ethical, and deeply rooted in tradition. Every DWARKA piece is a testament to the skill of Nepali craftspeople and the abundance of natural resources that the Himalayan region provides.
              </p>
              <p>
                {"\""}I believe clothing should tell a story,{"\""}  Merina says. {"\""}When you wear DWARKA, you carry with you the hands that wove the fabric, the earth that grew the fiber, and the tradition that shaped the design.{"\""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <h3 className="font-serif text-xl mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fabric Education */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Know Your Fabrics
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Why Natural Fibers Matter
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {fabricBenefits.map((fabric) => (
            <div key={fabric.name} className="border border-border p-8">
              <h3 className="font-serif text-xl mb-4">{fabric.name}</h3>
              <ul className="flex flex-col gap-3">
                {fabric.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-background mb-4">
            Join the Slow Fashion Movement
          </h2>
          <p className="text-sm text-background/60 mb-10 max-w-md mx-auto leading-relaxed">
            Discover garments crafted with intention, designed to last, and made with respect for our planet.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-background/60 px-10 py-3 text-xs tracking-[0.25em] uppercase text-background hover:bg-background hover:text-foreground transition-all duration-300"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
