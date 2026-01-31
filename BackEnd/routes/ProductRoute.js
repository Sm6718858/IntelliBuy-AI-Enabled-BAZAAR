import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  realtedProductController,
  reviewProduct,
  searchProductController,
  singleProduct,
  updateProduct
} from "../controller/ProductController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { getPresignedUrl } from "../controller/PresignedController.js";
import { upload } from "../middleware/upload.js";
import { uploadProductImage } from "../controller/uploadController.js";

const router = express.Router();

router.post("/create-product", createProduct);

router.post(
  "/upload-product-image",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  uploadProductImage
);
router.get("/get-products", getProduct);
router.get("/single-product/:slug", singleProduct);
router.post("/s3/presigned-url", getPresignedUrl);
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProduct);
router.put("/update-product/:pid", requireSignIn, isAdmin, updateProduct);

router.post("/product-filters", productFiltersController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);
router.get("/related-product/:pid/:cid", realtedProductController);
router.get("/product-category/:slug", productCategoryController);
router.post("/review/:productId", requireSignIn, reviewProduct);

export default router;
