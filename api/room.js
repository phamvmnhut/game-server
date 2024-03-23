import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getAll, getOne, updateOne } from "../utils/handlerFactory.js";
import { createRoom, joinRoom, startGame } from "../controller/room.js";

const router = Router();

router
  .route("/")
  .get(getAll(prisma.room, {
    RoomUser: {
      include: {
        user: true,
      }
    },
  }))
  .post(createRoom);

router.put("/:id/join", joinRoom);
router.put("/:id/start", startGame);

router
  .route("/:id")
  .get(getOne(prisma.room, {
    RoomUser: {
      include: {
        user: true,
      }
    },
    RoomGame: true,
  }))
  .put(updateOne(prisma.room));

export default router;
