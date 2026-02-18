import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/lib/models/order"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    console.log("Creating order for userId:", userId)
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    await connectToDatabase()
    
    // Create order with status "pending" (default from schema)
    const order = await Order.create({
      ...body,
      userId,
      // status is not specified, so it will use the default "pending"
    })

    console.log("Order created with ID:", order._id, "for user:", userId, "status:", order.status)

    return NextResponse.json(
      JSON.parse(JSON.stringify(order)),
      { status: 201 }
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    await connectToDatabase()
    
    let orders
    if (isAdmin) {
      // Check if user is admin
      const isUserAdmin = await checkIfUserIsAdmin(userId)
      if (!isUserAdmin) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        )
      }
      orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    } else {
      orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean()
    }

    return NextResponse.json(JSON.parse(JSON.stringify(orders)))
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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
    console.error("Admin check error:", error)
    return false
  }
}