"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartItem } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/components/cart/cart-provider"

export default function CartPage() {
  const { items } = useCart()

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Your Bag
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Shopping Bag</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
              <h2 className="font-serif text-2xl mb-2">Your bag is empty</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Explore our collection and find something you love.
              </p>
              <Link
                href="/shop"
                className="border border-foreground px-10 py-3 text-xs tracking-[0.25em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {items.map((item) => (
                  <CartItem
                    key={`${item.productId}-${item.size}-${item.color}`}
                    item={item}
                  />
                ))}
                <Link
                  href="/shop"
                  className="inline-block mt-6 text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
              <div>
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
