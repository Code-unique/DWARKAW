"use client"

import { useState } from "react"
import { toast } from "sonner"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success("Welcome to the DWARKA community.")
      setEmail("")
    }
  }

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl mb-4 text-background">
          Join the DWARKA Community
        </h2>
        <p className="text-sm text-background/60 mb-10 max-w-md mx-auto leading-relaxed">
          Be the first to know about new collections, artisan stories, and exclusive offers.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full bg-transparent border border-background/30 px-4 py-3 text-sm text-background placeholder:text-background/40 focus:border-background/60 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full sm:w-auto whitespace-nowrap border border-background px-8 py-3 text-xs tracking-[0.2em] uppercase text-background hover:bg-background hover:text-foreground transition-all duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
