import { Router } from "express";

import userApi from "./user.js";
import roomApi from "./room.js"
import gameApi from "./game.js";

const router = Router();

router.use("/user", userApi);
router.use("/room", roomApi);
router.use("/game", gameApi)

export default router;
