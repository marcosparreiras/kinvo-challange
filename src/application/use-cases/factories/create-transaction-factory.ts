import { KnexTransactionRepository } from "../../../repositories/knex/knex-transaction-repository";
import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { CreateTransactionUseCase } from "../create-transaction";

export function makeCreateTransactionUseCase() {
  const userRepository = new KnexUserRepository();
  const transactionRepository = new KnexTransactionRepository();
  const useCase = new CreateTransactionUseCase(
    userRepository,
    transactionRepository
  );
  return useCase;
}
