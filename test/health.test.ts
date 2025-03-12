import { app } from "@/index";
import request from "supertest";

describe("GET /api/v1/health", () => {
	it("should return 200 OK", async () => {
		const res = await request(app).get("/api/v1/health");
		expect(res.status).toEqual(200);
	});
});
