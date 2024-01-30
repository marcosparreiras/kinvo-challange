import {
  Filters,
  TransactionRepository,
} from "../../application/repositories/transaction-repository";
import { Transaction } from "../../enterprise/transaction";
import { UniqueID } from "../../enterprise/value-objects/unique-id";
import { knex } from "../../lib/knex";
import { Transaction as KnexTransaction } from "knex/types/tables";

export class KnexTransactionRepository implements TransactionRepository {
  async create(transaction: Transaction): Promise<void> {
    await knex("transactions").insert({
      id: transaction.id.toString(),
      value: transaction.value,
      description: transaction.description,
      type: transaction.type,
      user_id: transaction.userId.toString(),
      created_at: transaction.createdAt,
    });
  }

  async delete(transaction: Transaction): Promise<void> {
    await knex("transactions").delete().where("id", transaction.id.toString());
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await knex("transactions")
      .select("*")
      .where("id", id)
      .first();
    if (!result) {
      return null;
    }
    return Transaction.create(
      {
        userId: new UniqueID(result.user_id),
        description: result.description,
        type: result.type,
        value: result.value,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
      new UniqueID(result.id)
    );
  }

  async save(transaction: Transaction): Promise<void> {
    await knex("transactions")
      .update({
        value: transaction.value,
        description: transaction.description,
        type: transaction.type,
        created_at: transaction.createdAt,
        updated_at: transaction.updatedAt,
      })
      .where("id", transaction.id.toString());
  }

  async fetchManyByUserId(
    userId: string,
    filters: Filters
  ): Promise<Transaction[]> {
    let result: KnexTransaction[];
    const pageSize = 20;

    if (filters.date) {
      result = await knex("transactions")
        .select("*")
        .where("user_id", userId)
        .whereBetween("created_at", [
          filters.date?.start.toString(),
          filters.date?.end.toString(),
        ])
        .limit(pageSize)
        .offset((filters.page - 1) * pageSize);
    } else {
      result = await knex("transactions")
        .select("*")
        .where("user_id", userId)
        .limit(pageSize)
        .offset((filters.page - 1) * pageSize);
    }

    const transactions = result.map((item) => {
      return Transaction.create(
        {
          userId: new UniqueID(item.user_id),
          description: item.description,
          type: item.type,
          value: item.value,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        },
        new UniqueID(item.id)
      );
    });

    return transactions;
  }

  async getBalanceByUserId(userId: string): Promise<number> {
    const result = await knex("transactions")
      .select("*")
      .where("user_id", userId);
    const balance = result.reduce((acc, cur) => {
      if (cur.type === "credit") {
        return acc + cur.value;
      } else {
        return acc - cur.value;
      }
    }, 0);
    return balance;
  }
}
