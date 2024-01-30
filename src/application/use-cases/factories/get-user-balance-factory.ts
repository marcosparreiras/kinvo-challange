import { KnexTransactionRepository } from "../../../repositories/knex/knex-transaction-repository";
import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { GetUserBalanceUseCase } from "../get-user-balance";

export function makeGetUserBalanceUseCase() {
  const userRepository = new KnexUserRepository();
  const transactionRepository = new KnexTransactionRepository();
  const useCase = new GetUserBalanceUseCase(
    userRepository,
    transactionRepository
  );
  return useCase;
}
