import { Router } from "express";
import { TransactionsControllers } from "../controllers/transactions.controllers";
import { ensureAuth } from "../middlewares/ensureAuth";

const transactionRoutes = Router();
const transactionsControllers = new TransactionsControllers();

transactionRoutes.use(ensureAuth);
transactionRoutes.get("/", transactionsControllers.index);
transactionRoutes.post("/", transactionsControllers.create);
transactionRoutes.get("/balance", transactionsControllers.balance);
transactionRoutes.put("/:id", transactionsControllers.update);
transactionRoutes.delete("/:id", transactionsControllers.delete);

export default transactionRoutes;
