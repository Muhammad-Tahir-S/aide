import type z from "zod";

import type { taskSchema, taskStatusSchema } from "./schema";

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
