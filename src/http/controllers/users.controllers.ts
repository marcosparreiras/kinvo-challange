import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { makeCreateUserUseCase } from "../../application/use-cases/factories/create-user-factory";
import { EmailAlreadyInUseError } from "../../application/errors/email-already-in-use-error";
import { ShortPasswordError } from "../../application/errors/short-password-error";
import { makeAuthenticateUserUseCase } from "../../application/use-cases/factories/authenticate-user-factory";
import { InvalidCredentialsError } from "../../application/errors/invalid-credentials-error";
import env from "../../env";

export class UsersControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    });
    try {
      const { name, email, password } = bodySchema.parse(request.body);
      const createUser = makeCreateUserUseCase();
      await createUser.execute({ name, email, password });
      return response.status(201).send();
    } catch (error) {
      if (
        error instanceof EmailAlreadyInUseError ||
        error instanceof ShortPasswordError
      ) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async authenticate(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    try {
      const { email, password } = bodySchema.parse(request.body);
      const authenticateUser = makeAuthenticateUserUseCase();
      const { user } = await authenticateUser.execute({ email, password });
      const token = jwt.sign({ id: user.id.toString() }, env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return response.status(201).json({ token });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
}
