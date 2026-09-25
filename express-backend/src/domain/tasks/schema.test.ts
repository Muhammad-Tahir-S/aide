import { describe, expect, it } from "vitest";

import { createTaskSchema, taskSchema, updateTaskSchema } from "./schema";

describe("createTaskSchema", () => {
  it("accepts a title-only create", () => {
    const result = createTaskSchema.safeParse({ title: "Learn Zod" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createTaskSchema.safeParse({ title: "  " });
    expect(result.success).toBe(false);
  });

  it("strips unknown client fields like ownerId", () => {
    const result = createTaskSchema.safeParse({
      title: "x",
      ownerId: "hacker",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: "x" });
      expect("ownerId" in result.data).toBe(false);
    }
  });
});

describe("updateTaskSchema", () => {
  it("requires version", () => {
    const result = updateTaskSchema.safeParse({ status: "done" });
    expect(result.success).toBe(false);
  });

  it("rejects version-only patch", () => {
    const result = updateTaskSchema.safeParse({ version: 1 });
    expect(result.success).toBe(false);
  });

  it("accepts status + version", () => {
    const result = updateTaskSchema.safeParse({
      status: "completed",
      version: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("taskSchema", () => {
  it("accepts a full entity", () => {
    const result = taskSchema.safeParse({
      id: "t1",
      ownerId: "u1",
      title: "Parent",
      status: "todo",
      parentTaskId: null,
      position: 0,
      version: 1,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      dueDate: null,
    });
    expect(result.success).toBe(true);
  });
});
