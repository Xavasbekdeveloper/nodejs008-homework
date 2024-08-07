export const ownerMiddleWare = (req, res, next) => {
  if (req?.user?.role !== "owner") {
    return res.status(403).json({
      msg: "You are not owner",
      variant: "error",
      payload: null,
    });
  } else {
    next();
  }
};
