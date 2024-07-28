import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [30, "Name must be less than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  phone: {
    type: Number,
    required: [true, "Please provide a phone"],
  },
  address: {
    type: String,
    required: [true, "Please provide a address"],
  },
  niches: {
    first: String,
    second: String,
    third: String,
  },

  resume: {
    public_id: String,
    url: String,
  },
  coverletter: {
    type: String,
  },
  role: {
    type: String,
    enum: ["jobseeker", "employee"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", UserSchema);
