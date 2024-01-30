import { UserRepository } from "../../src/application/repositories/user-repository";
import { User } from "../../src/enterprise/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async save(user: User) {
    this.items.push(user);
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    return user ?? null;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);
    return user ?? null;
  }
}
