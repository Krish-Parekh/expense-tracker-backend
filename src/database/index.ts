import { Category } from "@/database/schema/category";
import { Expense } from "@/database/schema/expense";
import { User } from "@/database/schema/user";
import Logger from "@/utils/logger";
import { DataSource } from "typeorm";

const PostgresDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, Expense, Category],
	synchronize: true,
	logging: true,
});

async function connectDatabase() {
	try {
		await PostgresDataSource.initialize();
		Logger.info("Database connected successfully");
	} catch (error) {
		Logger.error("Error connecting to the database: ", error);
	}
}

export { connectDatabase, PostgresDataSource };
