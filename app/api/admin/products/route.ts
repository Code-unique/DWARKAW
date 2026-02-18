import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"
import { auth } from "@clerk/nextjs/server"

// Helper function to check if user is admin
async function isAdmin(userId: string) {
  // You can implement this based on your admin logic
  // For example, check against a list of admin emails or a role in your database
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
  
  // Get user from Clerk
  const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).then(res => res.json())
  
  return adminEmails.includes(user.email_addresses[0]?.email_address)
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    await connectToDatabase()
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: body.slug })
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      )
    }

    const product = await Product.create(body)

    return NextResponse.json(
      JSON.parse(JSON.stringify(product)),
      { status: 201 }
    )
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    await connectToDatabase()

    const product = await Product.findByIdAndUpdate(id, body, { new: true }).lean()
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(JSON.parse(JSON.stringify(product)))
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()
    
    const product = await Product.findByIdAndDelete(id)
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}