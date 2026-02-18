"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/lib/models/order"
import { auth } from "@clerk/nextjs/server"
import { orderSchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"

export async function createOrder(data: {
  items: {
    productId: string
    name: string
    slug: string
    image: string
    size: string
    color: string
    quantity: number
    priceNPR: number
    priceUSD: number
  }[]
  totalNPR: number
  totalUSD: number
  customerName: string
  customerEmail: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
  }
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error("Unauthorized - No user ID found")
    }

    // Validate order data
    const validated = orderSchema.parse(data)

    await connectToDatabase()
    
    const orderData = {
      ...validated,
      userId,
      // status is not specified - will use default "pending" from schema
    }
    
    const order = await Order.create(orderData)

    revalidatePath("/orders")
    revalidatePath("/admin/orders")
    
    return { success: true, data: JSON.parse(JSON.stringify(order)) }
  } catch (error) {
    console.error("Order creation error:", error)
    throw new Error("Failed to create order")
  }
}

export async function getOrdersByUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return []
    }

    await connectToDatabase()
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean()

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    console.error("Fetch user orders error:", error)
    return []
  }
}

export async function getAllOrders() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Check if user is admin
    const isAdmin = await checkIfUserIsAdmin(userId)
    if (!isAdmin) {
      throw new Error("Forbidden")
    }

    await connectToDatabase()
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    console.error("Fetch all orders error:", error)
    throw new Error("Failed to fetch orders")
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Check if user is admin
    const isAdmin = await checkIfUserIsAdmin(userId)
    if (!isAdmin) throw new Error("Forbidden")

    // Validate status
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status")
    }

    await connectToDatabase()
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean()

    if (!order) {
      throw new Error("Order not found")
    }

    revalidatePath("/admin/orders")
    return JSON.parse(JSON.stringify(order))
  } catch (error) {
    console.error("Update order status error:", error)
    throw new Error("Failed to update order")
  }
}

// Helper function for admin check
async function checkIfUserIsAdmin(userId: string) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
  
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })
    
    if (!response.ok) return false
    
    const user = await response.json()
    const email = user.email_addresses[0]?.email_address
    
    return adminEmails.includes(email)
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}