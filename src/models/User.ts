import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password cannot be less than 6 characters"],
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    address: {
      type: String,
    },
    razorpayAccountId: {
      type: String, // For sellers to receive payouts
    },
  },
  { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
