"use client"

import Link from "next/link"
import { X, ArrowLeftRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Currency } from "@/lib/currency"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "My Orders" },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
  currency: Currency
  toggleCurrency: () => void
}

export function MobileNav({
  open,
  onClose,
  currency,
  toggleCurrency,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-background p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="brand-name text-lg">DWARKA</SheetTitle>
          <button onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5 text-foreground" />
          </button>
        </SheetHeader>

        <nav className="flex flex-col px-6 py-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-lg tracking-wide uppercase text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-6 py-6">
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-2 text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Currency: {currency}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
