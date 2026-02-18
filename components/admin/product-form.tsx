"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ProductFormProps {
  initialData?: any
  isEditing?: boolean
}

interface ColorInput {
  name: string
  hex: string
}

const categories = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "accessories", label: "Accessories" },
  { value: "outerwear", label: "Outerwear" },
]

const fabrics = [
  { value: "cotton", label: "Cotton" },
  { value: "hemp", label: "Hemp" },
  { value: "linen", label: "Linen" },
  { value: "cotton-hemp", label: "Cotton-Hemp" },
  { value: "cotton-linen", label: "Cotton-Linen" },
]

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    priceNPR: initialData?.priceNPR || "",
    priceUSD: initialData?.priceUSD || "",
    category: initialData?.category || "tops",
    fabric: initialData?.fabric || "cotton",
    sizes: initialData?.sizes?.join(", ") || "",
    colors: initialData?.colors?.map((c: ColorInput) => `${c.name}:${c.hex}`).join(", ") || "",
    inStock: initialData?.inStock !== undefined ? initialData.inStock : true,
    featured: initialData?.featured || false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadPromises = Array.from(files).map(async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.url
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${file.name}`)
        return null
      }
    })

    const uploadedUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null)
    setImages(prev => [...prev, ...uploadedUrls])
    setUploading(false)
    
    // Clear the input
    e.target.value = ''
  }

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse sizes and colors with proper typing
      const sizesArray: string[] = formData.sizes
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '')

      const colorsArray: ColorInput[] = formData.colors
        .split(',')
        .map((c: string) => c.trim())
        .filter((c: string) => c !== '')
        .map((c: string) => {
          const [name, hex] = c.split(':')
          return { 
            name: name?.trim() || '', 
            hex: hex?.trim() || '#000000' 
          }
        })

      // Validate images
      if (images.length === 0) {
        toast.error('Please upload at least one image')
        setLoading(false)
        return
      }

      const productData = {
        ...formData,
        priceNPR: parseFloat(formData.priceNPR as string),
        priceUSD: parseFloat(formData.priceUSD as string),
        images,
        sizes: sizesArray,
        colors: colorsArray,
      }

      const url = isEditing 
        ? `/api/admin/products?id=${initialData._id}`
        : '/api/admin/products'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }

      toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label className="text-xs tracking-wider uppercase">Product Images</Label>
        
        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url: string, index: number) => (
            <div key={index} className="relative aspect-square border border-border group">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <label className="aspect-square border border-border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <div className="h-6 w-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload Images</span>
              </>
            )}
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload up to 5 images (max 5MB each). First image will be the main product image.
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-xs tracking-wider uppercase">
            Product Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="slug" className="text-xs tracking-wider uppercase">
            Slug (URL)
          </Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="auto-generated if empty"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to auto-generate from name
          </p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-xs tracking-wider uppercase">
            Short Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="longDescription" className="text-xs tracking-wider uppercase">
            Long Description
          </Label>
          <Textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows={4}
            className="mt-2"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="priceNPR" className="text-xs tracking-wider uppercase">
            Price (NPR) *
          </Label>
          <Input
            id="priceNPR"
            name="priceNPR"
            type="number"
            min="0"
            step="1"
            value={formData.priceNPR}
            onChange={handleChange}
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="priceUSD" className="text-xs tracking-wider uppercase">
            Price (USD) *
          </Label>
          <Input
            id="priceUSD"
            name="priceUSD"
            type="number"
            min="0"
            step="0.01"
            value={formData.priceUSD}
            onChange={handleChange}
            required
            className="mt-2"
          />
        </div>
      </div>

      {/* Category and Fabric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category" className="text-xs tracking-wider uppercase">
            Category *
          </Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full mt-2 border border-border bg-transparent px-4 py-2 text-sm focus:outline-none focus:border-foreground"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="fabric" className="text-xs tracking-wider uppercase">
            Fabric *
          </Label>
          <select
            id="fabric"
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            required
            className="w-full mt-2 border border-border bg-transparent px-4 py-2 text-sm focus:outline-none focus:border-foreground"
          >
            {fabrics.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sizes and Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sizes" className="text-xs tracking-wider uppercase">
            Sizes
          </Label>
          <Input
            id="sizes"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="S, M, L, XL (comma separated)"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter sizes separated by commas
          </p>
        </div>

        <div>
          <Label htmlFor="colors" className="text-xs tracking-wider uppercase">
            Colors
          </Label>
          <Input
            id="colors"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Natural:#C4B5A0, Black:#000000"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Format: Name:HexCode (comma separated)
          </p>
        </div>
      </div>

      {/* Status Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">In Stock</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Featured Product</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-6 text-xs tracking-[0.25em] uppercase bg-foreground text-background hover:bg-foreground/90"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="px-8 py-6 text-xs tracking-[0.25em] uppercase"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}