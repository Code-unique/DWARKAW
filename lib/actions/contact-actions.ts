"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Contact } from "@/lib/models/contact"

export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  await connectToDatabase()
  const contact = await Contact.create(data)
  return JSON.parse(JSON.stringify(contact))
}
