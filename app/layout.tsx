import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/cart/cart-provider"
import { CurrencyProvider } from "@/components/currency-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: {
    default: "DWARKA - Sustainable Fashion, Rooted in Nature",
    template: "%s | DWARKA",
  },
  description:
    "DWARKA is a Nepal-based sustainable fashion brand by Merina Giri, crafting timeless pieces from natural fabrics like cotton, hemp, and linen.",
  keywords: [
    "sustainable fashion",
    "Nepal fashion",
    "hemp clothing",
    "linen clothing",
    "cotton clothing",
    "slow fashion",
    "natural fabrics",
    "DWARKA",
    "Merina Giri",
  ],
}

export const viewport: Viewport = {
  themeColor: "#A0705A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="font-sans antialiased">
          <CurrencyProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </CurrencyProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
