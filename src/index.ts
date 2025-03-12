import { connectDatabase } from "@/database/";
import authRouter from "@/routes/auth.routes";
import healthRouter from "@/routes/health.routes";
import Logger from "@/utils/logger";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${process.env.API_V1_PREFIX}`, healthRouter);
app.use(`${process.env.API_V1_PREFIX}/auth`, authRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
	try {
		if (process.env.NODE_ENV === "test") {
			return;
		}
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
