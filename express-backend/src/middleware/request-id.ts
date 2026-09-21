import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestIdSetter(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incomingRequestId = req.header("x-request-id");
  const activeRequestId =
    incomingRequestId && incomingRequestId.trim() !== ""
      ? incomingRequestId
      : randomUUID();

  req.requestId = activeRequestId;
  res.setHeader("X-Request-Id", activeRequestId);
  next();
}
