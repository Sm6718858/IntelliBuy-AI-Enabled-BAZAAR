// models/TryOn.js
import mongoose from "mongoose";

const tryOnSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    size: String,
    userImage: String,
    generatedImage: String,
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TryOn", tryOnSchema);
