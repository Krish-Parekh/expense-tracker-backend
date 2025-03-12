import { health } from "@/controllers/health.controller";
import { Router } from "express";

const router = Router();

router.get("/health", health);

export default router;
