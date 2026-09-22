import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-errors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }

  const requestId = req.requestId;

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message, requestId } });

    return;
  }

  // eslint-disable-next-line no-console
  console.error({ requestId, err });

  if (
    err instanceof SyntaxError &&
    "status" in err &&
    (err as { status?: number }).status === 400
  ) {
    res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Malformed JSON body",
        requestId,
      },
    });
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      requestId,
    },
  });
}
