"use client"

import Link from "next/link"
import { useCart } from "./cart-provider"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"
import { Button } from "@/components/ui/button"

export function CartSummary() {
  const { totalNPR, totalUSD, totalItems } = useCart()
  const { currency } = useCurrency()
  const total = currency === "NPR" ? totalNPR : totalUSD

  return (
    <div className="bg-card p-6 border border-border">
      <h2 className="text-xs tracking-wider uppercase mb-6">Order Summary</h2>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
          <span>{formatPrice(total, currency)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-xs text-muted-foreground">Calculated at checkout</span>
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      <div className="flex justify-between text-base font-medium mb-6">
        <span>Total</span>
        <span className="font-serif text-lg">{formatPrice(total, currency)}</span>
      </div>

      <Button asChild className="w-full py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
        Shipping and taxes calculated at checkout. Free shipping on orders above NPR 10,000.
      </p>
    </div>
  )
}
