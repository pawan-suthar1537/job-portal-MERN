import Errorhandle from "../middlewares/error.js";
import { trycatchasyncerror } from "../middlewares/trycatchasyncerror.js";
import { User } from "../models/UserSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwt.js";

//! register user
export const register = trycatchasyncerror(async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      first,
      second,
      third,
      resume,
      coverletter,
      role,
    } = req.body;

    if (!name) return next(new Errorhandle("Name is required", 400));
    if (!email) return next(new Errorhandle("Email is required", 400));
    if (!phone) return next(new Errorhandle("Phone number is required", 400));
    if (!address) return next(new Errorhandle("Address is required", 400));
    if (!role) return next(new Errorhandle("Role is required", 400));
    if (!password) return next(new Errorhandle("Password is required", 400));

    if (role === "jobseeker" && (!first || !second || !third)) {
      return next(
        new Errorhandle(
          "Please provide all niches (first, second, and third)",
          400
        )
      );
    }

    const isexist = await User.findOne({ email });
    if (isexist) {
      return next(new Errorhandle(`User already exist with ${email} `, 400));
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      niches: {
        first,
        second,
        third,
      },
      role,
    });

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      try {
        const uploading = await cloudinary.uploader.upload(
          resume.tempFilePath,
          {
            folder: "JobPortalMERN_resume",
            public_id: `${user.email}-resume`,
            use_filename: true,
          }
        );

        // console.log(uploading);

        user.resume.public_id = uploading.public_id;
        user.resume.url = uploading.secure_url;
      } catch (error) {
        // console.log(error);
        return next(
          new Errorhandle(`Failed to upload resume: ${error.message}`, 400)
        );
      }
    }

    const createdUser = await user.save();
    sendToken(createdUser, "User registered successfully", res, 201);
  } catch (error) {
    return next(new Errorhandle(`Registration error: ${error.message}`, 400));
  }
});
//! login user
export const login = trycatchasyncerror(async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email) return next(new Errorhandle("Email is required", 400));
    if (!password) return next(new Errorhandle("Password is required", 400));
    if (!role) return next(new Errorhandle("Role is required", 400));

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new Errorhandle("User not found", 400));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new Errorhandle("Invalid password", 400));

    sendToken(user, "User logged in successfully", res, 200);
  } catch (error) {
    return next(new Errorhandle(`Login error: ${error.message}`, 400));
  }
});
//! logout user
export const logout = trycatchasyncerror(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

//! get login user details

export const getLoginUserDetails = trycatchasyncerror(
  async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return next(new Errorhandle("User not found", 400));

      res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user,
      });
    } catch (error) {
      return next(new Errorhandle(`Login error: ${error.message}`, 400));
    }
  }
);

//! update user details
export const updateuserdetails = trycatchasyncerror(async (req, res, next) => {
  const { name, email, phone, address, first, second, third, coverletter } =
    req.body;
  const newuserdata = {};

  if (name) newuserdata.name = name;
  if (email) newuserdata.email = email;
  if (phone) newuserdata.phone = phone;
  if (address) newuserdata.address = address;
  if (coverletter) newuserdata.coverletter = coverletter;
  if (first || second || third) {
    newuserdata.niches = {
      first,
      second,
      third,
    };

    if (req.user.role === "jobseeker" && (!first || !second || !third)) {
      return next(
        new Errorhandle(
          "Please provide all niches (first, second, and third)",
          400
        )
      );
    }
  }

  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      if (req.user.resume && req.user.resume.public_id) {
        await cloudinary.uploader.destroy(req.user.resume.public_id);
      }

      const newresume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "JobPortalMERN_resume",
        public_id: `${req.user.email}-resume`,
        use_filename: true,
      });

      newuserdata.resume = {
        public_id: newresume.public_id,
        url: newresume.secure_url,
      };
    } catch (error) {
      return next(
        new Errorhandle(`Failed to upload resume: ${error.message}`, 400)
      );
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    user,
  });
});

//! update password

export const updatepassword = trycatchasyncerror(async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
      return next(
        new Errorhandle("Please provide both old and new passwords", 400)
      );
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new Errorhandle("User not found", 404));
    }

    const ispassmatch = await user.matchPassword(oldpassword);

    if (!ispassmatch) {
      return next(new Errorhandle("Invalid old password", 400));
    }

    user.password = newpassword;
    await user.save();

    sendToken(user, "Password updated successfully", res, 200);
  } catch (error) {
    return next(
      new Errorhandle(`Password update error: ${error.message}`, 400)
    );
  }
});
