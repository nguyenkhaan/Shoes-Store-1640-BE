import { v2 as cloudinary } from "cloudinary";
import { ENV } from "~/configs/env.config";

cloudinary.config({
    api_key: ENV.CLOUDINARY_API as string,
    api_secret: ENV.CLOUDINARY_SECRET as string,
    cloud_name: ENV.CLOUDINARY_CLOUD as string,
});

export default cloudinary
