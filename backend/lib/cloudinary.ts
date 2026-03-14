import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'auto', // Let Cloudinary decide (image for PDF is actually good for preview)
    public_id: (req: any, file: any) => {
      // Keep original name but remove extension from base and append it safely
      const originalName = file.originalname.split('.')[0];
      const extension = file.originalname.split('.').pop();
      return `${Date.now()}-${originalName}.${extension}`;
    }
  } as any,
});

export const upload = multer({ storage: storage });
export { cloudinary };
