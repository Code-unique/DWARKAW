"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Contact } from "@/lib/models/contact"
import { contactFormSchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin"

export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    // Validate input
    const validated = contactFormSchema.parse(data)
    
    await connectToDatabase()
    const contact = await Contact.create(validated)
    
    revalidatePath("/admin/contacts")
    return { success: true, data: JSON.parse(JSON.stringify(contact)) }
  } catch (error) {
    console.error("Contact form submission error:", error)
    throw new Error("Failed to submit contact form")
  }
}

export async function getContactSubmissions() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) throw new Error("Forbidden")

    await connectToDatabase()
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(contacts))
  } catch (error) {
    console.error("Fetch contacts error:", error)
    throw new Error("Failed to fetch contact submissions")
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) throw new Error("Forbidden")

    await connectToDatabase()
    await Contact.findByIdAndDelete(id)
    
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("Delete contact error:", error)
    throw new Error("Failed to delete contact submission")
  }
}