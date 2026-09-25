import z from "zod";

export const taskStatusSchema = z.enum(["todo", "in-progress", "completed"]);

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
  deadline: z.iso.datetime().nullable(),
});
