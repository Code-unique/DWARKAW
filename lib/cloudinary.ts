import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImageToCloudinary(file: Buffer | string, folder: string = 'dwarka/products') {
  try {
    // If it's a buffer (from file upload)
    if (Buffer.isBuffer(file)) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(file)
      })
    }
    
    // If it's a base64 string
    if (typeof file === 'string' && file.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      })
      return result
    }

    throw new Error('Invalid file format')
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

export function getCloudinaryPublicId(url: string) {
  // Extract public ID from Cloudinary URL
  const matches = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp)$/)
  return matches ? matches[1] : null
}

export default cloudinary