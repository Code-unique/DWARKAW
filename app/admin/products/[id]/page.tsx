import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductForm } from "@/components/admin/product-form"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details.",
}

async function getProduct(id: string) {
  try {
    await connectToDatabase()
    const product = await Product.findById(id).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // Await the params Promise to get the actual parameters
  const { id } = await params
  
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Admin
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Edit Product</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Editing: {product.name}
            </p>
          </div>

          <div className="border border-border p-8 bg-card">
            <ProductForm initialData={product} isEditing />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}