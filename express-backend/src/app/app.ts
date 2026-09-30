import cors from "cors";
import express from "express";

import type { Config } from "../config";
import { createTaskRepository } from "../domain/tasks/memory-repository";
import { createTaskService } from "../domain/tasks/service";
import type { TaskRepository } from "../domain/tasks/types";
import { errorHandler } from "../middleware/error-handler";
import { fakeUser } from "../middleware/fake-user";
import { notFound } from "../middleware/not-found";
import { requestIdSetter } from "../middleware/request-id";
import { tasksRouter } from "../routes/tasks";

export type AppDeps = { taskRepository: TaskRepository };
export function createApp(config: Config, deps?: AppDeps) {
  const app = express();

  const tasksRepository = deps?.taskRepository ?? createTaskRepository();
  const tasksService = createTaskService(tasksRepository);

  app.use(requestIdSetter);
  app.use(cors({ credentials: true, origin: config.CORS_ORIGIN }));
  app.use(express.json());
  app.use(fakeUser);

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
  app.use("/api/tasks", tasksRouter(tasksService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
