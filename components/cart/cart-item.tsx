"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { useCurrency } from "../currency-provider"
import { formatPrice } from "@/lib/currency"

interface CartItemProps {
  item: {
    productId: string
    name: string
    image: string
    size: string
    color: string
    priceNPR: number
    priceUSD: number
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()
  const { currency } = useCurrency()

  const price = currency === "NPR" ? item.priceNPR : item.priceUSD
  const total = price * item.quantity

  return (
    <div className="flex gap-6 py-6 border-b border-border last:border-0">
      {/* Image */}
      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted">
        <Image
          src={item.image || "/images/hero.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium">{item.name}</h3>
          <p className="text-sm font-serif">{formatPrice(total, currency)}</p>
        </div>

        <p className="text-xs text-muted-foreground mb-2">
          {item.size} / {item.color}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center border border-border hover:border-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-xs">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              className="flex h-6 w-6 items-center justify-center border border-border hover:border-foreground transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}