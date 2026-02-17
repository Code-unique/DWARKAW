"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Order } from "@/lib/models/order"
import { auth } from "@clerk/nextjs/server"

export async function createOrder(data: {
  items: {
    productId: string
    name: string
    slug: string
    image: string
    size: string
    color: string
    quantity: number
    priceNPR: number
    priceUSD: number
  }[]
  totalNPR: number
  totalUSD: number
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
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await connectToDatabase()
  const order = await Order.create({
    ...data,
    userId,
    status: "confirmed",
  })

  return JSON.parse(JSON.stringify(order))
}

export async function getOrdersByUser() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await connectToDatabase()
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(orders))
}

export async function getAllOrders() {
  await connectToDatabase()
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(orders))
}
