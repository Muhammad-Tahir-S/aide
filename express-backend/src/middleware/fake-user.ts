import type { NextFunction, Request, Response } from "express";

export function fakeUser(req: Request, _res: Response, next: NextFunction) {
  const userId = req.header("x-user-id")?.trim();

  if (userId) {
    req.user = { id: userId };
  }
  next();
}
