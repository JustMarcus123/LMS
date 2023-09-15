import { NextFunction } from "express";

const ErrorHandler = require("../utils/ErrorHandler");

 export const ErrorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `resource not found. invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key error

  if (err.code === 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error wrong token

  if (err.name === "jsonWebTokenError") {
    const message = `json web token is invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }

  //jwt expired error

  if (err.name === "TokenExpiredError") {
    const message = `json web token expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
