import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const fabric = searchParams.get("fabric")
    const sort = searchParams.get("sort")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")
    const page = parseInt(searchParams.get("page") || "1")
    const limitNum = parseInt(limit || "20")
    const skip = (page - 1) * limitNum

    const query: Record<string, unknown> = {}

    if (category && category !== "all") {
      query.category = category
    }
    if (fabric && fabric !== "all") {
      query.fabric = fabric
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
    if (sort === "price-asc") sortOption = { priceNPR: 1 }
    if (sort === "price-desc") sortOption = { priceNPR: -1 }
    if (sort === "newest") sortOption = { createdAt: -1 }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query)
    ])

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        total,
        page,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}