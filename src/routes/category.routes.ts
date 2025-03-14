import {
	addCategory,
	deleteCategory,
	getCategories,
	updateCategory,
} from "@/controllers/category.controller";
import { Router } from "express";

const router = Router();

router.post("/", addCategory);
router.put("/", updateCategory);
router.delete("/", deleteCategory);
router.get("/", getCategories);

export default router;
