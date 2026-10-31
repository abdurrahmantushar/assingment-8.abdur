import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImageCloude = async (
  image: Express.Multer.File
): Promise<UploadApiResponse> => {
  const buffer = image.buffer;

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "Abdur",
          resource_type: "auto",
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          if (!uploadResult) {
            reject(new Error("Image upload failed"));
            return;
          }

          resolve(uploadResult);
        }
      )
      .end(buffer);
  });
};