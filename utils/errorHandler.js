/* eslint-disable no-param-reassign */
import { Code } from "./statusCode.js";

const sendErrorDevelopment = (error, response) => {
  response.status(400).json({
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProduction = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    return response.status(400).json({
      status: error.statusCode,
      message: error.message,
    });

    // Programming or other unknown error: don't leak error details
  }
  // 1) log error
  // eslint-disable-next-line no-console
  console.error("[%] ERROR", error);

  // 2) Send generic message to client
  return response.status(400).json({
    statusCode: Code.INTERNAL_ERROR.code,
    message: Code.INTERNAL_ERROR.message,
  });
};

export default (error, request, response, next) => {
  if (error.isApp) {
    error.updateError();
  } else {
    // do anything else
    error.statusCode = error.statusCode || Code.INTERNAL_ERROR.code;
    error.message = error.message || Code.INTERNAL_ERROR.message;
  }
  console.error(error);

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(error, response);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProduction(error, response);
  }
};
