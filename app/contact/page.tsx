"use client"

import { useState } from "react"
import { MapPin, Mail, Phone } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/lib/actions/contact-actions"
import { toast } from "sonner"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContactForm(form)
      toast.success("Message sent. We will get back to you soon.")
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-xs tracking-wider uppercase text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-transparent border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-xs tracking-wider uppercase text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-2 bg-transparent border-border"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="subject"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-transparent border-border"
                />
              </div>
              <div>
                <Label
                  htmlFor="message"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-2 bg-transparent border-border resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Contact info */}
            <div className="flex flex-col gap-8 lg:pl-8">
              <div>
                <h2 className="font-serif text-2xl mb-6">Visit Us</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  We would love to hear from you. Whether you have a question about
                  our collection, need assistance with an order, or want to
                  collaborate, we are here to help.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Studio & Showroom</p>
                    <p className="text-sm text-muted-foreground">
                      Jhamsikhel, Lalitpur
                      <br />
                      Kathmandu Valley, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-sm text-muted-foreground">
                      hello@dwarka.com.np
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +977 01-5555-123
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-8">
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">
                  Studio Hours
                </p>
                <p className="text-sm text-muted-foreground">
                  Sunday - Friday: 10:00 AM - 6:00 PM
                  <br />
                  Saturday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
