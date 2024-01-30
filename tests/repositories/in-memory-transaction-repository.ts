import dayjs from "dayjs";

import { Transaction } from "../../src/enterprise/transaction";
import {
  Filters,
  TransactionRepository,
} from "../../src/application/repositories/transaction-repository";

export class InMemoryTransactionRepository implements TransactionRepository {
  public items: Transaction[] = [];

  async findById(id: string) {
    const transaction = this.items.find((item) => item.id.toString() === id);
    return transaction ?? null;
  }

  async save(transaction: Transaction) {
    const index = this.items.findIndex((item) =>
      item.id.compere(transaction.id)
    );
    this.items[index] = transaction;
  }

  async delete(transaction: Transaction) {
    const index = this.items.findIndex((item) =>
      item.id.compere(transaction.id)
    );
    this.items.splice(index, 1);
  }

  async create(transaction: Transaction) {
    this.items.push(transaction);
  }

  async getBalanceByUserId(userId: string) {
    const balance = this.items
      .filter((item) => item.userId.toString() === userId)
      .reduce((acc, cur) => {
        if (cur.type === "credit") {
          return acc + cur.value;
        } else {
          return acc - cur.value;
        }
      }, 0);
    return balance;
  }

  async fetchManyByUserId(userId: string, filters: Filters) {
    let transactions: Transaction[];

    if (filters.date) {
      transactions = this.items.filter(
        (item) =>
          item.userId.toString() === userId &&
          dayjs(item.createdAt).isAfter(dayjs(filters.date?.start)) &&
          dayjs(item.createdAt).isBefore(dayjs(filters.date?.end))
      );
    } else {
      transactions = this.items.filter(
        (item) => item.userId.toString() === userId
      );
    }

    return transactions.slice((filters.page - 1) * 20, filters.page * 20);
  }
}
