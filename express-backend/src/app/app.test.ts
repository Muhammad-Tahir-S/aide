import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "./app";

describe("GET /health", () => {
  it('returns 200 and { status: "ok" } as JSON', async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch("json");
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("unknown routes", () => {
  it("returns JSON 404 with error envelope and request id", async () => {
    const res = await request(app).get("/wrong-route");
    const requestId = res.headers["x-request-id"];

    expect(res.status).toBe(404);
    expect(requestId).toBeTruthy();
    expect(res.headers["content-type"]).toMatch("json");
    expect(res.body).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
        requestId,
      },
    });
  });

  it("honors an incoming X-Request-Id", async () => {
    const res = await request(app)
      .get("/nope")
      .set("X-Request-Id", "test-id-123");
    expect(res.headers["x-request-id"]).toBe("test-id-123");
    expect(res.body.error.requestId).toBe("test-id-123");
  });
});
