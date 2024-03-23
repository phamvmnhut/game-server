import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrCreateUser = catchAsync(async (request, response, next) => {
  const userExist = await prisma.user.findFirst({
    where: {
      username: request.body.username,
    },
  });
  if (!userExist) {
    const newUser = await prisma.user.create({
      data: {
        username: request.body.username
      }
    })
    return sendResponse(newUser, response);
  }
  return sendResponse(userExist, response);
});
