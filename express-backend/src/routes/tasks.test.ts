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

  it("lists via query string filters", async () => {
    const parent = await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Parent" });
    await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Child", parentTaskId: parent.body.id });
    await request(app)
      .post("/api/tasks")
      .set("X-User-Id", "alice")
      .send({ title: "Other top" });

    const topLevel = await request(app)
      .get("/api/tasks")
      .query({ parentTaskId: "null", limit: "10" })
      .set("X-User-Id", "alice");

    expect(topLevel.status).toBe(200);
    expect(
      topLevel.body.items.every(
        (t: { parentTaskId: string | null }) => t.parentTaskId === null,
      ),
    ).toBe(true);
    expect(
      topLevel.body.items.some((t: { title: string }) => t.title === "Child"),
    ).toBe(false);

    const children = await request(app)
      .get("/api/tasks")
      .query({ parentTaskId: parent.body.id })
      .set("X-User-Id", "alice");

    expect(children.status).toBe(200);
    expect(children.body.total).toBe(1);
    expect(children.body.items[0].title).toBe("Child");

    const limited = await request(app)
      .get("/api/tasks")
      .query({ status: "todo", limit: "1" })
      .set("X-User-Id", "alice");

    expect(limited.status).toBe(200);
    expect(limited.body.items).toHaveLength(1);
    expect(limited.body.total).toBeGreaterThanOrEqual(1);
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
