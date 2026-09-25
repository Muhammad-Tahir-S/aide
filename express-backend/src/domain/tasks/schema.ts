import z from "zod";

export const taskStatusSchema = z.enum(["todo", "in-progress", "completed"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  status: taskStatusSchema,
  parentTaskId: z.string().min(1).nullable(),
  position: z.number().int().nonnegative(),
  version: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  dueDate: z.iso.datetime().nullable(),
});
export type Task = z.infer<typeof taskSchema>;

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  parentTaskId: z.string().min(1).nullable().optional(),
  position: z.number().int().nonnegative().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    status: taskStatusSchema.optional(),
    version: z.number().int().positive(),
    position: z.number().int().nonnegative().optional(),
    dueDate: z.iso.datetime().nullable().optional(),
  })
  .refine(
    (body) =>
      body.title !== undefined ||
      body.status !== undefined ||
      body.position !== undefined ||
      body.dueDate !== undefined,
    {
      error: "At least one of title, status, dueDate, or position is required",
    },
  );
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskListQuerySchema = z.object({
  parentTaskId: z.string().min(1).nullable().optional(),
  status: taskStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
