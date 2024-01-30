import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryTransactionRepository } from "../../../tests/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { InvalidTransactionTypeError } from "../errors/invalid-transaction-type-error";
import { InvalidTransactionValueError } from "../errors/invalid-transaction-value-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { CreateTransactionUseCase } from "./create-transaction";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryTransactionRepository: InMemoryTransactionRepository;
let sut: CreateTransactionUseCase;

describe("CreateTransactionUseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryTransactionRepository = new InMemoryTransactionRepository();
    sut = new CreateTransactionUseCase(
      inMemoryUserRepository,
      inMemoryTransactionRepository
    );
  });

  it("Should be able to create a transaction", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const { transaction } = await sut.execute({
      userId: user.id.toString(),
      type: "credit",
      description: "fake description",
      value: 150,
    });

    expect(transaction.id).toBeTruthy();
  });

  it("Should not be able to create a transaction with an unexistent user", async () => {
    await expect(() => {
      return sut.execute({
        userId: "user-01",
        type: "credit",
        description: "fake description",
        value: 150,
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to create a transaction with invalid transaction type", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    await expect(() => {
      return sut.execute({
        userId: user.id.toString(),
        type: "bonus",
        description: "fake description",
        value: 150,
      });
    }).rejects.toBeInstanceOf(InvalidTransactionTypeError);
  });

  it("Should not be able to create a transaction with a negative number", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    await expect(() => {
      return sut.execute({
        userId: user.id.toString(),
        type: "credit",
        description: "fake description",
        value: -150,
      });
    }).rejects.toBeInstanceOf(InvalidTransactionValueError);
  });
});
