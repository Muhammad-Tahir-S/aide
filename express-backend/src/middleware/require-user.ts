import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-errors";

export function requireUser(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
    return;
  }
  next();
}
