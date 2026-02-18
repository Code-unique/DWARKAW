import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    await connectToDatabase()
    
    const currentProduct = await Product.findOne({ slug })
    
    if (!currentProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    const products = await Product.find({
      category: currentProduct.category,
      slug: { $ne: slug },
      inStock: true,
    })
      .limit(4)
      .lean()

    return NextResponse.json(JSON.parse(JSON.stringify(products)))
  } catch (error) {
    console.error("Related products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    )
  }
}