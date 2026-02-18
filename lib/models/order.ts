import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  productId: string
  name: string
  slug: string
  image: string
  size: string
  color: string
  quantity: number
  priceNPR: number
  priceUSD: number
}

export interface IOrder extends Document {
  userId: string
  items: IOrderItem[]
  totalNPR: number
  totalUSD: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  customerName: string
  customerEmail: string
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
    phone: string
  }
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String },
        size: { type: String },
        color: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        priceNPR: { type: Number, required: true },
        priceUSD: { type: Number, required: true },
      },
    ],
    totalNPR: { type: Number, required: true },
    totalUSD: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending", // Changed from "pending" to "pending"
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      postalCode: { type: String },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
)

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)