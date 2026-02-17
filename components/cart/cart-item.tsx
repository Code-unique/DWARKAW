"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { useCart, type CartItem as CartItemType } from "./cart-provider"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()
  const { currency } = useCurrency()
  const price = currency === "NPR" ? item.priceNPR : item.priceUSD

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <Link href={`/shop/${item.slug}`} className="relative h-28 w-20 shrink-0 overflow-hidden bg-muted">
        <Image
          src={item.image || "/images/hero.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/shop/${item.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
              {item.name}
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              {item.size && `Size: ${item.size}`}
              {item.size && item.color && " / "}
              {item.color && `Color: ${item.color}`}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Remove ${item.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center border border-border hover:border-foreground transition-colors"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-sm w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center border border-border hover:border-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <p className="text-sm font-medium">{formatPrice(price * item.quantity, currency)}</p>
        </div>
      </div>
    </div>
  )
}
