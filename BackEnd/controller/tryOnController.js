// controllers/tryOnController.js
import TryOn from "../models/TryOn.js";
import Product from "../models/ProductModel.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const generateTryOn = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.body) {
      return res.status(400).json({
        message: "Form-data required (productId, size)",
      });
    }

    const { productId, size } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId missing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "User image required" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.tryOnEnabled) {
      return res.status(400).json({ message: "Try-On not available" });
    }

    const userImageUrl = await uploadToS3(req.file);

    const tryOn = await TryOn.create({
      userImage: userImageUrl,
      product: productId,
      size,
      status: "processing",
    });

    // 🔥 AI CALL (mock / real)
    const aiRes = await axios.post(
      "https://api.virtual-tryon.ai/generate",
      {
        human_image: userImageUrl,
        cloth_image: product.image,
        size,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    tryOn.generatedImage = aiRes.data.output_image;
    tryOn.status = "completed";
    await tryOn.save();

    res.json({
      success: true,
      tryOnImage: tryOn.generatedImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Try-On failed" });
  }
};

