import mongoose from "mongoose";
import validator from "validator";

const ApplicationSchema = new mongoose.Schema(
  {
    jobseekerinfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      resume: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      coverletter: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        enum: ["jobseeker"],
      },
    },
    employeeinfo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      role: {
        type: String,
        required: true,
        enum: ["employee"],
      },
    },
    jobinfo: {
      jobid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      jobtitle: {
        type: String,
        required: true,
      },
      jobtype: {
        type: String,
      },
      location: {
        type: String,
      },
      companyname: {
        type: String,
      },
      introduction: {
        type: String,
      },
      responsibility: {
        type: String,
      },
      qualification: {
        type: String,
      },
      offers: {
        type: String,
      },
      salary: {
        type: String,
      },
      hiringmultiple: {
        type: String,
      },
      website: {
        title: String,
        url: String,
      },
      jobniches: {
        type: String,
      },
      newsletter: {
        type: Boolean,
      },
      jobposted: {
        type: Date,
      },
    },
    deletedby: {
      jobseeker: {
        type: Boolean,
        default: false,
      },
      employee: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", ApplicationSchema);
