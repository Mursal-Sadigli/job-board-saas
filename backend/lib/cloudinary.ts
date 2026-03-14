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
  params: async (req: any, file: any) => {
    const isImage = file.mimetype.startsWith('image/');
    const extension = file.originalname.split('.').pop()?.toLowerCase() || (isImage ? 'png' : 'pdf');
    const safeName = file.originalname
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    
    return {
      folder: isImage ? 'images' : 'resumes',
      resource_type: isImage ? 'image' : 'raw',
      public_id: `${Date.now()}-${safeName}`,
      format: isImage ? undefined : extension, // raw files need extension in public_id or format
    };
  },
});

export const upload = multer({ storage: storage });
export const memoryUpload = multer({ storage: multer.memoryStorage() });
export { cloudinary };
