import express from "express";
import { isauth, isauthorized } from "../middlewares/isauth.js";
import {
  deleteapplication,
  getallapplicationemploee,
  getallapplicationjobseeker,
  postapplication,
} from "../controllers/applicationcontroller.js";

const router = express.Router();

router.post(
  "/post/:id",
  isauth,
  isauthorized("jobseeker"),
  (req, res, next) => {
    console.log("Route hit: /post/:id");
    next();
  },
  postapplication
);
router.get(
  "/employee/getall",
  isauth,
  isauthorized("employee"),
  getallapplicationemploee
);
router.get(
  "/jobseeker/getall",
  isauth,
  isauthorized("jobseeker"),
  getallapplicationjobseeker
);
router.delete(
  "/delete/:id",
  isauth,

  deleteapplication
);

export default router;
