"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.memoryUpload = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
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
exports.upload = (0, multer_1.default)({ storage: storage });
exports.memoryUpload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
