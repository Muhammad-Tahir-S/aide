import { randomUUID } from "node:crypto";

import { beforeEach, describe, expect, it } from "vitest";

import { createMemoryTaskRepository } from "./memory-repository";
import type { Task } from "./types";

function makeTask(overrides: Partial<Task> = {}): Task {
  const now = "2026-01-01T00:00:00.000Z";
  return {
    id: randomUUID(),
    ownerId: "user-a",
    title: "Task",
    status: "todo",
    parentTaskId: null,
    position: 0,
    version: 1,
    createdAt: now,
    updatedAt: now,
    dueDate: null,
    ...overrides,
  };
}

describe("createMemoryTaskRepository", () => {
  const repo = createMemoryTaskRepository();

  beforeEach(() => {
    repo.clear();
  });

  it("creates and finds by id", async () => {
    const task = makeTask({ title: "Write schemas" });
    await repo.create(task);

    const found = await repo.findById(task.id);
    expect(found).toEqual(task);
  });

  it("returns null for missing id", async () => {
    expect(await repo.findById("missing")).toBeNull();
  });

  it("lists only the owner's tasks", async () => {
    await repo.create(makeTask({ ownerId: "user-a", title: "A" }));
    await repo.create(makeTask({ ownerId: "user-b", title: "B" }));

    const { items, total } = await repo.list({
      ownerId: "user-a",
      limit: 20,
      offset: 0,
    });

    expect(total).toBe(1);
    expect(items.map((t) => t.title)).toEqual(["A"]);
  });

  it("filters top-level with parentTaskId: null", async () => {
    const parent = makeTask({ title: "Parent", position: 0 });
    await repo.create(parent);
    await repo.create(
      makeTask({
        title: "Child",
        parentTaskId: parent.id,
        position: 0,
      }),
    );

    const { items } = await repo.list({
      ownerId: "user-a",
      parentTaskId: null,
      limit: 20,
      offset: 0,
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Parent");
  });

  it("updates a task", async () => {
    const task = makeTask({ title: "Old" });
    await repo.create(task);

    const updated = await repo.update({
      ...task,
      title: "New",
      version: 2,
      updatedAt: "2026-01-02T00:00:00.000Z",
    });

    expect(updated.title).toBe("New");
    expect(await repo.findById(task.id)).toEqual(updated);
  });

  it("deleteById returns false when missing", async () => {
    expect(await repo.deleteById("nope")).toBe(false);
  });

  it("isolates mutations from stored data", async () => {
    const task = makeTask({ title: "Safe" });
    await repo.create(task);

    const found = await repo.findById(task.id);
    found!.title = "Mutated";

    const again = await repo.findById(task.id);
    expect(again?.title).toBe("Safe");
  });
});
