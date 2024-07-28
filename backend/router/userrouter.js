import express from "express";
import {
  getLoginUserDetails,
  login,
  logout,
  register,
  updatepassword,
  updateuserdetails,
} from "../controllers/usercontroller.js";
import { isauth } from "../middlewares/isauth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isauth, logout);
router.get("/mydetails", isauth, getLoginUserDetails);
router.put("/update", isauth, updateuserdetails);
router.put("/updatepassword", isauth, updatepassword);

export default router;
