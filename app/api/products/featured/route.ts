import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export async function GET(
  request: Request,
  { params }: { params: Promise<{}> }
) {
  try {
    // Await params even if it's empty (required for Next.js 15)
    await params
    
    await connectToDatabase()
    
    const products = await Product.find({ featured: true, inStock: true })
      .limit(8)
      .lean()

    return NextResponse.json(JSON.parse(JSON.stringify(products)))
  } catch (error) {
    console.error("Featured products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    )
  }
}