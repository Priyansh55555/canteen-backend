import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu Item name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Menu Item price is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String, // Cloudinary image URL
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    canShowWithoutLogin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", MenuItemSchema);
