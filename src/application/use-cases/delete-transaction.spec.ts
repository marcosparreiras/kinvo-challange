import { createTransactionFactory } from "../../../tests/factories/create-transaction-factory";
import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryTransactionRepository } from "../../../tests/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { DeleteTransactionUseCase } from "./delete-transaction";

let inMemoryTransactionRepository: InMemoryTransactionRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: DeleteTransactionUseCase;

describe("DeleteTransactionUseCase", () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteTransactionUseCase(
      inMemoryUserRepository,
      inMemoryTransactionRepository
    );
  });

  it("Should be able to delete a transaction", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const transaction = createTransactionFactory({ userId: user.id });
    inMemoryTransactionRepository.items.push(transaction);
    await sut.execute({
      transactionId: transaction.id.toString(),
      userId: user.id.toString(),
    });
    expect(inMemoryTransactionRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete anotther user transaction", async () => {
    const user01 = createUserFactory();
    const user02 = createUserFactory();
    inMemoryUserRepository.items.push(user01, user02);
    const transaction = createTransactionFactory({ userId: user01.id });
    inMemoryTransactionRepository.items.push(transaction);
    await expect(() =>
      sut.execute({
        transactionId: transaction.id.toString(),
        userId: user02.id.toString(),
      })
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
