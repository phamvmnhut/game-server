import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { PrismaClient } from "@prisma/client";
import { Code } from "../utils/statusCode.js";
import { nextGameRoundInSeconds } from "../config/app.js";
import { gameAutoEndRound } from "../background/game-auto-end-round.js";

const prisma = new PrismaClient();

export const createRoom = catchAsync(async (request, response, next) => {
  const newRoom = await prisma.room.create({
    data: {
      name: request.body.name,
    }
  });
  await prisma.roomUser.create({
    data: {
      role: 1,
      userId: request.body.userId,
      roomId: newRoom.id,
    }
  })
  return sendResponse(newRoom, response);
});

export const joinRoom = catchAsync(async (request, response, next) => {
  const roomExisted = await prisma.room.findFirst({
    where: {
      id: parseInt(request.body.roomId, 10),
    }
  });
  if (!roomExisted) throw new AppError(Code.NOT_FOUND.code);
  // check room status
  if (roomExisted.status !== 1) {
    throw new AppError(Code.ROOM_STATUS_INVALID.code)
  }

  const joinedRoom = await prisma.roomUser.findFirst({
    where: {
      userId: parseInt(request.body.userId),
      roomId: parseInt(roomExisted.id)
    }
  })
  if (joinedRoom) return sendResponse(joinedRoom, response);
  const newUserJoin = await prisma.roomUser.create({
    data: {
      role: 2,
      userId: parseInt(request.body.userId),
      roomId: roomExisted.id,
    }
  })
  return sendResponse(newUserJoin, response);
});

export const startGame = catchAsync(async (request, response, next) => {
  const roomExisted = await prisma.room.findFirst({
    where: {
      id: parseInt(request.body.roomId, 10),
    }
  });
  if (!roomExisted) throw new AppError(Code.NOT_FOUND.code);

  // check room status
  if (roomExisted.status !== 1) {
    throw new AppError(Code.ROOM_STATUS_INVALID.code)
  }

  const room = "room_" + roomExisted.id;

  const gameType = parseInt(request.body.gameType, 10);

  const currentTime = new Date().getTime() / 1000;

  const roomUserInSocket = request.body.joinedSocket;

  const userIdList = roomUserInSocket.sort(() => 0.5 - Math.random());

  const userList = await prisma.roomUser.findMany({
    where: {
      roomId: roomExisted.id,
      userId: {
        in: userIdList
      }
    },
    include: {
      user: true,
    }
  });

  let gameInitData = {};

  gameInitData.currentTurn = userIdList[0];
  gameInitData.currentValue = "";
  gameInitData.nextTurn = userIdList[1];
  gameInitData.endTurnTime = currentTime + nextGameRoundInSeconds;
  gameInitData.history = [];
  gameInitData.currentRound = 1;

  switch (gameType) {
    case 2:
      gameInitData.numberGuest = userIdList.map(() => "0000");
      break;
  }

  const updatedStatusRoom = await prisma.room.update({
    where: {
      id: roomExisted.id
    }, data: {
      status: 2,
    }
  })

  const newGame = await prisma.roomGame.create({
    data: {
      roomId: roomExisted.id,
      gameType: gameType,
      startTime: currentTime,
      userIdList: userIdList.join(","),
      dataJson: gameInitData,
    }
  });

  app_socket.to(room).emit("play", {
    ...newGame,
    userList: userIdList.map((e) => userList.find((u) => u.userId == e)),
  });

  // job auto end round
  gameAutoEndRound(nextGameRoundInSeconds);

  return sendResponse(newGame, response);
});