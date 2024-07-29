import mongoose from "mongoose";
import validator from "validator";

const ApplicationSchema = new mongoose.Schema({
  jobseekerinfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    role: {
      type: String,
      required: true,
      enum: ["employee"],
    },
  },
  jobinfo: {
    jobid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobtitle: {
      type: String,
      required: true,
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
});

export const Application = mongoose.model("Application", ApplicationSchema);
