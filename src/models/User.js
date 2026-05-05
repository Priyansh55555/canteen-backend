import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  fullName: {type: String, default: ""},
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  profilePicture: {type: String, default: ""},
  posterPicture: { type: String, default : ""},
  isVerified: { type: Boolean, default: false },
  verificationOtp: String,
  verificationOtpExpiry: Date,
  phoneNumber: { type: Number, default: "" },
  gender: {type: String, default: "male", enum: ["male", "female", "other"] },
  address: { type: String, default: "" },
}, { timestamps: true });

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verificationOtp;
    delete ret.verificationOtpExpiry;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
