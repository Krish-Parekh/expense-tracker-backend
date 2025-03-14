import type { User } from "@/database/schema/user";

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}
