import Image from "next/image"
import Link from "next/link"

export function BrandStoryPreview() {
  return (
    <section className="bg-card">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/brand-story.jpg"
              alt="Merina Giri, founder and designer of DWARKA"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:pl-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              The Vision Behind DWARKA
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-balance leading-tight">
              Fashion That Honors the Earth
            </h2>
            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed mb-8">
              <p>
                Founded by Merina Giri in the heart of Nepal, DWARKA was born from a belief that fashion can be both beautiful and responsible. In an era dominated by fast fashion, we chose a different path.
              </p>
              <p>
                Every piece in our collection is crafted from natural fabrics -- cotton, hemp, and linen -- sourced from local farmers and woven by skilled artisans. We believe in garments that tell a story, that age with grace, and that tread lightly on our planet.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
