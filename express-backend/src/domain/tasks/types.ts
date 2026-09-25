import type z from "zod";

import type {
  createTaskSchema,
  taskListQuerySchema,
  taskSchema,
  updateTaskSchema,
} from "./schemas";

//schema types
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

//repository types
export type TaskListFilter = TaskListQuery & Pick<Task, "ownerId">;
export type TaskListResult = { items: Task[]; total: number };
export interface TaskRepository {
  create: (task: Task) => Promise<Task>;
  findById: (id: string) => Promise<Task | null>;
  list: (filter: TaskListFilter) => Promise<TaskListResult>;
  update: (task: Task) => Promise<Task>;
  deleteById: (id: string) => Promise<boolean>;
}
