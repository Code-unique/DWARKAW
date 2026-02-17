import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts } from "@/lib/actions/product-actions"
import { formatPrice } from "@/lib/currency"

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products || products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Curated Selection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">Featured Pieces</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Collection coming soon. Please seed the database to see products.</p>
          <Link
            href="/api/seed"
            className="mt-4 inline-block border border-border px-6 py-2 text-xs tracking-wider uppercase hover:bg-muted transition-colors"
          >
            Seed Database
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Curated Selection
        </p>
        <h2 className="font-serif text-3xl md:text-4xl">Featured Pieces</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: Record<string, string | number | string[]>) => (
          <Link
            key={product._id as string}
            href={`/shop/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
              <Image
                src={(product.images as string[])?.[0] || "/images/hero.jpg"}
                alt={product.name as string}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm font-medium mb-1">{product.name as string}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPrice(product.priceNPR as number, "NPR")}
              <span className="mx-2 text-border">{"/"}</span>
              {formatPrice(product.priceUSD as number, "USD")}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-block border border-foreground px-10 py-3 text-xs tracking-[0.25em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
