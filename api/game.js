import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getAll, getOne, updateOne } from "../utils/handlerFactory.js";
import { submitGame } from "../controller/game.js";

const router = Router();

router
  .route("/")
  .get(getAll(prisma.roomGame, {

  }))

router.put("/:id/submit", submitGame);

router
  .route("/:id")
  .get(getOne(prisma.roomGame, {
  }));

export default router;
