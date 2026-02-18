import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string().optional(),
  size: z.string(),
  color: z.string(),
  quantity: z.number().min(1),
  priceNPR: z.number().positive(),
  priceUSD: z.number().positive(),
})

export const shippingAddressSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().optional(),
  phone: z.string().min(8, "Valid phone number is required"),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  totalNPR: z.number().positive(),
  totalUSD: z.number().positive(),
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  shippingAddress: shippingAddressSchema,
})

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  longDescription: z.string().optional(),
  priceNPR: z.number().positive(),
  priceUSD: z.number().positive(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  category: z.enum(["tops", "bottoms", "dresses", "accessories", "outerwear"]),
  fabric: z.enum(["cotton", "hemp", "linen", "cotton-hemp", "cotton-linen"]),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  })),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
})