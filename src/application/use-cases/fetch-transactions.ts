import { Transaction } from "../../enterprise/transaction";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import {
  Filters,
  TransactionRepository,
} from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";

interface FetchTransactionsUseCaseRequest {
  userId: string;
  page: number;
  startDate?: Date;
  endDate?: Date;
}

interface FetchTransactionsUseCaseResponse {
  transactions: Transaction[];
}

export class FetchTransactionsUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
    page,
    endDate,
    startDate,
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new ResourceNotFoundError();
    }

    let filters: Filters = { page };
    if (startDate && endDate) {
      filters.date = {
        start: startDate,
        end: endDate,
      };
    }

    const transactions = await this.transactionRepository.fetchManyByUserId(
      userId,
      filters
    );

    return { transactions };
  }
}
