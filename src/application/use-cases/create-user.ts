import { hash } from "bcryptjs";
import { User } from "../../enterprise/user";
import { UserRepository } from "../repositories/user-repository";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use-error";
import { ShortPasswordError } from "../errors/short-password-error";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError();
    }
    if (password.length < 6) {
      throw new ShortPasswordError();
    }
    const hashedPassword = await hash(password, 6);
    const user = User.create({ name, email, password: hashedPassword });
    await this.userRepository.save(user);
    return { user };
  }
}
