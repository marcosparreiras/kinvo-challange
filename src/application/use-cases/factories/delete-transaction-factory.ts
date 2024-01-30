import { KnexTransactionRepository } from "../../../repositories/knex/knex-transaction-repository";
import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { DeleteTransactionUseCase } from "../delete-transaction";

export function makeDeleteTransactionUseCase() {
  const userRepository = new KnexUserRepository();
  const transactionRepository = new KnexTransactionRepository();
  const useCase = new DeleteTransactionUseCase(
    userRepository,
    transactionRepository
  );
  return useCase;
}
