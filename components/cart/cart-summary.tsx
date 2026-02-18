"use client"

import Link from "next/link"
import { useCart } from "./cart-provider"
import { useCurrency } from "../currency-provider"
import { formatPrice } from "@/lib/currency"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function CartSummary() {
  const { totalItems, totalNPR, totalUSD } = useCart()
  const { currency } = useCurrency()
  const { isSignedIn } = useUser()

  const subtotal = currency === "NPR" ? totalNPR : totalUSD
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  if (totalItems === 0) return null

  return (
    <div className="bg-card p-6 border border-border">
      <h2 className="text-xs tracking-wider uppercase mb-6">Order Summary</h2>

      <div className="flex flex-col gap-4 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping, currency)}</span>
        </div>
        <div className="border-t border-border pt-4 flex justify-between text-base font-medium">
          <span>Total</span>
          <span className="font-serif text-lg">{formatPrice(total, currency)}</span>
        </div>
      </div>

      <Link href={isSignedIn ? "/checkout" : "/sign-in?redirect=/checkout"}>
        <Button className="w-full py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90">
          Proceed to Checkout
        </Button>
      </Link>

      <p className="text-[10px] text-muted-foreground text-center mt-4">
        Taxes calculated at checkout
      </p>
    </div>
  )
}