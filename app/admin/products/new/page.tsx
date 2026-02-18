import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductForm } from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Create Product",
  description: "Add a new product to DWARKA collection.",
}

export default function NewProductPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Admin
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Create New Product</h1>
          </div>

          <div className="border border-border p-8 bg-card">
            <ProductForm />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}