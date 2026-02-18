import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/lib/models/order"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const order = await Order.findById(id).lean()
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check if user owns the order or is admin
    const isAdmin = await checkIfUserIsAdmin(userId)
    // Fix: Check if order is an array or single object
    const orderData = Array.isArray(order) ? order[0] : order
    if (orderData?.userId !== userId && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)))
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const isAdmin = await checkIfUserIsAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    await connectToDatabase()
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).lean()

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(JSON.parse(JSON.stringify(order)))
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

// Helper function
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
    console.error("Error checking admin status:", error)
    return false
  }
}