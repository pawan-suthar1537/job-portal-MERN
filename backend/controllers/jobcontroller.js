import Errorhandle from "../middlewares/error.js";
import { trycatchasyncerror } from "../middlewares/trycatchasyncerror.js";
import { Job } from "../models/JobSchema.js";

const CACHE_EXPIRATION_TIME = 3600 * 1000;

export const postjob = trycatchasyncerror(async (req, res, next) => {
  try {
    const {
      title,
      jobtype,
      location,
      companyname,
      introduction,
      responsibility,
      qualification,
      offers,
      salary,
      hiringmultiple,
      websitetitle,
      websiteurl,
      jobniches,
      newsletter,
    } = req.body;
    if (
      !title ||
      !jobtype ||
      !location ||
      !companyname ||
      !introduction ||
      !responsibility ||
      !qualification ||
      !offers ||
      !salary
    ) {
      return next(
        new Errorhandle(`Please fill all the fields to post a job `, 400)
      );
    }

    if (!websitetitle || !websiteurl) {
      return next(
        new Errorhandle("Please fill all the fields in website", 400)
      );
    }

    const postedby = req.user._id;

    const job = new Job({
      title,
      jobtype,
      location,
      companyname,
      introduction,
      responsibility,
      qualification,
      offers,
      salary,
      hiringmultiple,
      website: {
        title: websitetitle,
        url: websiteurl,
      },

      jobniches,
      newsletter,
      postedby,
    });

    await job.save();

    return res.status(201).json({
      status: "success",
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});

export const getall = trycatchasyncerror(async (req, res, next) => {
  try {
    const { location, jobniches, serchkeyword } = req.query;
    const queryobj = {};
    if (location) {
      queryobj.location = location;
    }
    if (jobniches) {
      queryobj.jobniches = jobniches;
    }
    if (serchkeyword) {
      queryobj.$or = [
        { title: { $regex: serchkeyword, $options: "i" } },
        { companyname: { $regex: serchkeyword, $options: "i" } },
        { location: { $regex: serchkeyword, $options: "i" } },
      ];
    }

    const cacheKey = JSON.stringify(queryobj);

    if (
      cache[cacheKey] &&
      Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRATION_TIME
    ) {
      const cachedData = cache[cacheKey].data;
      return res.status(200).json({
        status: "success",
        message: "Jobs fetched successfully (from cache)",
        jobs: cachedData,
        count: cachedData.length,
      });
    }

    const jobs = await Job.find(queryobj);

    if (!jobs || jobs.length === 0) {
      return next(new Errorhandle(`No jobs found`, 404));
    }

    cache[cacheKey] = {
      data: jobs,
      timestamp: Date.now(),
    };

    return res.status(200).json({
      status: "success",
      message: "Jobs fetched successfully",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});

export const getmyjobs = trycatchasyncerror(async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedby: req.user._id });
    if (!jobs || jobs.length === 0) {
      return next(new Errorhandle(`No jobs found`, 404));
    }
    return res.status(200).json({
      status: "success",
      message: "my posted Jobs fetched successfully",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});
export const deletejob = trycatchasyncerror(async (req, res, next) => {
  try {
    console.log("delete chla");
    const { id } = req.params;
    console.log("Delete Job Request Received for ID:", id);
    const job = await Job.findById(id);
    if (!job) {
      return next(new Errorhandle(`No job found`, 404));
    }
    if (job.postedby.toString() !== req.user._id.toString()) {
      return next(
        new Errorhandle(`You are not authorized to delete this job`, 400)
      );
    }
    await Job.deleteOne({ _id: id });
    console.log("Job Deleted Successfully:", id);
    return res.status(200).json({
      status: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error) {
    console.error("Delete Job Error", error);
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});

export const getjobbyid = trycatchasyncerror(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new Errorhandle(`No job found`, 404));
    }
    return res.status(200).json({
      status: "success",
      message: "Job details fetched successfully",
      job,
    });
  } catch (error) {
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});
