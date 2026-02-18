"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingBag, Mail, TrendingUp } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { AdminProductList } from "./admin-product-list"
import { AdminOrderList } from "./admin-order-list"
import { AdminContactList } from "./admin-contact-list"
import { formatPrice } from "@/lib/currency"

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalMessages: number
}

async function clientGetProducts() {
  const response = await fetch('/api/products?limit=1')
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  // Handle both paginated and non-paginated responses
  return data.products ? data.products.length : (Array.isArray(data) ? data.length : 0)
}

async function clientGetAllOrders() {
  const response = await fetch('/api/orders?admin=true')
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

async function clientGetContactSubmissions() {
  const response = await fetch('/api/admin/contacts')
  if (!response.ok) throw new Error('Failed to fetch contacts')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export function AdminDashboardClient() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "contacts">("products")
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stats
  useEffect(() => {
    async function fetchStats() {
      try {
        setError(null)
        
        // Fetch products count
        const productCount = await clientGetProducts()
        
        // Fetch orders
        const orders = await clientGetAllOrders()
        
        // Fetch contacts
        const contacts = await clientGetContactSubmissions()

        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (order.totalNPR || 0),
          0
        )

        setStats({
          totalProducts: productCount,
          totalOrders: orders.length,
          totalRevenue,
          totalMessages: contacts.length,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded) {
      fetchStats()
    }
  }, [isLoaded])

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="border border-foreground px-6 py-2 text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stats - same as before */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">
              Products
            </p>
          </div>
          <p className="font-serif text-3xl">{stats.totalProducts}</p>
        </div>

        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">
              Orders
            </p>
          </div>
          <p className="font-serif text-3xl">{stats.totalOrders}</p>
        </div>

        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">
              Revenue (NPR)
            </p>
          </div>
          <p className="font-serif text-3xl">{formatPrice(stats.totalRevenue, "NPR")}</p>
        </div>

        <div className="border border-border p-6 bg-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground">
              Messages
            </p>
          </div>
          <p className="font-serif text-3xl">{stats.totalMessages}</p>
        </div>
      </div>

      {/* Tabs and content - same as before */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 text-xs tracking-wider uppercase transition-colors relative ${
              activeTab === "products"
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-xs tracking-wider uppercase transition-colors relative ${
              activeTab === "orders"
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`pb-4 text-xs tracking-wider uppercase transition-colors relative ${
              activeTab === "contacts"
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Contacts
          </button>
        </div>
      </div>

      <div>
        {activeTab === "products" && <AdminProductList />}
        {activeTab === "orders" && <AdminOrderList />}
        {activeTab === "contacts" && <AdminContactList />}
      </div>
    </div>
  )
}