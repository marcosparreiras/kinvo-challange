import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { makeCreateTransactionUseCase } from "../../application/use-cases/factories/create-transaction-factory";
import { InvalidTransactionTypeError } from "../../application/errors/invalid-transaction-type-error";
import { InvalidTransactionValueError } from "../../application/errors/invalid-transaction-value-error";
import { ResourceNotFoundError } from "../../application/errors/resource-not-found-error";
import { makeUpdateTransactionUseCase } from "../../application/use-cases/factories/update-transaction-factory";
import { NotAllowedError } from "../../application/errors/not-allowed-error";
import { makeGetUserBalanceUseCase } from "../../application/use-cases/factories/get-user-balance-factory";
import { makeDeleteTransactionUseCase } from "../../application/use-cases/factories/delete-transaction-factory";
import { makeFetchTransactionsUseCase } from "../../application/use-cases/factories/fetch-transactions-factory";

export class TransactionsControllers {
  async index(request: Request, response: Response, next: NextFunction) {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    });

    try {
      const { page, startDate, endDate } = querySchema.parse(request.query);
      const fetchTransactions = makeFetchTransactionsUseCase();

      let date: {
        startDate?: Date;
        endDate?: Date;
      } = {};

      if (startDate && endDate) {
        date = {
          startDate: new Date(startDate),
          endDate: new Date(startDate),
        };
      }

      const { transactions } = await fetchTransactions.execute({
        userId: request.userId,
        page,
        ...date,
      });
      return response.status(200).json({ transactions });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async balance(request: Request, response: Response, next: NextFunction) {
    try {
      const getBalance = makeGetUserBalanceUseCase();
      const { balance } = await getBalance.execute({ userId: request.userId });
      return response.status(200).json({ balance });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      value: z.coerce.number(),
      description: z.string(),
      type: z.string(),
    });
    try {
      const { value, description, type } = bodySchema.parse(request.body);
      const createTransaction = makeCreateTransactionUseCase();
      const { transaction } = await createTransaction.execute({
        userId: request.userId,
        type,
        value,
        description,
      });
      return response.status(201).json({ id: transaction.id.toString() });
    } catch (error) {
      if (
        error instanceof InvalidTransactionTypeError ||
        error instanceof InvalidTransactionValueError ||
        error instanceof ResourceNotFoundError
      ) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const bodySchema = z.object({
      value: z.coerce.number().optional(),
      description: z.string().optional(),
      type: z.string().optional(),
    });

    try {
      const data = bodySchema.parse(request.body);
      const { id: transactionId } = paramsSchema.parse(request.params);

      const updateTransaction = makeUpdateTransactionUseCase();
      await updateTransaction.execute({
        transactionId,
        userId: request.userId,
        ...data,
      });
      return response.status(204).send();
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof NotAllowedError ||
        error instanceof InvalidTransactionTypeError ||
        error instanceof InvalidTransactionValueError
      ) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.string(),
    });

    try {
      const { id: transactionId } = paramsSchema.parse(request.params);
      const deleteTransaction = makeDeleteTransactionUseCase();
      await deleteTransaction.execute({
        transactionId,
        userId: request.userId,
      });
      return response.status(204).send();
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof NotAllowedError
      ) {
        return response.status(400).json({ message: error.message });
      }
      next(error);
    }
  }
}
