import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

console.log(
  "Cloudinary Config Loaded:",
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("CLOUDINARY FILE PATH:", process.cwd());
console.log("CLOUDINARY ENV:", process.env.CLOUDINARY_API_KEY);
export default cloudinary;