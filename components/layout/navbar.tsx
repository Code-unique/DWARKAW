"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, ArrowLeftRight } from "lucide-react"
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { useCurrency } from "@/components/currency-provider"
import { MobileNav } from "./mobile-nav"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { currency, toggleCurrency } = useCurrency()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isHome
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "md:hidden transition-colors",
              scrolled || !isHome ? "text-foreground" : "text-primary-foreground"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide uppercase transition-colors",
                  scrolled || !isHome
                    ? pathname === link.href
                      ? "text-primary font-medium"
                      : "text-foreground/70 hover:text-foreground"
                    : pathname === link.href
                      ? "text-primary-foreground font-medium"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Brand */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1
              className={cn(
                "brand-name text-xl md:text-2xl font-semibold transition-colors",
                scrolled || !isHome
                  ? "text-foreground"
                  : "text-primary-foreground"
              )}
            >
              DWARKA
            </h1>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Currency toggle */}
            <button
              onClick={toggleCurrency}
              className={cn(
                "hidden md:flex items-center gap-1 text-xs tracking-wider uppercase transition-colors",
                scrolled || !isHome
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              )}
              aria-label={`Switch to ${currency === "NPR" ? "USD" : "NPR"}`}
            >
              <ArrowLeftRight className="h-3 w-3" />
              {currency}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingBag
                className={cn(
                  "h-5 w-5 transition-colors",
                  scrolled || !isHome
                    ? "text-foreground"
                    : "text-primary-foreground"
                )}
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>

            {/* Auth */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    scrolled || !isHome
                      ? "text-foreground/70 hover:text-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currency={currency}
        toggleCurrency={toggleCurrency}
      />
    </>
  )
}
