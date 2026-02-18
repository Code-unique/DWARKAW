import { auth } from "@clerk/nextjs/server"

// This should only be used in Server Components and Server Actions
export async function isAdmin() {
  try {
    const { userId } = await auth()
    if (!userId) return false

    // For development, you can use a hardcoded admin email or user ID
    const adminUserIds = (process.env.ADMIN_USER_IDS || "").split(",")
    if (adminUserIds.includes(userId)) return true

    // Option 2: Check by email (requires fetching from Clerk)
    if (process.env.CLERK_SECRET_KEY) {
      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",")
      
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

// For client-side admin checks (if needed)
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",")
  return adminEmails.includes(email)
}