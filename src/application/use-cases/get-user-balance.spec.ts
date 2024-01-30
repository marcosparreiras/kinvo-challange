import { createTransactionFactory } from "../../../tests/factories/create-transaction-factory";
import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryTransactionRepository } from "../../../tests/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { GetUserBalanceUseCase } from "./get-user-balance";

let inMemoryTransactionRepository: InMemoryTransactionRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: GetUserBalanceUseCase;

describe("GetUserBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new GetUserBalanceUseCase(
      inMemoryUserRepository,
      inMemoryTransactionRepository
    );
  });

  it("Should be able to get a user balance", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const transaction01 = createTransactionFactory({
      userId: user.id,
      type: "credit",
      value: 100,
    });
    const transaction02 = createTransactionFactory({
      userId: user.id,
      type: "credit",
      value: 200,
    });
    const transaction03 = createTransactionFactory({
      userId: user.id,
      type: "debt",
      value: 125,
    });
    inMemoryTransactionRepository.items.push(
      transaction01,
      transaction02,
      transaction03
    );

    const { balance } = await sut.execute({ userId: user.id.toString() });
    expect(balance).toEqual(175);
  });
});
