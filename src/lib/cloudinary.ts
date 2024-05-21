import cloudinary from 'cloudinary';
import { CloudinaryConfigs } from '../configs/cloudinary-configs';
const cloudinaryClient = cloudinary.v2;
cloudinaryClient.config({
  cloud_name: CloudinaryConfigs.CLOUDINARY_CLOUD_NAME,
  api_key: CloudinaryConfigs.CLOUDINARY_API_KEY,
  api_secret: CloudinaryConfigs.CLOUDINARY_API_SECRET,
});
export default cloudinaryClient;
