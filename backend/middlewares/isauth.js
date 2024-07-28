import jwt from "jsonwebtoken";
import { User } from "../models/UserSchema.js";
import { trycatchasyncerror } from "./trycatchasyncerror.js";

export const isauth = trycatchasyncerror(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new Error("Not authorized", 400));

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decode.id);

  next();
});
