import { KnexTransactionRepository } from "../../../repositories/knex/knex-transaction-repository";
import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { UpdateTransactionUseCase } from "../update-transaction";

export function makeUpdateTransactionUseCase() {
  const userRepository = new KnexUserRepository();
  const transactionRepository = new KnexTransactionRepository();
  const useCase = new UpdateTransactionUseCase(
    userRepository,
    transactionRepository
  );
  return useCase;
}
