import Link from "next/link"

const quickLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

const fabricLinks = [
  { href: "/shop?fabric=cotton", label: "Cotton" },
  { href: "/shop?fabric=hemp", label: "Hemp" },
  { href: "/shop?fabric=linen", label: "Linen" },
]

const categoryLinks = [
  { href: "/shop?category=tops", label: "Tops" },
  { href: "/shop?category=dresses", label: "Dresses" },
  { href: "/shop?category=bottoms", label: "Bottoms" },
  { href: "/shop?category=accessories", label: "Accessories" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="brand-name text-xl mb-4">DWARKA</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sustainable fashion rooted in nature. Handcrafted in Nepal from cotton, hemp, and linen by artisans who honour tradition.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Navigate
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fabrics */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Fabrics
            </h3>
            <ul className="flex flex-col gap-3">
              {fabricLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Categories
            </h3>
            <ul className="flex flex-col gap-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-border pt-8 md:flex-row md:justify-between">
          <p className="text-xs text-muted-foreground">
            Handcrafted in Nepal with love for the earth.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DWARKA by Merina Giri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
