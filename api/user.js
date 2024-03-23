import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getAll, createOne, getOne, updateOne } from "../utils/handlerFactory.js";
import { getOrCreateUser } from "../controller/user.js";

const router = Router();

router
  .route("/")
  .get(getAll(prisma.user))
  .post(createOne(prisma.user));

router.post("/get-or-create", getOrCreateUser);

router
  .route("/:id")
  .get(getOne(prisma.user))
  .put(updateOne(prisma.user));

export default router;
