export const sendToken = (user, message, res, status) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, options);
  return res.status(status).cookie("token", token, options).json({
    success: true,
    status: status,
    message: message,
    user,
    token,
  });
};
