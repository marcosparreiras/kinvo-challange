import {
  Transaction,
  TransactionProps,
} from "../../src/enterprise/transaction";
import { UniqueID } from "../../src/enterprise/value-objects/unique-id";

export function createTransactionFactory(
  overide: Partial<TransactionProps> = {},
  id?: UniqueID
) {
  return Transaction.create(
    {
      userId: new UniqueID(),
      type: "credit",
      value: 100,
      description: "fake transaction",
      ...overide,
    },
    id
  );
}
