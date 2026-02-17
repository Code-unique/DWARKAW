"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useCart } from "@/components/cart/cart-provider"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"
import { createOrder } from "@/lib/actions/order-actions"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalNPR, totalUSD, clearCart } = useCart()
  const { currency } = useCurrency()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const total = currency === "NPR" ? totalNPR : totalUSD

  const [form, setForm] = useState({
    customerName: user?.fullName || "",
    street: "",
    city: "",
    state: "",
    country: "Nepal",
    postalCode: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    try {
      await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          priceNPR: item.priceNPR,
          priceUSD: item.priceUSD,
        })),
        totalNPR,
        totalUSD,
        customerName: form.customerName,
        customerEmail: user?.emailAddresses[0]?.emailAddress || "",
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          country: form.country,
          postalCode: form.postalCode,
          phone: form.phone,
        },
      })
      clearCart()
      toast.success("Order placed successfully!")
      router.push("/orders")
    } catch {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <h2 className="font-serif text-2xl mb-2">Your bag is empty</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Add some items to your bag before checking out.
              </p>
              <Link
                href="/shop"
                className="border border-foreground px-10 py-3 text-xs tracking-[0.25em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Checkout
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Complete Your Order</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Shipping form */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <h2 className="text-xs tracking-wider uppercase text-muted-foreground">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="customerName" className="text-xs tracking-wider uppercase text-muted-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="street" className="text-xs tracking-wider uppercase text-muted-foreground">
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs tracking-wider uppercase text-muted-foreground">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs tracking-wider uppercase text-muted-foreground">
                      State / Province
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-xs tracking-wider uppercase text-muted-foreground">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-xs tracking-wider uppercase text-muted-foreground">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone" className="text-xs tracking-wider uppercase text-muted-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="mt-2 bg-transparent border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Order summary sidebar */}
              <div>
                <div className="bg-card p-6 border border-border">
                  <h2 className="text-xs tracking-wider uppercase mb-6">Order Summary</h2>

                  <div className="flex flex-col gap-4 mb-6">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                        <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-muted">
                          <Image
                            src={item.image || "/images/hero.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.size} / {item.color} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-xs">
                          {formatPrice(
                            (currency === "NPR" ? item.priceNPR : item.priceUSD) * item.quantity,
                            currency
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-base font-medium">
                      <span>Total</span>
                      <span className="font-serif text-lg">{formatPrice(total, currency)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
