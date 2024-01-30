import { KnexUserRepository } from "../../../repositories/knex/knex-user-repository";
import { AuthenticateUserUseCase } from "../authenticate-user";

export function makeAuthenticateUserUseCase() {
  const userRepository = new KnexUserRepository();
  const useCase = new AuthenticateUserUseCase(userRepository);
  return useCase;
}
