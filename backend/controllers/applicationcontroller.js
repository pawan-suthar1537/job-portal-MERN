import Errorhandle from "../middlewares/error.js";
import { trycatchasyncerror } from "../middlewares/trycatchasyncerror.js";
import { Application } from "../models/ApplicationSchema.js";
import { Job } from "../models/JobSchema.js";
import { User } from "../models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const postapplication = trycatchasyncerror(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new Errorhandle("Job id is required", 400));
  }

  const { name, email, phone, address, coverletter } = req.body;

  if (!name || !email || !phone || !address || !coverletter) {
    return next(new Errorhandle("Please provide all the required fields", 400));
  }

  const jobseekerinfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverletter,
    role: "jobseeker",
  };

  const jobdetails = await Job.findById(id);
  if (!jobdetails) {
    return next(new Errorhandle("Job not found", 404));
  }

  const employee = await User.findById(jobdetails.postedby);
  if (!employee) {
    return next(new Errorhandle("Employee not found", 404));
  }

  console.log(employee);
  console.log(jobdetails);

  const isalreadyappied = await Application.findOne({
    "jobinfo.id": id,
    "jobseekerinfo.id": req.user._id,
  });

  if (isalreadyappied) {
    return next(new Errorhandle("You have already applied for this job", 400));
  }

  // Check if files are uploaded
  if (req.files && req.files.resume) {
    const resumeFile = req.files.resume;

    try {
      const result = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
        folder: "JobPortalMERN_resume",
      });

      if (!result || result.error) {
        return next(new Errorhandle("Failed to upload resume", 500));
      }

      jobseekerinfo.resume = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      return next(new Errorhandle("Failed to upload resume", 500));
    }
  } else {
    if (!req.user.resume?.url) {
      return next(new Errorhandle("Please upload resume", 400));
    }
    jobseekerinfo.resume = {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    };
  }

  const employeeinfo = {
    id: employee._id,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    role: employee.role,
  };

  const jobinfo = {
    jobid: jobdetails._id,
    jobtitle: jobdetails.title,
    jobtype: jobdetails.jobtype,
    location: jobdetails.location,
    companyname: jobdetails.companyname,
    introduction: jobdetails.introduction,
    responsibility: jobdetails.responsibility,
    qualification: jobdetails.qualification,
    offers: jobdetails.offers,
    salary: jobdetails.salary,
    hiringmultiple: jobdetails.hiringmultiple,
    website: jobdetails.website,
    jobniches: jobdetails.jobniches,
    newsletter: jobdetails.newsletter,
    jobposted: jobdetails.jobposted,
    postedby: jobdetails.postedby,
  };

  const application = await Application.create({
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
  async (req, res, next) => {
    const { _id } = req.user;
    console.log(_id);

    try {
      // Find all job IDs posted by the employee
      const jobs = await Job.find({
        postedby: _id,
      });

      if (!jobs || jobs.length === 0) {
        return res.status(404).json({
          message: "No jobs found for the employee",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Employee's all jobs posts fetched successfully",
        success: true,
        jobs,
      });
    } catch (error) {
      return next(new Errorhandle(`Error: ${error.message}`, 400));
    }
  }
);

export const getallapplicationjobseeker = trycatchasyncerror(
  async (req, res, next) => {
    const { _id } = req.user;
    console.log(_id);
    try {
      const applications = await Application.find({
        "jobseekerinfo.id": _id,
        "deletedby.jobseeker": false,
      }).populate("jobinfo.jobid");

      if (!applications || applications.length === 0) {
        return res.status(404).json({
          message: "No applications found for the jobseeker",
          success: false,
        });
      }

      return res.status(200).json({
        message: "jobseeker all Applications fetched successfully",
        success: true,
        applications,
      });
    } catch (error) {
      return next(new Errorhandle(`Error: ${error.message}`, 400));
    }
  }
);
export const deleteapplication = trycatchasyncerror(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  try {
    const application = await Application.findById(id);
    if (!application) {
      return next(new Errorhandle("Application not found", 404));
    }

    switch (role) {
      case "employee":
        application.deletedby.employee = true;
        await application.save();
        break;
      case "jobseeker":
        application.deletedby.jobseeker = true;
        await application.save();
        break;
      default:
        return next(new Errorhandle("Invalid role", 400));
    }

    if (
      application.deletedby.employee === true &&
      application.deletedby.jobseeker === true
    ) {
      await Application.deleteOne(id);
    }
    return res.status(200).json({
      message: `Application deleted successfully by ${role} ${req.user.name}`,
      success: true,
      application,
    });
  } catch (error) {
    return next(new Errorhandle(`Error: ${error.message}`, 400));
  }
});
