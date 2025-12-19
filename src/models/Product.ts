import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price slightly must be positive"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Rooster", "Hen", "Egg", "Chick", "Other"],
    },
    images: {
      type: [String],
      validate: [
        (val: string[]) => val.length > 0,
        "Please provide at least one image",
      ],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    breed: {
      type: String,
      default: "Native",
    },
    weight: {
      type: String, // e.g., "1.5kg" or "50g"
    },
    age: {
      type: String, // e.g., "1 year" or "1 week"
    },
    stock: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
