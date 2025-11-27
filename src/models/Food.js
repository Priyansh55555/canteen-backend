import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Food price is required"],
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
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
