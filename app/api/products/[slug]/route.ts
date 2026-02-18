import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await the params Promise
    const { slug } = await params
    
    await connectToDatabase()
    
    const product = await Product.findOne({ slug }).lean()
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(JSON.parse(JSON.stringify(product)))
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}