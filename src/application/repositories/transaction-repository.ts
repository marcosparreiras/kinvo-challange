import { Transaction } from "../../enterprise/transaction";

export interface Filters {
  page: number;
  date?: {
    start: Date;
    end: Date;
  };
}

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  delete(transaction: Transaction): Promise<void>;
  save(transaction: Transaction): Promise<void>;
  create(transaction: Transaction): Promise<void>;
  fetchManyByUserId(userId: string, filters: Filters): Promise<Transaction[]>;
  getBalanceByUserId(userId: string): Promise<number>;
}
