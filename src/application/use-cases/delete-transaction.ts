import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";

interface DeleteTransactionUseCaseRequest {
  transactionId: string;
  userId: string;
}

interface DeleteTransactionUseCaseResponse {}

export class DeleteTransactionUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    transactionId,
    userId,
  }: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new ResourceNotFoundError();
    }
    const transaction = await this.transactionRepository.findById(
      transactionId
    );
    if (!transaction) {
      throw new ResourceNotFoundError();
    }
    if (transaction.userId.toString() !== userId) {
      throw new NotAllowedError();
    }
    await this.transactionRepository.delete(transaction);
    return {};
  }
}
