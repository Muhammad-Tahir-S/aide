import { randomUUID } from "node:crypto";

import { AppError } from "../../errors/app-errors";
import type { Actor } from "../auth/types";
import type { createMemoryTaskRepository } from "./memory-repository";
import type {
  CreateTaskInput,
  Task,
  TaskListQuery,
  UpdateTaskInput,
} from "./types";

export function taskService(
  taskRepository: ReturnType<typeof createMemoryTaskRepository>,
) {
  async function requireOwnedTask(actor: Actor, taskId: string): Promise<Task> {
    const task = await taskRepository.findById(taskId);

    if (!task || task.ownerId !== actor.id) {
      throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
    }

    return task;
  }

  return {
    create: async (actor: Actor, input: CreateTaskInput): Promise<Task> => {
      const parentTaskId = input.parentTaskId ?? null;
      if (parentTaskId !== null) {
        await requireOwnedTask(actor, parentTaskId);
      }

      const now = new Date().toISOString();
      const task: Task = {
        id: randomUUID(),
        ownerId: actor.id,
        status: "todo",
        title: input.title,
        parentTaskId,
        position: input.position ?? 0,
        version: 1,
        createdAt: now,
        updatedAt: now,
        dueDate: input.dueDate ?? null,
      };
      return taskRepository.create(task);
    },

    getById: async (actor: Actor, taskId: string) => {
      return await requireOwnedTask(actor, taskId);
    },

    list: async (actor: Actor, query: TaskListQuery) => {
      return await taskRepository.list({ ...query, ownerId: actor.id });
    },

    update: async (actor: Actor, taskId: string, input: UpdateTaskInput) => {
      const existingTask = await requireOwnedTask(actor, taskId);

      if (input.version !== existingTask.version) {
        throw new AppError(
          409,
          "TASK_VERSION_CONFLICT",
          "Task has been modified; reload and retry",
        );
      }

      const now = new Date().toISOString();
      const updatedTask: Task = {
        ...existingTask,
        title: input.title ?? existingTask.title,
        status: input.status ?? existingTask.status,
        position: input.position ?? existingTask.position,
        dueDate:
          input.dueDate !== undefined ? input.dueDate : existingTask.dueDate,
        version: existingTask.version + 1,
        updatedAt: now,
      };

      return await taskRepository.update(updatedTask);
    },

    delete: async (actor: Actor, taskId: string) => {
      await requireOwnedTask(actor, taskId);
      await taskRepository.deleteById(taskId);
    },
  };
}
