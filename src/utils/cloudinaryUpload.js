import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "canteen_items" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

export const uploadToCloudinaryByUserId = async (fileBuffer, userId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `userId/${userId}` },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};