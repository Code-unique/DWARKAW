"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    slug: string
    priceNPR: number
    priceUSD: number
    images: string[]
    sizes: string[]
    colors: { name: string; hex: string }[]
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { currency } = useCurrency()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "")
  const [quantity, setQuantity] = useState(1)

  const price = currency === "NPR" ? product.priceNPR : product.priceUSD

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      size: selectedSize,
      color: selectedColor,
      priceNPR: product.priceNPR,
      priceUSD: product.priceUSD,
      quantity,
    })
    toast.success(`${product.name} added to your bag.`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Price */}
      <div>
        <p className="text-2xl font-serif">{formatPrice(price, currency)}</p>
      </div>

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "min-w-[48px] border px-3 py-2 text-xs tracking-wider uppercase transition-colors",
                  selectedSize === size
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">
            Color: {selectedColor}
          </p>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  selectedColor === color.name
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">Quantity</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center border border-border hover:border-foreground transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-10 w-10 items-center justify-center border border-border hover:border-foreground transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <Button
        onClick={handleAddToCart}
        className="w-full py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90"
      >
        Add to Bag
      </Button>
    </div>
  )
}
