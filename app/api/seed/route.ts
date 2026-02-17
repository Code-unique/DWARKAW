import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Product } from "@/lib/models/product"

const products = [
  {
    name: "Himalayan Hemp Kurta",
    slug: "himalayan-hemp-kurta",
    description: "A breathable hemp kurta inspired by the Himalayan landscape, crafted for effortless elegance.",
    longDescription: "Hand-woven from 100% Nepali hemp, this kurta embodies the spirit of the Himalayas. The natural fibers provide unmatched breathability while the relaxed silhouette offers timeless sophistication. Each piece is dyed using plant-based dyes, ensuring minimal environmental impact. The subtle texture of hemp gives this garment a unique character that only improves with wear.",
    priceNPR: 8500,
    priceUSD: 64,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    category: "tops",
    fabric: "hemp",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Natural", hex: "#C4B5A0" },
      { name: "Earth Brown", hex: "#8B7355" },
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Handloom Cotton Saree",
    slug: "handloom-cotton-saree",
    description: "A luxurious handloom cotton saree woven by artisans in the Kathmandu Valley.",
    longDescription: "This exquisite saree is handwoven by master artisans in the Kathmandu Valley using traditional techniques passed down through generations. The organic cotton threads are spun by hand and dyed with natural indigo extracts. The delicate border pattern draws inspiration from ancient Newari motifs, creating a piece that is both a garment and a work of art.",
    priceNPR: 12000,
    priceUSD: 90,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    ],
    category: "dresses",
    fabric: "cotton",
    sizes: ["Free Size"],
    colors: [
      { name: "Indigo", hex: "#3F4B6B" },
      { name: "Ivory", hex: "#F5F0E8" },
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Linen Wide-Leg Trousers",
    slug: "linen-wide-leg-trousers",
    description: "Fluid linen trousers that merge comfort with contemporary design.",
    longDescription: "These wide-leg trousers are cut from premium European linen, pre-washed for a lived-in softness from the first wear. The relaxed, flowing silhouette is balanced by a tailored high waist, creating a flattering line. Designed to transition effortlessly from day to evening, these trousers are a cornerstone of the DWARKA wardrobe.",
    priceNPR: 6500,
    priceUSD: 49,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
      "https://images.unsplash.com/photo-1551854838-212c9b2c2e92?w=800&q=80",
    ],
    category: "bottoms",
    fabric: "linen",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal", hex: "#D4C5A9" },
      { name: "Slate", hex: "#6B7280" },
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Cotton-Hemp Wrap Dress",
    slug: "cotton-hemp-wrap-dress",
    description: "An organic cotton-hemp blend wrap dress, designed for graceful movement.",
    longDescription: "This wrap dress combines the softness of organic cotton with the structural integrity of hemp, creating a fabric that drapes beautifully while holding its shape. The adjustable wrap tie allows for a personalized fit, and the midi length makes it suitable for any occasion. Natural plant dyes give this dress its warm, earthy tone.",
    priceNPR: 9800,
    priceUSD: 74,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    ],
    category: "dresses",
    fabric: "cotton-hemp",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Terracotta", hex: "#A0705A" },
      { name: "Sage", hex: "#9CAF88" },
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Hemp Tote Bag",
    slug: "hemp-tote-bag",
    description: "A sturdy yet elegant hemp tote, perfect for everyday carry.",
    longDescription: "Handcrafted from durable Nepali hemp fiber, this tote bag is designed to last a lifetime. The minimalist design features an interior pocket and magnetic closure. The natural hemp develops a beautiful patina over time, making each bag uniquely yours. Strong enough for daily use, beautiful enough for special occasions.",
    priceNPR: 3500,
    priceUSD: 26,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    ],
    category: "accessories",
    fabric: "hemp",
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#C4B5A0" },
      { name: "Charcoal", hex: "#3D3D3D" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Organic Cotton Blouse",
    slug: "organic-cotton-blouse",
    description: "A delicate organic cotton blouse with hand-embroidered details.",
    longDescription: "This blouse is crafted from the finest organic cotton, sourced from farms in the Terai region of Nepal. The subtle hand-embroidery along the neckline and cuffs is done by women artisans from the Janakpur region, preserving a centuries-old tradition. The relaxed fit and breathable fabric make it ideal for layering or wearing on its own.",
    priceNPR: 5500,
    priceUSD: 41,
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80",
    ],
    category: "tops",
    fabric: "cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FAF8F5" },
      { name: "Blush", hex: "#D4A89A" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Linen Oversized Blazer",
    slug: "linen-oversized-blazer",
    description: "A structured yet relaxed linen blazer for the modern wardrobe.",
    longDescription: "This oversized blazer is tailored from premium washed linen, giving it a relaxed drape that still maintains a polished silhouette. The single-button closure and patch pockets add a casual elegance. Perfect over a DWARKA cotton blouse or worn as a light jacket in the transitional seasons.",
    priceNPR: 11000,
    priceUSD: 83,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    category: "outerwear",
    fabric: "linen",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sand", hex: "#C2B280" },
      { name: "Olive", hex: "#6B705C" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Cotton-Linen Midi Skirt",
    slug: "cotton-linen-midi-skirt",
    description: "A flowing midi skirt in a cotton-linen blend, effortlessly feminine.",
    longDescription: "This midi skirt combines cotton and linen for a fabric that is both soft and structured. The A-line silhouette flows gracefully with movement, while the elasticated waist ensures all-day comfort. The natural slub texture of the fabric adds visual interest without being overpowering.",
    priceNPR: 5800,
    priceUSD: 44,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    category: "bottoms",
    fabric: "cotton-linen",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Cream", hex: "#F3EDE7" },
      { name: "Dusty Rose", hex: "#C4A08A" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Hemp Meditation Shawl",
    slug: "hemp-meditation-shawl",
    description: "A luxuriously soft hemp shawl for warmth and mindful moments.",
    longDescription: "Woven from the finest Nepali hemp fibers, this meditation shawl wraps you in natural warmth. The generous dimensions allow for multiple draping styles. Traditionally used in Himalayan meditation practices, this shawl has been reimagined for the modern seeker of comfort and sustainability.",
    priceNPR: 4200,
    priceUSD: 32,
    images: [
      "https://images.unsplash.com/photo-1601244005535-a48d21d951ac?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
    ],
    category: "accessories",
    fabric: "hemp",
    sizes: ["One Size"],
    colors: [
      { name: "Mountain Grey", hex: "#9B9B8E" },
      { name: "Natural", hex: "#C4B5A0" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Organic Cotton Dhoti Pants",
    slug: "organic-cotton-dhoti-pants",
    description: "Contemporary dhoti pants crafted from organic cotton for fluid comfort.",
    longDescription: "These dhoti pants reimagine a traditional South Asian silhouette for the contemporary wardrobe. Cut from organic cotton with a natural drape, the pleated front and tapered ankle create an elegant yet comfortable fit. The drawstring waist allows for adjustable sizing.",
    priceNPR: 4800,
    priceUSD: 36,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
      "https://images.unsplash.com/photo-1551854838-212c9b2c2e92?w=800&q=80",
    ],
    category: "bottoms",
    fabric: "cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Off White", hex: "#F0EBE3" },
      { name: "Clay", hex: "#A67B5B" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Linen Shirt Dress",
    slug: "linen-shirt-dress",
    description: "A minimalist linen shirt dress that transitions from day to evening.",
    longDescription: "This shirt dress is the epitome of effortless style. Crafted from pre-washed pure linen, it features a relaxed fit with a belted waist for definition. The button-front design and rolled sleeves add casual sophistication. A DWARKA essential that pairs beautifully with sandals or boots alike.",
    priceNPR: 8200,
    priceUSD: 62,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    ],
    category: "dresses",
    fabric: "linen",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Flax", hex: "#D4C5A9" },
      { name: "Forest", hex: "#4A5240" },
    ],
    inStock: true,
    featured: false,
  },
  {
    name: "Hemp Canvas Crossbody",
    slug: "hemp-canvas-crossbody",
    description: "A compact hemp canvas crossbody bag with leather-free details.",
    longDescription: "This crossbody bag is crafted from heavy-duty hemp canvas with coconut shell button closures and organic cotton lining. The adjustable strap allows for crossbody or shoulder carry. Compact yet spacious, it features two interior compartments and a secure zip pocket. 100% vegan and built to last.",
    priceNPR: 2800,
    priceUSD: 21,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    ],
    category: "accessories",
    fabric: "hemp",
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#C4B5A0" },
      { name: "Black", hex: "#2D2D2D" },
    ],
    inStock: true,
    featured: false,
  },
]

export async function POST() {
  try {
    await connectToDatabase()
    await Product.deleteMany({})
    await Product.insertMany(products)
    return NextResponse.json({ message: "Database seeded successfully", count: products.length })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
