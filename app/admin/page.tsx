import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client"
import { isAdmin } from "@/lib/admin"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DWARKA product and order management.",
}

export default async function AdminPage() {
  const { userId } = await auth()
  
  // Check if user is authenticated
  if (!userId) {
    redirect("/sign-in")
  }
  
  // Check if user is admin
  const admin = await isAdmin()
  if (!admin) {
    redirect("/")
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Management
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Admin Dashboard</h1>
          </div>
          <AdminDashboardClient />
        </div>
      </div>
      <Footer />
    </main>
  )
}