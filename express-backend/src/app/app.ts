import express from "express";

import { errorHandler } from "../middleware/error-handler";
import { notFound } from "../middleware/not-found";
import { requestIdSetter } from "../middleware/request-id";

const app = express();

app.use(requestIdSetter);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

export { app };
