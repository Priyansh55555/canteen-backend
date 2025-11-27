import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: Number
    }
  ],
  totalAmount: Number,
  tokenNumber: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "ready", "completed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
