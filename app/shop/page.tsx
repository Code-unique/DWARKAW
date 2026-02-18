import type { Metadata } from "next"
import { Suspense } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"
import { getProducts } from "@/lib/actions/product-actions"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse DWARKA's collection of sustainable fashion pieces crafted from cotton, hemp, and linen.",
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    fabric?: string
    sort?: string
    search?: string
  }>
}

async function ShopContent({ searchParams }: ShopPageProps) {
  const params = await searchParams
  
  try {
    const products = await getProducts({
      category: params.category,
      fabric: params.fabric,
      sort: params.sort,
      search: params.search,
    })
    
    // Ensure products is an array
    const productsArray = Array.isArray(products) ? products : []
    
    if (productsArray.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )
    }
    
    return <ProductGrid products={productsArray} />
  } catch (error) {
    console.error("Error fetching products:", error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again.</p>
      </div>
    )
  }
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-muted mb-4" />
          <div className="h-4 w-32 bg-muted rounded mb-2" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Collection
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Shop All</h1>
          </div>

          <div className="mb-8">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ShopContent searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  )
}