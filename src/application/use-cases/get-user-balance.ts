import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";

interface GetUserBalanceUseCaseRequest {
  userId: string;
}

interface GetUserBalanceUseCaseResponse {
  balance: number;
}

export class GetUserBalanceUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
  }: GetUserBalanceUseCaseRequest): Promise<GetUserBalanceUseCaseResponse> {
    const userExists = this.userRepository.findById(userId);
    if (!userExists) {
      throw new ResourceNotFoundError();
    }
    const balance = await this.transactionRepository.getBalanceByUserId(userId);
    return { balance };
  }
}
