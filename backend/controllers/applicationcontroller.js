import Errorhandle from "../middlewares/error.js";
import { trycatchasyncerror } from "../middlewares/trycatchasyncerror.js";
import { Application } from "../models/ApplicationSchema.js";
import { Job } from "../models/JobSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const postapplication = trycatchasyncerror(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, resume, coverletter } = req.body;

  if (!id || !name || !email || !phone || !address || !resume || !coverletter) {
    return new Errorhandle("Please provide all the required fields", 400);
  }
  const isalreadyappied = await Application.findOne({
    "jobinfo.id": id,
    "jobseekerinfo.id": req.user._id,
  });

  if (isalreadyappied) {
    return new Errorhandle("You have already applied for this job", 400);
  }
  const jobseekerinfo = {
    id: req.user.id,
    name,
    email,
    phone,
    address,
    resume,
    coverletter,
    role: "jobseeker",
  };

  const jobdetails = await Job.findById(id);
  if (!jobdetails) {
    return new Errorhandle("Job not found", 404);
  }

  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      const result = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "JobPortalMERN_resume",
      });

      if (!result || result.error) {
        return new Errorhandle("failed to upload ", 500);
      }

      jobseekerinfo.resume = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      return new Errorhandle("failed to upload resume ", 500);
    }
  } else {
    if (req.user && !req.user.resume.url) {
      return new Errorhandle("Please upload resume", 400);
    }
    jobseekerinfo.resume = {
      public_id: req.user && req.user.resume.public_id,
      url: eq.user && req.user.resume.url,
    };
  }

  const employeeinfo = {
    id: jobdetails.postedby.id,
    role: "employee",
  };

  const jobinfo = {
    id: id,
    title: jobdetails.title,
  };

  const application = Application.create({
    jobseekerinfo,
    employeeinfo,
    jobinfo,
  });

  return res.status(201).json({
    status: "success",
    message: "Application created successfully",
    application,
  });
});
export const getallapplicationemploee = trycatchasyncerror(
  async (req, res) => {}
);
export const getallapplicationjobseeker = trycatchasyncerror(
  async (req, res) => {}
);
export const deleteapplication = trycatchasyncerror(async (req, res) => {});
