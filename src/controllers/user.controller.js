import User from "../models/User.js";
import { uploadToCloudinaryByUserId } from "../utils/cloudinaryUpload.js";

const ALLOWED_FIELDS = ["name","fullName", "email", "profilePicture", "posterPicture", "phoneNumber", "address"];
const ALLOW_FILE_FIELDS = ["profilePicture", "posterPicture"];

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const updates = {};

    for(const fieldname of Object.keys(req.files)){ 
      if(ALLOW_FILE_FIELDS.includes(fieldname) && req.files[fieldname].length > 0 ){
       const uploaded = await uploadToCloudinaryByUserId(req.files[fieldname][0]?.buffer, userId);
       updates[fieldname] = uploaded.secure_url;
      }
    }

    for (const field of ALLOWED_FIELDS) {
      if (req.body?.[field] && req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};
