import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required."],
      trim: true,
      minLength: 2,
      maxLength: 15,
    },
    email: {
      type: String,
      required: [true, "User Email is required."],
      trim: true,
      unique: true,
      lowercase: true,
      minLength: 5,
      maxLength: 255,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    pendingEmail: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 255,
      default: null,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required."],
    },
    verified: {
      type: Boolean,
      default: false,
      required: [true, "Verified is required"],
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpiresIn: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["Tester", "Admin", "User"],
      default: "User",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
