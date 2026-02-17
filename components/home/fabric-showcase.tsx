import Image from "next/image"
import Link from "next/link"

const fabrics = [
  {
    name: "Cotton",
    image: "/images/fabric-cotton.jpg",
    description:
      "Organic cotton from the Terai plains, hand-spun for unmatched softness and breathability.",
    href: "/shop?fabric=cotton",
  },
  {
    name: "Hemp",
    image: "/images/fabric-hemp.jpg",
    description:
      "Himalayan hemp grown without pesticides, naturally durable and beautifully textured.",
    href: "/shop?fabric=hemp",
  },
  {
    name: "Linen",
    image: "/images/fabric-linen.jpg",
    description:
      "Premium linen that softens with every wash, offering effortless elegance and comfort.",
    href: "/shop?fabric=linen",
  },
]

export function FabricShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Our Fabrics
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-balance">
          Nature{"'"}s Finest Materials
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {fabrics.map((fabric) => (
          <Link
            key={fabric.name}
            href={fabric.href}
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden mb-6">
              <Image
                src={fabric.image}
                alt={`${fabric.name} fabric`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="font-serif text-xl mb-2">{fabric.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {fabric.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
