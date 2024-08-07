export const adminMiddleWare = (req, res, next) => {
  if (req?.user?.role !== "admin" || req?.user?.role !== "owner") {
    return res.status(403).json({
      msg: "Access denied",
      variant: "error",
      payload: null,
    });
  } else {
    next();
  }
};
