import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  longDescription: string
  priceNPR: number
  priceUSD: number
  images: string[]
  category: "tops" | "bottoms" | "dresses" | "accessories" | "outerwear"
  fabric: "cotton" | "hemp" | "linen" | "cotton-hemp" | "cotton-linen"
  sizes: string[]
  colors: { name: string; hex: string }[]
  inStock: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    priceNPR: { type: Number, required: true },
    priceUSD: { type: Number, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ["tops", "bottoms", "dresses", "accessories", "outerwear"],
      required: true,
    },
    fabric: {
      type: String,
      enum: ["cotton", "hemp", "linen", "cotton-hemp", "cotton-linen"],
      required: true,
    },
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
