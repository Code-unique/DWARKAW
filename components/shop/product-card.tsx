"use client"

import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/currency"
import { useCurrency } from "@/components/currency-provider"

interface ProductCardProps {
  product: {
    _id: string
    name: string
    slug: string
    priceNPR: number
    priceUSD: number
    images: string[]
    fabric: string
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useCurrency()
  const price = currency === "NPR" ? product.priceNPR : product.priceUSD

  if (!product) return null

  return (
    <Link 
      href={`/shop/${product.slug}`} 
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-muted/50 to-muted rounded-lg mb-3 shadow-sm transition-shadow group-hover:shadow-md">
        <Image
          src={product.images?.[0] || "/images/hero.jpg"}
          alt={product.name || "Product image"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {product.fabric && (
          <span className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full shadow-sm border border-border/50">
            {product.fabric.replace("-", " & ")}
          </span>
        )}
        
        {/* Quick view indicator - subtle */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="space-y-1.5 px-1">
        <h3 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground font-mono tracking-tight">
          {formatPrice(price, currency)}
        </p>
      </div>
    </Link>
  )
}