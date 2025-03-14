import { PostgresDataSource } from "@/database";
import { Category } from "@/database/schema/category";
import { CategoryType } from "@/database/schema/category";
import ApiResponse from "@/types/response";
import Logger from "@/utils/logger";
import type { Request, Response } from "express";
import { Like } from "typeorm";
import { z } from "zod";

const categorySchema = z.object({
	name: z.string().min(3).max(30),
	description: z.string().min(3).max(255),
});

const updateCategorySchema = z.object({
	...categorySchema.shape,
	id: z.string().uuid(),
});

const deleteCategorySchema = z.object({
	id: z.string().uuid(),
});

const getCategoriesSchema = z.object({
	userId: z.string().uuid(),
	searchQuery: z.string().optional(),
});

const addCategory = async (req: Request, res: Response) => {
	try {
		const parsedData = categorySchema.safeParse(req.body);
		Logger.info(`Received add category request from ip: ${req.ip}`);
		if (!parsedData.success) {
			Logger.warn("Request data validation failed in add category controller");
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			res.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}
		const { name, description } = parsedData.data;
		const userId = req.user.id;
		Logger.info(`Add category request for name: ${name} by user: ${userId}`);
		const newCategory = PostgresDataSource.manager.create(Category, {
			name,
			description,
			type: CategoryType.USER,
			userId,
		});
		await PostgresDataSource.manager.save(newCategory);
		Logger.info(`Category added with name: ${name} for user: ${userId}`);
		res
			.status(201)
			.json(ApiResponse.success(newCategory, "Category added", 201));
	} catch (error) {
		Logger.error("Error in add category controller", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};
const updateCategory = async (req: Request, res: Response) => {
	try {
		const parsedData = updateCategorySchema.safeParse(req.body);
		Logger.info(`Received update category request from ip: ${req.ip}`);
		if (!parsedData.success) {
			Logger.warn(
				"Request data validation failed in update category controller",
			);
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			res.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}
		const { id, name, description } = parsedData.data;
		const userId = req.user.id;
		Logger.info(`Update category request for id: ${id} by user: ${userId}`);
		const category = await PostgresDataSource.manager.findOneBy(Category, {
			id,
			user: { id: userId },
			type: CategoryType.USER,
		});
		if (!category) {
			Logger.warn(`Category not found with id: ${id}`);
			res.status(404).json(ApiResponse.error(null, "Category not found", 404));
			return;
		}
		category.name = name;
		category.description = description;
		await PostgresDataSource.manager.save(category);
		Logger.info(`Category updated with id: ${id} for user: ${userId}`);
		res
			.status(200)
			.json(ApiResponse.success(category, "Category updated", 200));
	} catch (error) {
		Logger.error("Error in update category controller", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

const deleteCategory = async (req: Request, res: Response) => {
	try {
		const parsedData = deleteCategorySchema.safeParse(req.body);
		Logger.info(`Received delete category request from ip: ${req.ip}`);

		if (!parsedData.success) {
			Logger.warn(
				"Request data validation failed in delete category controller",
			);
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			res.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}

		const { id } = parsedData.data;
		const userId = req.user.id;
		Logger.info(`Delete category request for id: ${id} by user: ${userId}`);

		const category = await PostgresDataSource.manager.findOneBy(Category, {
			id,
			user: { id: userId },
			type: CategoryType.USER,
		});

		if (!category) {
			Logger.warn(`Category not found with id: ${id}`);
			res.status(404).json(ApiResponse.error(null, "Category not found", 404));
			return;
		}

		await PostgresDataSource.manager.delete(Category, id);
		Logger.info(`Category deleted with id: ${id} for user: ${userId}`);
		res.status(200).json(ApiResponse.success(null, "Category deleted", 200));
	} catch (error) {
		Logger.error("Error in delete category controller", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

const getCategories = async (req: Request, res: Response) => {
	try {
		const parsedData = getCategoriesSchema.safeParse(req.params);
		Logger.info(`Received get categories request from ip: ${req.ip}`);
		if (!parsedData.success) {
			Logger.warn(
				"Request data validation failed in get categories controller",
			);
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			res.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}
		const { userId, searchQuery } = parsedData.data;
		Logger.info(`Get categories request for user: ${userId}`);
		const categories = await PostgresDataSource.manager.find(Category, {
			where: [
				{ user: { id: userId } },
				{ type: CategoryType.SYSTEM },
				{ name: Like(`%${searchQuery}%`) },
				{ description: Like(`%${searchQuery}%`) },
			],
		});
		Logger.info(`Categories fetched for user: ${userId}`);
		res
			.status(200)
			.json(ApiResponse.success(categories, "Categories fetched", 200));
	} catch (error) {
		Logger.error("Error in get categories controller", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

export { addCategory, updateCategory, deleteCategory, getCategories };
