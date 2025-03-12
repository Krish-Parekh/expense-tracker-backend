import healthRouter from "@/routes/health.routes";
import { connectDatabase } from "@/utils/database";
import Logger from "@/utils/logger";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(`${process.env.API_V1_PREFIX}`, healthRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		await connectDatabase();
		app.listen(PORT, () => {
			Logger.info(`Server is running on port: ${PORT}`);
		});
	} catch (error) {
		Logger.error("Error starting server: ", error);
		process.exit(1);
	}
}

startServer();

export { app };
