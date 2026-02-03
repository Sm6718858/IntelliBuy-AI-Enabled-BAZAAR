// routes/tryOnRoutes.js
import express from "express";
import { upload } from "../config/multer.js";
import { generateTryOn } from "../controller/tryOnController.js";

const router = express.Router();

router.post("/try-on", upload.single("image"), generateTryOn);

export default router;
