import { User } from "../../enterprise/user";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { UserRepository } from "../repositories/user-repository";
import { compare } from "bcryptjs";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserUseCaseResponse {
  user: User;
}

export class AuthenticateUserUseCase {
  constructor(private userRepostory: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepostory.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
    }
    return { user };
  }
}
