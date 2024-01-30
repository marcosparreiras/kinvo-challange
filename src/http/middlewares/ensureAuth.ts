import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../../env";

export function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return response.status(400).json({ message: "Token required" });
    }
    const { id } = jwt.verify(token, env.JWT_SECRET) as { id?: string };
    if (!id) {
      return response.status(400).json({ message: "Token invalid" });
    }
    request.userId = id;
    next();
  } catch (error) {
    next(error);
  }
}
