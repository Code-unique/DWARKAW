import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Contact } from "@/lib/models/contact"
import { auth } from "@clerk/nextjs/server"

async function isAdmin(userId: string) {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || []
    
    if (adminUserIds.includes(userId)) return true
    
    if (process.env.CLERK_SECRET_KEY) {
      const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      })
      
      if (response.ok) {
        const user = await response.json()
        const email = user.email_addresses[0]?.email_address
        return adminEmails.includes(email)
      }
    }
    
    return false
  } catch (error) {
    console.error("Admin check error:", error)
    return false
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(JSON.parse(JSON.stringify(contacts)))
  } catch (error) {
    console.error("Contacts fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()
    
    const contact = await Contact.findByIdAndDelete(id)
    
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}