"use client"

import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/currency"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "delivered":
      return "bg-primary/10 text-primary border-primary/20"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

async function fetchOrders() {
  const response = await fetch('/api/orders?admin=true')
  if (!response.ok) throw new Error('Failed to fetch orders')
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

async function updateOrderStatus(orderId: string, status: string) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Failed to update order')
  return response.json()
}

export function AdminOrderList() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setError(null)
      const data = await fetchOrders()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setError("Failed to load orders")
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(orderId: string, newStatus: string) {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success("Order status updated")
    } catch (error) {
      console.error("Failed to update order:", error)
      toast.error("Failed to update order status")
    } finally {
      setUpdatingId(null)
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
          onClick={loadOrders}
          className="border border-foreground px-6 py-2 text-xs tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border border-border">
        <p className="text-muted-foreground">No orders found.</p>
      </div>
    )
  }

  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-muted">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Order ID</th>
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Total</th>
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs tracking-wider uppercase">Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
              <td className="px-4 py-4">
                <span className="text-xs font-mono">
                  #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
                </span>
              </td>
              <td className="px-4 py-4">
                <div>
                  <p className="text-sm font-medium">{order.customerName || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail || 'N/A'}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-4 text-sm font-serif">
                {order.totalNPR ? formatPrice(order.totalNPR, "NPR") : 'N/A'}
              </td>
              <td className="px-4 py-4">
                <select
                  value={order.status || 'pending'}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  disabled={updatingId === order._id}
                  className={`text-xs px-2 py-1 rounded-full border ${statusColor(order.status || 'pending')} focus:outline-none focus:ring-1 focus:ring-foreground`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-4 py-4">
                <div className="text-xs text-muted-foreground">
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}