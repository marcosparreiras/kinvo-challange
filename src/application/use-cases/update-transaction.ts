import { Transaction } from "../../enterprise/transaction";
import { InvalidTransactionTypeError } from "../errors/invalid-transaction-type-error";
import { InvalidTransactionValueError } from "../errors/invalid-transaction-value-error";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";

interface UpdateTransactionUseCaseRequest {
  userId: string;
  transactionId: string;
  value?: number;
  description?: string;
  type?: string;
}

interface UpdateTransactionUseCaseResponse {
  transaction: Transaction;
}

export class UpdateTransactionUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    transactionId,
    userId,
    description,
    type,
    value,
  }: UpdateTransactionUseCaseRequest): Promise<UpdateTransactionUseCaseResponse> {
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
    if (value && value < 0) {
      throw new InvalidTransactionValueError();
    }
    if (type && type !== "credit" && type !== "debt") {
      throw new InvalidTransactionTypeError();
    }

    transaction.value = value ?? transaction.value;
    transaction.description = description ?? transaction.description;
    transaction.type = <"credit" | "debt">type ?? transaction.type;
    await this.transactionRepository.save(transaction);
    return { transaction };
  }
}
