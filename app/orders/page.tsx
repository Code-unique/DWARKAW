import type { Metadata } from "next"
import Link from "next/link"
import { Package } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getOrdersByUser } from "@/lib/actions/order-actions"
import { formatPrice } from "@/lib/currency"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your DWARKA order history.",
}

function statusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "delivered":
      return "bg-primary/10 text-primary border-primary/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default async function OrdersPage() {
  const orders = await getOrdersByUser()

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Account
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">My Orders</h1>
          </div>

          {(!orders || orders.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-6" />
              <h2 className="font-serif text-2xl mb-2">No orders yet</h2>
              <p className="text-muted-foreground text-sm mb-8">
                When you place an order, it will appear here.
              </p>
              <Link
                href="/shop"
                className="border border-foreground px-10 py-3 text-xs tracking-[0.25em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order: Record<string, unknown>) => {
                const items = order.items as Array<{
                  name: string
                  size: string
                  quantity: number
                }>
                return (
                  <div
                    key={order._id as string}
                    className="border border-border p-6 bg-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Order #{(order._id as string).slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt as string).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={`text-[10px] tracking-wider uppercase ${statusColor(order.status as string)}`}
                        >
                          {order.status as string}
                        </Badge>
                        <span className="font-serif text-lg">
                          {formatPrice(order.totalNPR as number, "NPR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {items.map((item, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {item.name} ({item.size}) x {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
