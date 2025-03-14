import { PostgresDataSource } from "@/database";
import { User } from "@/database/schema/user";
import ApiResponse from "@/types/response";
import Logger from "@/utils/logger";
import type { Request, Response } from "express";
import { z } from "zod";

const userSchema = z.object({
	first_name: z.string().min(3).max(255),
	last_name: z.string().min(3).max(255),
	email: z.string().email(),
});

const getUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const user = await PostgresDataSource.manager.findOneBy(User, {
			id: userId,
		});
		if (!user) {
			Logger.warn("User not found with id ", userId);
			res.status(404).json(ApiResponse.error(null, "User not found", 404));
			return;
		}

		Logger.info(`User found with id ${userId}`);
		res.status(200).json(ApiResponse.success(user, "User found", 200));
	} catch (error) {
		Logger.error("Error in getUser controller ", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const parsedData = userSchema.safeParse(req.body);
		if (!parsedData.success) {
			Logger.warn("Request data validation failed in updateUser controller");
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			res.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}

		const user = await PostgresDataSource.manager.findOneBy(User, {
			id: userId,
		});

		if (!user) {
			Logger.warn("User not found with id ", userId);
			res.status(404).json(ApiResponse.error(null, "User not found", 404));
			return;
		}

		const { first_name, last_name, email } = parsedData.data;

		user.firstName = first_name;
		user.lastName = last_name;
		user.email = email;

		await PostgresDataSource.manager.save(User, user);
		Logger.info(`User updated with id ${userId}`);

		res.status(200).json(ApiResponse.success(null, "User updated", 200));
	} catch (error) {
		Logger.error("Error in updateUser controller ", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const user = await PostgresDataSource.manager.findOneBy(User, {
			id: userId,
		});

		if (!user) {
			Logger.warn("User not found with id ", userId);
			res.status(404).json(ApiResponse.error(null, "User not found", 404));
			return;
		}

		await PostgresDataSource.manager.remove(User, user);
		Logger.info(`User deleted with id ${userId}`);
		res.status(200).json(ApiResponse.success(null, "User deleted", 200));
	} catch (error) {
		Logger.error("Error in deleteUser controller ", error);
		res.status(500).json(ApiResponse.error(null, "Internal server error", 500));
	}
};

export { getUser, updateUser, deleteUser };
