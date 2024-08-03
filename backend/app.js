import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./databse/db.js";
import { errorHandler } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userrouter from "./router/userrouter.js";
import jobrouter from "./router/jobrouter.js";
import applicationrouter from "./router/applicationrouter.js";
import { EventEmitter } from "events";
import { newsletter } from "./automation/Newsletter.js";
EventEmitter.setMaxListeners(20); // Adjust the number as needed

const app = express();
config({
  path: "./config/config.env",
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/user", userrouter);
app.use("/api/job", jobrouter);
app.use("/api/application", applicationrouter);
newsletter();
connectDB();
app.use(errorHandler);

export default app;
