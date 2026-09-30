import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../app/app";
import { createTaskRepository } from "../domain/tasks/memory-repository";
import type { TaskRepository } from "../domain/tasks/types";

const testConfig = {
  PORT: 3000,
  NODE_ENV: "test" as const,
  CORS_ORIGIN: "http://localhost:5173",
};

describe("tasks API", () => {
  let repo: TaskRepository;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    repo = createTaskRepository();
    app = createApp(testConfig, { taskRepository: repo });
  });

  it("returns 401 without X-User-Id", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "x" });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("creates a task for the header user", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "From HTTP" });

    expect(res.status).toBe(201);
    expect(res.body.ownerId).toBe("alice");
    expect(res.body.title).toBe("From HTTP");
  });

  it("returns 422 for empty title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "  " });

    expect(res.status).toBe(422);
  });

  it("prevents bob from reading alice's task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Secret" });

    const res = await request(app)
      .get(`/api/tasks/${created.body.id}`)
      .set("X-User-Id", "bob");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("TASK_NOT_FOUND");
  });

  it("completes a task with matching version", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Do it" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .set("X-User-Id", "alice")
      .send({ status: "completed", version: 1 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
    expect(res.body.version).toBe(2);
  });

  it("returns 409 on stale version", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Do it" });

    await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .set("X-User-Id", "alice")
      .send({ status: "completed", version: 1 });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .set("X-User-Id", "alice")
      .send({ title: "Stale", version: 1 });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("TASK_VERSION_CONFLICT");
  });
});
