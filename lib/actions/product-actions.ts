"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"
import { revalidateTag } from "next/cache"

export async function getProducts(filters?: {
  category?: string
  fabric?: string
  sort?: string
  search?: string
}) {
  await connectToDatabase()

  const query: Record<string, unknown> = {}

  if (filters?.category && filters.category !== "all") {
    query.category = filters.category
  }
  if (filters?.fabric && filters.fabric !== "all") {
    query.fabric = filters.fabric
  }
  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
  if (filters?.sort === "price-asc") sortOption = { priceNPR: 1 }
  if (filters?.sort === "price-desc") sortOption = { priceNPR: -1 }
  if (filters?.sort === "newest") sortOption = { createdAt: -1 }

  const products = await Product.find(query).sort(sortOption).lean()
  return JSON.parse(JSON.stringify(products))
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug }).lean()
  return product ? JSON.parse(JSON.stringify(product)) : null
}

export async function getFeaturedProducts() {
  await connectToDatabase()
  const products = await Product.find({ featured: true, inStock: true })
    .limit(4)
    .lean()
  return JSON.parse(JSON.stringify(products))
}

export async function getRelatedProducts(category: string, excludeSlug: string) {
  await connectToDatabase()
  const products = await Product.find({
    category,
    slug: { $ne: excludeSlug },
    inStock: true,
  })
    .limit(4)
    .lean()
  return JSON.parse(JSON.stringify(products))
}

export async function createProduct(data: Record<string, unknown>) {
  await connectToDatabase()
  const product = await Product.create(data)
  revalidateTag("products", "max")
  return JSON.parse(JSON.stringify(product))
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  await connectToDatabase()
  const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean()
  revalidateTag("products", "max")
  return JSON.parse(JSON.stringify(product))
}

export async function deleteProduct(id: string) {
  await connectToDatabase()
  await Product.findByIdAndDelete(id)
  revalidateTag("products", "max")
  return { success: true }
}
