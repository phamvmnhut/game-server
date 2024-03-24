import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import { PrismaClient } from "@prisma/client";
import { Code } from "../utils/statusCode.js";
import { nextGameRoundInSeconds } from "../config/app.js";
import { actionEnum } from "../socket/socket.js";
import { getNextValue } from "../utils/array.js";
import axios from "axios";

const prisma = new PrismaClient();

export const submitGame = catchAsync(async (request, response, next) => {
  const { roomGameId, userId } = request.body;

  const gameExisted = await prisma.roomGame.findFirst({
    where: {
      id: parseInt(roomGameId, 10),
    }
  });
  if (!gameExisted) throw new AppError(Code.NOT_FOUND.code);

  const { gameType, userIdList, dataJson, roomId } = gameExisted;
  const userList = userIdList.split(",").map((e) => parseInt(e, 10));
  const { currentTurn, currentValue, nextTurn, endTurnTime, history, currentRound, numberGuest } = dataJson;
  const room = "room_" + roomId;

  const currentTime = new Date().getTime() / 1000;

  switch (gameType) {
    case 1:
      {
        const { word } = request.body;
        const formattedWord = word;

        // check currentTurn = userId

        if (userId !== currentTurn) {
          throw new AppError(Code.PERMISSION_DENY.code)
        }

        if (currentValue == "") { // word start game
          // not check
        } else { // real round
          // check user word
          // word count = 2
          if (formattedWord.split(" ").length !== 2) {
            throw new AppError(Code.WORD_INVALID.code);
          }
          const lastWord = currentValue.split(" ")[1];
          const firstWord = formattedWord.split(" ")[0];
          if (lastWord != firstWord) {
            throw new AppError(Code.WORD_INVALID.code);
          }

          // check dictionary
          const checkRes = await axios.get(encodeURI("https://vtudien.com/viet-viet/dictionary/nghia-cua-tu-" + formattedWord));
          if (checkRes.data.split(formattedWord).length < 10) {
            throw new AppError(Code.WORD_INVALID.code);
          }
        }

        const updated = await prisma.roomGame.update({
          where: {
            id: parseInt(roomGameId, 10)
          },
          data: {
            dataJson: {
              ...dataJson,
              history: [],
              endTurnTime: currentTime + nextGameRoundInSeconds,
              currentTurn: nextTurn,
              currentValue: formattedWord,
              nextTurn: getNextValue(userList, nextTurn),
              currentRound: currentRound + 1,
            }
          }
        })

        app_socket.to(room).emit(actionEnum.NEW_SUBMIT, {
          ...updated
        });

        setTimeout(async () => {
          const currentGame = await prisma.roomGame.findUnique({
            where: {
              id: parseInt(roomGameId, 10)
            }
          });
          if (!currentGame) return;

          if (currentGame.dataJson.currentRound == currentRound + 1) {
            // time out

            app_socket.to(room).emit("ended", {
              winner: ""
            });

            const updatedStatus2Room = await prisma.room.update({
              where: {
                id: currentGame.roomId
              }, data: {
                status: 1,
              }
            });
          } else {
            return;
          }
        }, nextGameRoundInSeconds);
        break;
      }
    case 2:
      {
        const { number } = request.body;
        let newJsonData = { ...dataJson };
        // round 1 : init data
        if (currentRound == 1) {
          const indexUser = userList.findIndex((e) => e == userId);
          const newNumberGuest = [...numberGuest];
          newNumberGuest[indexUser] = number.toString();
          newJsonData.numberGuest = newNumberGuest

          if (newNumberGuest.every((e) => e !== "0000")) {
            newJsonData.currentRound = 2;
          }
        } else {
          if (userId !== currentTurn) {
            throw new AppError(Code.PERMISSION_DENY.code)
          }
          newJsonData.history = [
            ...history,
            {
              userId: userId,
              value: number.toString(),
              time: currentTime,
            }
          ]
          newJsonData.endTurnTime = currentTime + nextGameRoundInSeconds;
          newJsonData.currentTurn = nextTurn;
          newJsonData.currentValue = number.toString();
          newJsonData.nextTurn = getNextValue(userList, nextTurn);
          newJsonData.currentRound = currentRound + 1;
        }

        const updated = await prisma.roomGame.update({
          where: {
            id: parseInt(roomGameId, 10)
          },
          data: {
            dataJson: newJsonData,
          }
        })

        app_socket.to(room).emit(actionEnum.NEW_SUBMIT, {
          ...updated
        });
        break;
      }
    default:
      break;
  }

  return sendResponse("oke", response);
});