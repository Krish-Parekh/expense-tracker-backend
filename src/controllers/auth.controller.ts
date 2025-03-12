import { PostgresDataSource } from "@/database";
import { User } from "@/database/schema/user";
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

const login = async (request: Request, response: Response) => {
	try {
		const parsedData = loginSchema.safeParse(request.body);
		if (!parsedData.success) {
			response.status(400).json({ error: parsedData.error.errors });
			return;
		}

		const { email, password } = parsedData.data;
		const user = await PostgresDataSource.manager.findOneBy(User, {
			email: email,
		});

		if (!user) {
			response.status(404).json({ error: "User not found" });
			return;
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			response.status(401).json({ error: "Invalid password" });
			return;
		}

		const token = jwt.sign({ id: user.id }, "SECRET", { expiresIn: "1h" });
		response.status(200).json({ token });
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

const signup = async (request: Request, response: Response) => {
	try {
		const parsedData = signupSchema.safeParse(request.body);
		if (!parsedData.success) {
			response.status(400).json({ error: parsedData.error.errors });
			return;
		}

		const { first_name, last_name, email, password } = parsedData.data;
		const existingUser = await PostgresDataSource.manager.findOneBy(User, {
			email: email,
		});

		if (existingUser) {
			response.status(409).json({ error: "User already exists" });
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
		response.status(201).json({ message: "User created" });
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
};

export { login, signup };
