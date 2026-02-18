"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"
import { revalidateTag, revalidatePath } from "next/cache"
import { productSchema } from "@/lib/validators"
import { auth } from "@clerk/nextjs/server"

export async function getProducts(filters?: {
  category?: string
  fabric?: string
  sort?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    await connectToDatabase()

    const query: Record<string, unknown> = {}
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const skip = (page - 1) * limit

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

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean()

    // Return the products array directly
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error("Products fetch error:", error)
    throw new Error("Failed to fetch products")
  }
}

// Keep this for pagination if needed elsewhere
export async function getProductsWithPagination(filters?: {
  category?: string
  fabric?: string
  sort?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    await connectToDatabase()

    const query: Record<string, unknown> = {}
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const skip = (page - 1) * limit

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

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ])

    return {
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error("Products fetch error:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function getProductBySlug(slug: string) {
  try {
    await connectToDatabase()
    const product = await Product.findOne({ slug }).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch (error) {
    console.error("Product fetch error:", error)
    throw new Error("Failed to fetch product")
  }
}

export async function getFeaturedProducts() {
  try {
    await connectToDatabase()
    const products = await Product.find({ featured: true, inStock: true })
      .limit(8)
      .lean()
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error("Featured products fetch error:", error)
    throw new Error("Failed to fetch featured products")
  }
}

export async function getRelatedProducts(category: string, excludeSlug: string) {
  try {
    await connectToDatabase()
    const products = await Product.find({
      category,
      slug: { $ne: excludeSlug },
      inStock: true,
    })
      .limit(4)
      .lean()
    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error("Related products fetch error:", error)
    throw new Error("Failed to fetch related products")
  }
}

// Admin actions
export async function createProduct(data: Record<string, unknown>) {
  try {
    const { userId } = await auth()
    if (!userId || !(await checkIfUserIsAdmin(userId))) {
      throw new Error("Unauthorized")
    }

    // Validate product data
    const validated = productSchema.parse(data)
    
    // Generate slug if not provided
    if (!validated.slug && validated.name) {
      validated.slug = validated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    await connectToDatabase()
    
    // Check if slug exists
    const existing = await Product.findOne({ slug: validated.slug })
    if (existing) {
      throw new Error("Product with this slug already exists")
    }

    const product = await Product.create(validated)
    
    // Fix: Add second argument for revalidateTag in Next.js 15
    revalidateTag("products", "layout")
    revalidatePath("/admin/products")
    
    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error) {
    console.error("Product creation error:", error)
    throw new Error("Failed to create product")
  }
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  try {
    const { userId } = await auth()
    if (!userId || !(await checkIfUserIsAdmin(userId))) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()
    const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean()
    
    if (!product) {
      throw new Error("Product not found")
    }

    // Fix: Add second argument for revalidateTag in Next.js 15
    revalidateTag("products", "layout")
    revalidatePath("/admin/products")
    
    return JSON.parse(JSON.stringify(product))
  } catch (error) {
    console.error("Product update error:", error)
    throw new Error("Failed to update product")
  }
}

export async function deleteProduct(id: string) {
  try {
    const { userId } = await auth()
    if (!userId || !(await checkIfUserIsAdmin(userId))) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()
    await Product.findByIdAndDelete(id)
    
    // Fix: Add second argument for revalidateTag in Next.js 15
    revalidateTag("products", "layout")
    revalidatePath("/admin/products")
    
    return { success: true }
  } catch (error) {
    console.error("Product deletion error:", error)
    throw new Error("Failed to delete product")
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
    console.error("Error checking admin status:", error)
    return false
  }
}