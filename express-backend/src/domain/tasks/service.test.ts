import { beforeEach, describe, expect, it } from "vitest";

import { AppError } from "../../errors/app-errors";
import { createMemoryTaskRepository } from "./memory-repository";
import { taskService } from "./service";

describe("TaskService", () => {
  let taskRepository: ReturnType<typeof createMemoryTaskRepository>;
  let service: ReturnType<typeof taskService>;
  const aliceUser = { id: "alice" };
  const bobUser = { id: "bob" };

  beforeEach(() => {
    taskRepository = createMemoryTaskRepository();
    service = taskService(taskRepository);
  });

  it("creates a top-level task for the actor", async () => {
    const task = await service.create(aliceUser, { title: "Ship service" });

    expect(task.ownerId).toBe("alice");
    expect(task.status).toBe("todo");
    expect(task.version).toBe(1);
    expect(task.parentTaskId).toBeNull();
  });

  it("creates a subtask when parent is owned", async () => {
    const parent = await service.create(aliceUser, { title: "Parent" });
    const child = await service.create(aliceUser, {
      title: "Child",
      parentTaskId: parent.id,
    });

    expect(child.parentTaskId).toBe(parent.id);
  });

  it("rejects subtask under another user's parent", async () => {
    const parent = await service.create(aliceUser, { title: "Alice parent" });

    await expect(
      service.create(bobUser, { title: "Nope", parentTaskId: parent.id }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "TASK_NOT_FOUND",
    });
  });

  it("hides other users' tasks on getById", async () => {
    const task = await service.create(aliceUser, { title: "Secret" });

    await expect(service.getById(bobUser, task.id)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("lists only the actor's tasks", async () => {
    await service.create(aliceUser, { title: "A" });
    await service.create(bobUser, { title: "B" });

    const { items, total } = await service.list(aliceUser, {
      limit: 20,
      offset: 0,
    });

    expect(total).toBe(1);
    expect(items[0]?.title).toBe("A");
  });

  it("updates when version matches", async () => {
    const task = await service.create(aliceUser, { title: "Old" });
    const updated = await service.update(aliceUser, task.id, {
      title: "New",
      version: 1,
    });

    expect(updated.title).toBe("New");
    expect(updated.version).toBe(2);
  });

  it("conflicts on stale version", async () => {
    const task = await service.create(aliceUser, { title: "Old" });
    await service.update(aliceUser, task.id, { title: "New", version: 1 });

    await expect(
      service.update(aliceUser, task.id, { title: "Stale", version: 1 }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "TASK_VERSION_CONFLICT",
    });
  });

  it("deletes an owned task", async () => {
    const task = await service.create(aliceUser, { title: "Gone" });
    await service.delete(aliceUser, task.id);

    await expect(service.getById(aliceUser, task.id)).rejects.toMatchObject({
      code: "TASK_NOT_FOUND",
    });
  });
});
