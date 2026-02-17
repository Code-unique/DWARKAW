import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductGallery } from "@/components/shop/product-gallery"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/product-actions"
import { formatPrice } from "@/lib/currency"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.slug)

  const fabricInfo: Record<string, string> = {
    cotton: "Organic cotton is gentle on skin and earth. It breathes naturally, absorbs moisture, and softens with every wash.",
    hemp: "Hemp is one of the most sustainable fibers on earth. It requires no pesticides, minimal water, and produces exceptionally strong, durable fabric.",
    linen: "Linen is made from flax, a plant that thrives with minimal resources. It is naturally moth-resistant, antibacterial, and becomes softer with age.",
    "cotton-hemp": "Our cotton-hemp blend combines the softness of organic cotton with the durability of hemp, creating a fabric that is both comfortable and long-lasting.",
    "cotton-linen": "This cotton-linen blend brings together the breathability of cotton and the refined texture of linen for a fabric that drapes beautifully.",
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span>{"/"}</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Gallery */}
            <ProductGallery images={product.images} name={product.name} />

            {/* Product info */}
            <div className="flex flex-col gap-6 lg:pt-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {product.fabric.replace("-", " & ")}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <AddToCartButton product={product} />

              {/* Accordion details */}
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="description">
                  <AccordionTrigger className="text-xs tracking-wider uppercase">
                    Full Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.longDescription}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fabric">
                  <AccordionTrigger className="text-xs tracking-wider uppercase">
                    Fabric & Sustainability
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fabricInfo[product.fabric] || "Crafted from natural fibers, this piece embodies our commitment to sustainable fashion."}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                  <AccordionTrigger className="text-xs tracking-wider uppercase">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <li>Hand wash cold or machine wash on gentle cycle</li>
                      <li>Use mild, eco-friendly detergent</li>
                      <li>Hang dry in shade to preserve fiber integrity</li>
                      <li>Iron on low heat while slightly damp</li>
                      <li>Natural fabrics soften beautifully with each wash</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <h2 className="font-serif text-2xl mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {relatedProducts.map((related: Record<string, string | number | string[]>) => (
                  <Link
                    key={related._id as string}
                    href={`/shop/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
                      <Image
                        src={(related.images as string[])?.[0] || "/images/hero.jpg"}
                        alt={related.name as string}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-sm font-medium mb-1">{related.name as string}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(related.priceNPR as number, "NPR")}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
