import cors from "cors";
import express from "express";

import type { Config } from "../config";
import { errorHandler } from "../middleware/error-handler";
import { notFound } from "../middleware/not-found";
import { requestIdSetter } from "../middleware/request-id";

export function createApp(config: Config) {
  const app = express();

  app.use(requestIdSetter);

  app.use(cors({ credentials: true, origin: config.CORS_ORIGIN }));

  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
