import { ICloudinaryConfigs } from './type.configs';

export const CloudinaryConfigs: ICloudinaryConfigs = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dvpxsfcqa',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '531411992744384',
  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET || 'S9agxGtkOUBLNZLR9vq5a8TFUUc',
};
