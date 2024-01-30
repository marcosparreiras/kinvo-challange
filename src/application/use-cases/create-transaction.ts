import { Transaction } from "../../enterprise/transaction";
import { UniqueID } from "../../enterprise/value-objects/unique-id";
import { InvalidTransactionTypeError } from "../errors/invalid-transaction-type-error";
import { InvalidTransactionValueError } from "../errors/invalid-transaction-value-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { TransactionRepository } from "../repositories/transaction-repository";
import { UserRepository } from "../repositories/user-repository";

interface CreateTransactionUseCaseRequest {
  userId: string;
  value: number;
  description: string;
  type: string;
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction;
}

export class CreateTransactionUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async execute({
    userId,
    type,
    value,
    description,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const userExist = await this.userRepository.findById(userId);
    if (!userExist) {
      throw new ResourceNotFoundError();
    }

    if (!(type === "credit" || type === "debt")) {
      throw new InvalidTransactionTypeError();
    }

    if (value < 0) {
      throw new InvalidTransactionValueError();
    }

    const transaction = Transaction.create({
      userId: new UniqueID(userId),
      type,
      value,
      description,
    });

    await this.transactionRepository.create(transaction);

    return { transaction };
  }
}
