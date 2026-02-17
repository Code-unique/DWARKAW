"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "accessories", label: "Accessories" },
  { value: "outerwear", label: "Outerwear" },
]

const fabrics = [
  { value: "all", label: "All Fabrics" },
  { value: "cotton", label: "Cotton" },
  { value: "hemp", label: "Hemp" },
  { value: "linen", label: "Linen" },
  { value: "cotton-hemp", label: "Cotton & Hemp" },
  { value: "cotton-linen", label: "Cotton & Linen" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentFabric = searchParams.get("fabric") || "all"
  const currentSort = searchParams.get("sort") || "newest"

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all" || value === "newest") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`/shop?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={currentCategory}
        onValueChange={(v) => updateFilter("category", v)}
      >
        <SelectTrigger className="w-[160px] text-xs tracking-wider uppercase bg-transparent border-border">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.value} value={c.value} className="text-xs">
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentFabric}
        onValueChange={(v) => updateFilter("fabric", v)}
      >
        <SelectTrigger className="w-[160px] text-xs tracking-wider uppercase bg-transparent border-border">
          <SelectValue placeholder="Fabric" />
        </SelectTrigger>
        <SelectContent>
          {fabrics.map((f) => (
            <SelectItem key={f.value} value={f.value} className="text-xs">
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentSort}
        onValueChange={(v) => updateFilter("sort", v)}
      >
        <SelectTrigger className="w-[180px] text-xs tracking-wider uppercase bg-transparent border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xs">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
