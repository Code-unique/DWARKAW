"use client"

import { ProductCard } from "./product-card"

interface Product {
  _id: string
  name: string
  slug: string
  priceNPR: number
  priceUSD: number
  images: string[]
  fabric: string
  category: string
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your selection.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
