import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="DWARKA sustainable fashion collection featuring natural fabrics"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs tracking-[0.4em] uppercase text-primary-foreground/80">
          Sustainable Fashion from Nepal
        </p>
        <h1 className="brand-name text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6">
          DWARKA
        </h1>
        <p className="max-w-md text-lg md:text-xl text-primary-foreground/90 font-serif leading-relaxed mb-10">
          Rooted in nature, crafted by hand. Timeless pieces in cotton, hemp, and linen.
        </p>
        <Link
          href="/shop"
          className="border border-primary-foreground/60 px-10 py-3 text-xs tracking-[0.25em] uppercase text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-all duration-300"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  )
}
