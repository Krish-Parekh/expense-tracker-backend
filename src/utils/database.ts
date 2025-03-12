import Logger from "@/utils/logger";
import { DataSource } from "typeorm";

const ApplicationDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: true,
	logging: true,
});

async function connectDatabase() {
	try {
		await ApplicationDataSource.initialize();
		Logger.info("Database connected successfully");
	} catch (error) {
		Logger.error("Error connecting to the database: ", error);
	}
}

export { connectDatabase };
