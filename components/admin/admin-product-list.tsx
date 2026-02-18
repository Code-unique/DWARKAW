"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Plus } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

async function fetchProducts() {
  const response = await fetch('/api/products?limit=50')
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  // Handle both paginated and non-paginated responses
  return data.products || (Array.isArray(data) ? data : [])
}

async function deleteProduct(id: string) {
  const response = await fetch(`/api/admin/products?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete product')
  return response.json()
}

export function AdminProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setError(null)
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setError("Failed to load products")
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p._id !== id))
      toast.success("Product deleted successfully")
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadProducts}
          className="border border-foreground px-6 py-2 text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground">No products found. Click "Add Product" to create one.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Fabric</th>
              <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Price (NPR)</th>
              <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Stock</th>
              <th className="px-4 py-3 text-right text-xs tracking-wider uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 overflow-hidden bg-muted shrink-0">
                      <Image
                        src={product.images?.[0] || "/images/hero.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium line-clamp-2">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm capitalize">{product.category || '-'}</td>
                <td className="px-4 py-4 text-sm capitalize">
                  {product.fabric ? product.fabric.replace("-", " & ") : '-'}
                </td>
                <td className="px-4 py-4 text-sm font-serif">
                  {product.priceNPR ? formatPrice(product.priceNPR, "NPR") : '-'}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                    product.inStock 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Edit product"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}