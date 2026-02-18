import { NextRequest, NextResponse } from "next/server"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

// Modern App Router route segment configuration
// Replace the deprecated config export with these individual exports
export const runtime = 'nodejs' // Use Node.js runtime for Cloudinary upload
export const dynamic = 'force-dynamic' // Prevent caching for uploads
export const maxDuration = 30 // Max execution time in seconds (adjust as needed)
export const revalidate = 0 // Don't cache this route

export async function POST(request: NextRequest) {
  try {
    // Using request.formData() - this replaces the need for bodyParser: false
    const formData = await request.formData()
    const file = formData.get("image") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(buffer) as any

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

// ❌ REMOVE THIS ENTIRE BLOCK - it's deprecated and ignored in App Router
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }