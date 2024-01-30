import { Router } from "express";
import transactionRoutes from "./transactions.routes";
import userRoutes from "./user.routes";

const router = Router();
router.use("/transactions", transactionRoutes);
router.use("/users", userRoutes);

export default router;
