"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" },
]

const fabrics = [
  { value: "all", label: "All Fabrics" },
  { value: "cotton", label: "Cotton" },
  { value: "hemp", label: "Hemp" },
  { value: "linen", label: "Linen" },
  { value: "cotton-hemp", label: "Cotton-Hemp" },
  { value: "cotton-linen", label: "Cotton-Linen" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [fabric, setFabric] = useState(searchParams.get("fabric") || "all")
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Calculate active filters count
  useEffect(() => {
    let count = 0
    if (category !== "all") count++
    if (fabric !== "all") count++
    if (search) count++
    if (sort !== "newest") count++
    setActiveFilterCount(count)
  }, [category, fabric, search, sort])

  // Debounced URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (category !== "all") params.set("category", category)
      if (fabric !== "all") params.set("fabric", fabric)
      if (sort !== "newest") params.set("sort", sort)
      if (search) params.set("search", search)
      
      router.push(`/shop?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [category, fabric, sort, search, router])

  const clearSearch = useCallback(() => {
    setSearch("")
    searchInputRef.current?.focus()
  }, [])

  const resetFilters = useCallback(() => {
    setCategory("all")
    setFabric("all")
    setSort("newest")
    setSearch("")
  }, [])

  return (
    <div className="border-b border-border/40 pb-6">
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between lg:hidden py-2 px-1 hover:bg-muted/50 rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-controls="filter-content"
      >
        <span className="text-xs font-medium tracking-wider uppercase flex items-center gap-2">
          Filter & Sort
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-300 text-muted-foreground",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Filter content */}
      <div 
        id="filter-content"
        className={cn(
          "mt-4 lg:mt-0 transition-all duration-300",
          !isOpen && "hidden lg:block"
        )}
      >
        {/* Active filters summary - mobile only */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label 
              htmlFor="search" 
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground flex items-center justify-between"
            >
              Search
              {search && (
                <button
                  onClick={clearSearch}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-border bg-transparent pl-9 pr-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <label 
              htmlFor="category" 
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem] pr-10"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fabric filter */}
          <div className="space-y-2">
            <label 
              htmlFor="fabric" 
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
            >
              Fabric
            </label>
            <select
              id="fabric"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem] pr-10"
            >
              {fabrics.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label 
              htmlFor="sort" 
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-border bg-transparent px-4 py-2.5 text-sm rounded-md focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem] pr-10"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset filters button - desktop */}
        {activeFilterCount > 0 && (
          <div className="hidden lg:flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}