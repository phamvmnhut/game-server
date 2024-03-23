import { Code } from "./statusCode.js";

export default (data, response) => {
  response.status(200).json({
    statusCode: Code.OKE.code,
    message: Code.OKE.message,
    data,
  });
};
