import express from "express";
import {
  postjob,
  getall,
  getmyjobs,
  deletejob,
  getjobbyid,
} from "../controllers/jobcontroller.js";
import { isauth, isauthorized } from "../middlewares/isauth.js";
const router = express.Router();

router.post("/postjob", isauth, isauthorized("employee"), postjob);
router.get("/getall", getall);
router.get("/getmyjobs", isauth, isauthorized("employee"), getmyjobs);
router.delete("/delete/:id", isauth, isauthorized("employee"), deletejob);
router.get("/getjob/:id", getjobbyid);

export default router;
