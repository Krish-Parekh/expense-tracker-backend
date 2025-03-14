import { PostgresDataSource } from "@/database";
import { User } from "@/database/schema/user";
import ApiResponse from "@/types/response";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3).max(255),
});

const signupSchema = z.object({
	first_name: z.string().min(3).max(255),
	last_name: z.string().min(3).max(255),
	email: z.string().email(),
	password: z.string().min(3).max(255),
});

const COOKIE_TOKEN_NAME = "token";

const login = async (request: Request, response: Response) => {
	try {
		const parsedData = loginSchema.safeParse(request.body);
		if (!parsedData.success) {
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			response.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}

		const { email, password } = parsedData.data;
		const user = await PostgresDataSource.manager.findOneBy(User, {
			email: email,
		});

		if (!user) {
			response.status(404).json(ApiResponse.error(null, "User not found", 404));
			return;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			response
				.status(401)
				.json(ApiResponse.error(null, "Invalid password", 401));
			return;
		}

		const token = jwt.sign({ id: user.id }, "SECRET", { expiresIn: "1h" });
		response
			.status(200)
			.cookie(COOKIE_TOKEN_NAME, token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				expires: new Date(Date.now() + 3600000),
			})
			.json(ApiResponse.success(null, "Login successful"));
	} catch (error) {
		response
			.status(500)
			.json(ApiResponse.error(null, "Internal server error", 500));
	}
};

const signup = async (request: Request, response: Response) => {
	try {
		const parsedData = signupSchema.safeParse(request.body);
		if (!parsedData.success) {
			const message = parsedData.error.errors
				.map((error) => error.message)
				.join(", ");
			response.status(400).json(ApiResponse.error(null, message, 400));
			return;
		}

		const { first_name, last_name, email, password } = parsedData.data;
		const existingUser = await PostgresDataSource.manager.findOneBy(User, {
			email: email,
		});

		if (existingUser) {
			response
				.status(409)
				.json(ApiResponse.error(null, "User already exists", 409));
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = PostgresDataSource.manager.create(User, {
			firstName: first_name,
			lastName: last_name,
			email: email,
			password: hashedPassword,
		});

		await PostgresDataSource.manager.save(newUser);
		response
			.status(201)
			.json(ApiResponse.success(null, "User created successfully"));
	} catch (error) {
		response
			.status(500)
			.json(ApiResponse.error(null, "Internal server error", 500));
	}
};

export { login, signup };
