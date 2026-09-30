import { Router } from "express";

import {
  createTaskSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from "../domain/tasks/schemas";
import type { TaskService } from "../domain/tasks/types";
import { AppError } from "../errors/app-errors";
import { requireUser } from "../middleware/require-user";

export function tasksRouter(tasksService: TaskService) {
  const router = Router();

  router.use(requireUser);

  router.post("/", async (req, res, next) => {
    try {
      const parsed = createTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        next(new AppError(422, "VALIDATION_ERROR", "Invalid request body"));
        return;
      }

      const task = await tasksService.create(req.user!, parsed.data);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const parsed = taskListQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        next(new AppError(422, "VALIDATION_ERROR", "Invalid query"));
        return;
      }

      const tasksList = await tasksService.list(req.user!, parsed.data);
      res.status(200).json(tasksList);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:taskId", async (req, res, next) => {
    try {
      const task = await tasksService.getById(req.user!, req.params.taskId);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:taskId", async (req, res, next) => {
    try {
      const parsedBody = updateTaskSchema.safeParse(req.body);

      if (!parsedBody.success) {
        next(new AppError(422, "VALIDATION_ERROR", "Invalid request body"));
        return;
      }

      const task = await tasksService.update(
        req.user!,
        req.params.taskId,
        parsedBody.data,
      );
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:taskId", async (req, res, next) => {
    try {
      await tasksService.delete(req.user!, req.params.taskId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
