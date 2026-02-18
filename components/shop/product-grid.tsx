"use client"

import { ProductCard } from "./product-card"
import { PackageX } from "lucide-react"

interface ProductGridProps {
  products: any[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-muted/30 rounded-full p-4 mb-4">
          <PackageX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Try adjusting your filters or search criteria to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {products.map((product, index) => (
        <div 
          key={product._id} 
          className="animate-in fade-in duration-500"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}