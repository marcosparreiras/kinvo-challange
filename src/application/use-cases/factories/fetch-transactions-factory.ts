import { KnexTransactionRepository } from "../../../repositories/knex/knex-transaction-repository";
import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { FetchTransactionsUseCase } from "../fetch-transactions";

export function makeFetchTransactionsUseCase() {
  const userRepository = new KnexUserRepository();
  const transactionRepository = new KnexTransactionRepository();
  const useCase = new FetchTransactionsUseCase(
    userRepository,
    transactionRepository
  );
  return useCase;
}
