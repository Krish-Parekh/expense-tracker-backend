import { login, signup } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/register", signup);

export default router;
