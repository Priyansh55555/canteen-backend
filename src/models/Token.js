import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  tokenNumber: Number,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: {
    type: String,
    enum: ["waiting", "serving", "completed"],
    default: "waiting"
  }
}, { timestamps: true });

export default mongoose.model("Token", tokenSchema);
