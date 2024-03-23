global.app_socket = {};
global.app_socket_data = {};
global.client_socket = {};

import { Server } from "socket.io";
import socketClient, { io } from "socket.io-client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const actionEnum = {
  JOIN: 'join',
  LEAVE: 'leave',
  NEW_JOIN: 'new_join',
  SEND_QUESTION: 'send_question',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  QUESTION_TIMEOUT: 'question_timeout',
  QUESTION_ANSWER_ALL: 'question_answer_all',
  QUESTION_START: 'question_start',
  NEW_SUBMIT: 'new_submit',
}

const server_uri = process.env.SERVER_URI || 'http://localhost:5000';

export function init(server) {
  app_socket = new Server(server, { cors: { origin: '*' } });
  client_socket = socketClient(server_uri);

  app_socket.on('connection', (socket) => {
    socket.on("join", async (data) => {
      const { roomId, userId } = data;

      // join room
      const room = "room_" + roomId;
      socket.join(room);
      socket.room = room;
      socket.roomId = parseInt(roomId, 10);
      socket.userId = userId;

      const usersIdInSocket = await app_socket.in(room).fetchSockets();
      const userIds = usersIdInSocket.map((e) => e.userId)

      // emit room new user
      const listUser = await prisma.roomUser.findMany({
        where: {
          roomId: parseInt(roomId, 10),
          userId: {
            in: userIds.concat([userId])
          }
        },
        include: {
          user: true,
        }
      });

      app_socket.to(room).emit(actionEnum.NEW_JOIN, {
        listUser,
        newUserId: userId,
      });
    });

    socket.on(actionEnum.LEAVE, async () => {
      // 
      socket.leaveAll();
    });

    socket.on("disconnect", async () => {
      const { roomId, room, userId } = socket;

      if (!roomId || !room || !userId) return;

      const usersIdInSocket = await app_socket.in(room).fetchSockets();
      const userIds = usersIdInSocket.map((e) => e.userId)

      // emit room new user
      const listUser = await prisma.roomUser.findMany({
        where: {
          roomId: parseInt(roomId, 10),
          userId: {
            in: userIds.filter((e) => e != userId)
          }
        },
        include: {
          user: true,
        }
      });

      app_socket.to(room).emit(actionEnum.NEW_JOIN, {
        listUser,
        newUserId: userId,
      });

      socket.leaveAll();
    });

    socket.on('auto-next-turn', async (data) => {
    })

  });
}
