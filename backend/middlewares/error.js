class Errorhandle extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "Internal Server Error";
  return res.status(err.status).json({
    success: false,
    status: err.status,
    err: err.message,
  });
};

export default Errorhandle;
