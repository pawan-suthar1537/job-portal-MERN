import app from "./app.js";
const port = process.env.PORT || 3000;
import cloudinary from "cloudinary";
import { config } from "dotenv";

config({
  path: "./config/config.env",
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
