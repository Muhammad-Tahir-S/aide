import type { Task, TaskRepository } from "./types";

export function createMemoryTaskRepository(): TaskRepository & {
  //test helper, so declared inline here
  clear: VoidFunction;
} {
  const tasksMap = new Map<string, Task>();

  return {
    create: async (task) => {
      const taskExists = tasksMap.has(task.id);
      if (taskExists) {
        throw new Error(`Task already exists: ${task.id}`);
      }

      const taskCopy = structuredClone(task);
      tasksMap.set(task.id, taskCopy);
      return structuredClone(taskCopy);
    },

    findById: async (id) => {
      const foundTask = tasksMap.get(id);
      return foundTask ? structuredClone(foundTask) : null;
    },

    list: async (filter) => {
      let rows = [...tasksMap.values()].filter(
        (t) => t.ownerId === filter.ownerId,
      );
      if (filter.parentTaskId !== undefined) {
        rows = rows.filter((t) => t.parentTaskId === filter.parentTaskId);
      }
      if (filter.status !== undefined) {
        rows = rows.filter((t) => t.status === filter.status);
      }
      rows.sort(
        (a, b) =>
          a.position - b.position || a.createdAt.localeCompare(b.createdAt),
      );
      const total = rows.length;
      const items = rows
        .slice(filter.offset, filter.offset + filter.limit)
        .map((t) => structuredClone(t));
      return { items, total };
    },

    update: async (task: Task) => {
      if (!tasksMap.has(task.id)) {
        throw new Error(`Task not found: ${task.id}`);
      }
      const copy = structuredClone(task);
      tasksMap.set(task.id, copy);
      return structuredClone(copy);
    },

    deleteById: async (id) => {
      return tasksMap.delete(id);
    },

    clear: () => tasksMap.clear(),
  };
}
