import { DEBUG_MODE } from "../config/config.js";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const { ValidationError } = Joi;

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errData = {
    message: "Internal server Error...",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };
  if (err instanceof ValidationError) {
    statusCode = 422;
    errData = {
      mess: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    errData = { mess: err.message };
  }
  return res.status(statusCode).json(errData);
};

export default errorHandler;
