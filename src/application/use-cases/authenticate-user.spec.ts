import { hash } from "bcryptjs";
import { createUserFactory } from "../../../tests/factories/create-user-factory";
import { InMemoryUserRepository } from "../../../tests/repositories/in-memory-user-repository";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new AuthenticateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to authenticate a user", async () => {
    const newUser = createUserFactory({
      password: await hash("123456", 6),
      email: "fake@test.com",
    });
    inMemoryUserRepository.items.push(newUser);
    const { user } = await sut.execute({
      email: "fake@test.com",
      password: "123456",
    });
    expect(user.id).toEqual(newUser.id);
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const newUser = createUserFactory({
      password: await hash("123456", 6),
      email: "fake@test.com",
    });
    inMemoryUserRepository.items.push(newUser);
    await expect(() =>
      sut.execute({
        email: "fake@test.com",
        password: "654321",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("Should not be able to authenticate a user with a unexisetent email", async () => {
    const newUser = createUserFactory({
      password: await hash("123456", 6),
      email: "fake@test.com",
    });
    inMemoryUserRepository.items.push(newUser);
    await expect(() =>
      sut.execute({
        email: "nonexistent@test.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
