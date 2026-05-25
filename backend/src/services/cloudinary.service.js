import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary.js";

const getResourceType = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "raw";
  return "auto";
};

export const uploadToCloudinary = (file, folder = "studyhub") =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const resourceType = getResourceType(file.mimetype);
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const deleteFromCloudinary = async (asset) => {
  if (!asset?.publicId) return;
  await cloudinary.uploader.destroy(asset.publicId, {
    resource_type: asset.resourceType || "image"
  });
};
