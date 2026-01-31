import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

export const getPresignedUrl = async (req, res) => {
  try {
    const { fileType } = req.body;

    const key = `products/${uuidv4()}.${fileType}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: `image/${fileType}`,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    res.json({ uploadUrl, key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
