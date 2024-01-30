import { createTransactionFactory } from "../../../tests/factories/create-transaction-factory";
import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryTransactionRepository } from "../../../tests/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { UpdateTransactionUseCase } from "./update-transaction";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryTransactionRepository: InMemoryTransactionRepository;
let sut: UpdateTransactionUseCase;

describe("UpdateTransactionUseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryTransactionRepository = new InMemoryTransactionRepository();
    sut = new UpdateTransactionUseCase(
      inMemoryUserRepository,
      inMemoryTransactionRepository
    );
  });

  it("Should be able to update a transaction", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const newTransaction = createTransactionFactory({ userId: user.id });
    inMemoryTransactionRepository.items.push(newTransaction);
    const { transaction } = await sut.execute({
      transactionId: newTransaction.id.toString(),
      userId: user.id.toString(),
      description: "some update",
    });
    expect(transaction.id).toEqual(newTransaction.id);
    expect(transaction.description).toEqual("some update");
  });

  it("Should not be able to update another user transaction", async () => {
    const user01 = createUserFactory();
    const user02 = createUserFactory();
    inMemoryUserRepository.items.push(user01, user02);
    const newTransaction = createTransactionFactory({ userId: user01.id });
    inMemoryTransactionRepository.items.push(newTransaction);

    await expect(() =>
      sut.execute({
        transactionId: newTransaction.id.toString(),
        userId: user02.id.toString(),
        description: "some update",
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
