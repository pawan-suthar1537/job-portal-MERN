import express, { response } from "express";
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobtype: {
    type: String,
    required: true,
    enum: ["fulltime", "parttime", "internship"],
  },
  location: {
    type: String,
    required: true,
  },

  companyname: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  responsibility: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  offers: {
    type: String,
    // required:true
  },
  salary: {
    type: String,
    required: true,
  },
  hiringmultiple: {
    type: String,
    default: "No",
    enum: ["Yes", "No"],
  },
  website: {
    title: String,
    url: String,
  },
  jobniches: {
    type: String,
    required: true,
  },
  newsletter: {
    type: Boolean,
  },
  jobposted: {
    type: Date,
    default: Date.now,
  },
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", JobSchema);
