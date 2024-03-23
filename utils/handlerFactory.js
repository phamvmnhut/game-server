import AppError from "./appError.js";

import catchAsync from "./catchAsync.js";
import sendResponse from "./sendResponse.js";
import { Code } from "./statusCode.js";
import queryToPrisma from "./queryToPrisma.js";

export function createOne(Model) {
  return catchAsync(async (request, response, next) => {
    const document = await Model.create({
      data: {
        ...request.body,
      },
    });
    sendResponse(document, response);
  });
}

export function getAll(Model, include) {
  return catchAsync(async (request, response, next) => {
    const { skip, limit, sort, filter } = queryToPrisma(request.query);
    const [total, result] = await Promise.all([
      Model.count({
        where: filter,
      }),
      Model.findMany({
        include,
        skip,
        take: limit,
        where: filter,
        orderBy: sort,
      }),
    ]);

    return sendResponse({ total, returned: result.length, result }, response);
  });
}

export function getOne(Model, include) {
  return catchAsync(async (request, response, next) => {
    const document = await Model.findUnique({
      where: {
        id: parseInt(request.params.id, 10),
      },
      include,
    });

    if (!document) throw new AppError(Code.NOT_FOUND_DOCUMENT.code);

    return sendResponse(document, response);
  });
}

export function updateOne(Model) {
  return catchAsync(async (request, response, next) => {
    const document = await Model.update({
      where: {
        id: parseInt(request.params.id, 10),
      },
      data: {
        ...request.body,
      },
    });

    if (!document) throw new AppError(Code.NOT_FOUND_DOCUMENT.code);

    return sendResponse(document, response);
  });
}

export function deleteOne(Model) {
  return catchAsync(async (request, response, next) => {
    const document = await Model.delete({
      where: {
        id: parseInt(request.params.id, 10),
      },
    });
    if (!document) throw new AppError(Code.NOT_FOUND_DOCUMENT.code);

    // in RESTful API, common practice is not send anything back to client when deleted
    return sendResponse(undefined, response);
  });
}

export function sendArray(value) {
  return (request, response, next) => {
    sendResponse(value, response);
  };
}
