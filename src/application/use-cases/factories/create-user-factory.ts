import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { CreateUserUseCase } from "../create-user";

export function makeCreateUserUseCase() {
  const userRepository = new KnexUserRepository();
  const useCase = new CreateUserUseCase(userRepository);
  return useCase;
}
