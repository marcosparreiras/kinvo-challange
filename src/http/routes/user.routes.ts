import { Router } from "express";
import { UsersControllers } from "../controllers/users.controllers";

const userRoutes = Router();
const usersControllers = new UsersControllers();

userRoutes.post("/", usersControllers.create);
userRoutes.post("/sessions", usersControllers.authenticate);

export default userRoutes;
