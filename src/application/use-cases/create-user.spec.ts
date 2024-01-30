import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use-error";
import { CreateUserUseCase } from "./create-user";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: CreateUserUseCase;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to create a new user", async () => {
    const { user } = await sut.execute({
      name: "fake user",
      email: "fake@test.com",
      password: "123456",
    });
    expect(user.id).toBeTruthy();
  });

  it("Should not be able to create a user with duplicate email", async () => {
    const newUser = createUserFactory({ email: "fake@test.com" });
    inMemoryUserRepository.items.push(newUser);
    await expect(() =>
      sut.execute({
        name: "fake user",
        email: newUser.email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
