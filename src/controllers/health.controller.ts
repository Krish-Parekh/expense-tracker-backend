import ApiResponse from "@/types/response";
import Logger from "@/utils/logger";
import type { Request, Response } from "express";

function health(req: Request, res: Response) {
	try {
		Logger.info(`Health check request received from ${req.ip}`);
		const response = ApiResponse.success(null, "Server is running", 200);
		res.status(response.status).json(response);
	} catch (error) {
		Logger.error(`Health check failed: ${(error as Error).message}`);
		res.status(500).json(ApiResponse.error(null, "Internal Server Error"));
	}
}

export { health };
