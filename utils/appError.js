import { getMessage, Code } from "./statusCode.js";

class AppError extends Error {
  constructor(code) {
    super();
    this.statusCode = code;
    this.isOperational = true;
    this.isApp = true;
    Error.captureStackTrace(this, this.constructor);
  }

  updateError() {
    const message = getMessage(this.statusCode);
    if (message === undefined) {
      this.statusCode = Code.INTERNAL_ERROR.code;
      this.message = Code.INTERNAL_ERROR.message;
    }
    this.message = message;
  }
}

export default AppError;
