"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Package, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "@/lib/actions/product-actions"
import { getAllOrders } from "@/lib/actions/order-actions"
import { formatPrice } from "@/lib/currency"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  longDescription: string
  priceNPR: number
  priceUSD: number
  images: string[]
  category: string
  fabric: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  inStock: boolean
  featured: boolean
}

interface Order {
  _id: string
  customerName: string
  customerEmail: string
  totalNPR: number
  status: string
  items: { name: string; quantity: number }[]
  createdAt: string
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  priceNPR: "",
  priceUSD: "",
  images: "",
  category: "tops",
  fabric: "cotton",
  sizes: "S, M, L, XL",
  colorName: "Natural",
  colorHex: "#C4B5A0",
  featured: false,
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [prods, ords] = await Promise.all([getProducts(), getAllOrders()])
      setProducts(prods)
      setOrders(ords)
    } catch {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSeedDatabase = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      toast.success(data.message || "Database seeded!")
      loadData()
    } catch {
      toast.error("Failed to seed database")
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-")
      await createProduct({
        name: form.name,
        slug,
        description: form.description,
        longDescription: form.longDescription,
        priceNPR: Number(form.priceNPR),
        priceUSD: Number(form.priceUSD),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        category: form.category,
        fabric: form.fabric,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: [{ name: form.colorName, hex: form.colorHex }],
        inStock: true,
        featured: form.featured,
      })
      toast.success("Product created!")
      setForm(emptyForm)
      setDialogOpen(false)
      loadData()
    } catch {
      toast.error("Failed to create product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteProduct(id)
      toast.success("Product deleted")
      loadData()
    } catch {
      toast.error("Failed to delete product")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="products">
      <TabsList className="mb-8">
        <TabsTrigger value="products" className="gap-2">
          <ShoppingBag className="h-4 w-4" />
          Products ({products.length})
        </TabsTrigger>
        <TabsTrigger value="orders" className="gap-2">
          <Package className="h-4 w-4" />
          Orders ({orders.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">
                  New Product
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProduct} className="flex flex-col gap-4 mt-4">
                <div>
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="mt-1 bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wider uppercase text-muted-foreground">Price (NPR)</Label>
                    <Input
                      type="number"
                      value={form.priceNPR}
                      onChange={(e) => setForm({ ...form, priceNPR: e.target.value })}
                      required
                      className="mt-1 bg-transparent"
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wider uppercase text-muted-foreground">Price (USD)</Label>
                    <Input
                      type="number"
                      value={form.priceUSD}
                      onChange={(e) => setForm({ ...form, priceUSD: e.target.value })}
                      required
                      className="mt-1 bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground">Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    rows={2}
                    className="mt-1 bg-transparent resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wider uppercase text-muted-foreground">Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="mt-1 bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["tops", "bottoms", "dresses", "accessories", "outerwear"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs tracking-wider uppercase text-muted-foreground">Fabric</Label>
                    <Select value={form.fabric} onValueChange={(v) => setForm({ ...form, fabric: v })}>
                      <SelectTrigger className="mt-1 bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["cotton", "hemp", "linen", "cotton-hemp", "cotton-linen"].map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground">Sizes (comma separated)</Label>
                  <Input
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    className="mt-1 bg-transparent"
                  />
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground">Image URLs (comma separated)</Label>
                  <Input
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    className="mt-1 bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    id="featured"
                  />
                  <Label htmlFor="featured" className="text-xs">Featured product</Label>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {submitting ? "Creating..." : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleSeedDatabase}
            className="text-xs tracking-wider uppercase"
          >
            Seed Database
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No products yet. Add one or seed the database.</p>
          </div>
        ) : (
          <div className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-[10px] tracking-wider uppercase text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left text-[10px] tracking-wider uppercase text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-[10px] tracking-wider uppercase text-muted-foreground">Fabric</th>
                    <th className="px-4 py-3 text-left text-[10px] tracking-wider uppercase text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-[10px] tracking-wider uppercase text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-[10px] tracking-wider uppercase text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{product.category}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{product.fabric.replace("-", " & ")}</td>
                      <td className="px-4 py-3 text-sm">{formatPrice(product.priceNPR, "NPR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {product.featured && (
                            <Badge variant="outline" className="text-[10px]">Featured</Badge>
                          )}
                          <Badge variant={product.inStock ? "outline" : "destructive"} className="text-[10px]">
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit product">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteProduct(product._id)}
                            aria-label="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="orders">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-border p-6 bg-card">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] tracking-wider uppercase">
                      {order.status}
                    </Badge>
                    <span className="font-serif">{formatPrice(order.totalNPR, "NPR")}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" -- "}
                  {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
