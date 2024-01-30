import { Knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
  }

  interface Transaction {
    id: string;
    value: number;
    description: string;
    type: "credit" | "debt";
    created_at: Date;
    updated_at: Date;
    user_id: string;
  }

  interface Tables {
    users: User;
    transactions: Transaction;
  }
}
