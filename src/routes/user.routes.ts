import { deleteUser, getUser, updateUser } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

router.get("/", getUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
