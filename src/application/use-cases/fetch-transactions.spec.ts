import { createTransactionFactory } from "../../../tests/factories/create-transaction-factory";
import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryTransactionRepository } from "../../../tests/repositories/in-memory-transaction-repository";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { FetchTransactionsUseCase } from "./fetch-transactions";

let inMemoryTransactionRepository: InMemoryTransactionRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: FetchTransactionsUseCase;

describe("FecthTransactionsUseCase", () => {
  beforeEach(() => {
    inMemoryTransactionRepository = new InMemoryTransactionRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new FetchTransactionsUseCase(
      inMemoryUserRepository,
      inMemoryTransactionRepository
    );
  });

  it("Should be able to fetch a user transacations", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const transaction01 = createTransactionFactory({ userId: user.id });
    const transaction02 = createTransactionFactory({ userId: user.id });
    inMemoryTransactionRepository.items.push(transaction01, transaction02);

    const { transactions } = await sut.execute({
      userId: user.id.toString(),
      page: 1,
    });
    expect(transactions).toHaveLength(2);
  });

  it("Should be able to paginate the user transactions result", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    for (let count = 1; count <= 24; count++) {
      const transacation = createTransactionFactory({ userId: user.id });
      inMemoryTransactionRepository.items.push(transacation);
    }
    const { transactions } = await sut.execute({
      userId: user.id.toString(),
      page: 2,
    });
    expect(transactions).toHaveLength(4);
  });

  it("Should be able to filter the users transactions by date", async () => {
    const user = createUserFactory();
    inMemoryUserRepository.items.push(user);
    const transaction01 = createTransactionFactory({
      userId: user.id,
      createdAt: new Date(2023, 0, 8),
    });
    const transaction02 = createTransactionFactory({
      userId: user.id,
      createdAt: new Date(2023, 0, 13),
    });
    const transaction03 = createTransactionFactory({
      userId: user.id,
      createdAt: new Date(2023, 1, 15),
    });
    const transaction04 = createTransactionFactory({
      userId: user.id,
      createdAt: new Date(2023, 1, 22),
    });
    inMemoryTransactionRepository.items.push(
      transaction01,
      transaction02,
      transaction03,
      transaction04
    );

    const { transactions } = await sut.execute({
      userId: user.id.toString(),
      page: 1,
      startDate: new Date(2023, 0, 10),
      endDate: new Date(2023, 1, 16),
    });

    expect(transactions).toHaveLength(2);
  });
});
