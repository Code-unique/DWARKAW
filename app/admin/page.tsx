import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "DWARKA product and order management.",
}

export default function AdminPage() {
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
          <AdminDashboard />
        </div>
      </div>
      <Footer />
    </main>
  )
}
