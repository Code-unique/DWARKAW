import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/home/hero"
import { FabricShowcase } from "@/components/home/fabric-showcase"
import { FeaturedProducts } from "@/components/home/featured-products"
import { BrandStoryPreview } from "@/components/home/brand-story-preview"
import { Newsletter } from "@/components/home/newsletter"
import { Suspense } from "react"

function FeaturedProductsSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center mb-16">
        <div className="h-3 w-24 bg-muted rounded mx-auto mb-3" />
        <div className="h-8 w-48 bg-muted rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-muted mb-4 animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FabricShowcase />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <BrandStoryPreview />
      <Newsletter />
      <Footer />
    </main>
  )
}
