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

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
        <Image
          src={product.images?.[0] || "/images/hero.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
        <span className="absolute bottom-3 left-3 bg-background/90 px-2 py-1 text-[10px] tracking-wider uppercase text-muted-foreground">
          {product.fabric.replace("-", " & ")}
        </span>
      </div>
      <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground">{formatPrice(price, currency)}</p>
    </Link>
  )
}
