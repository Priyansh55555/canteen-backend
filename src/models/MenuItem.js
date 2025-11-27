import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  itemName: String,
  price: Number,
  category: String,
  image: String,
  availability: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("MenuItem", menuItemSchema);
