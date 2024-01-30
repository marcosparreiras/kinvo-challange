import { UserRepository } from "../../application/repositories/user-repository";
import { User } from "../../enterprise/user";
import { UniqueID } from "../../enterprise/value-objects/unique-id";
import { knex } from "../../lib/knex";

export class KnexUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await knex("users").insert({
      name: user.name,
      email: user.email,
      id: user.id.toString(),
      password: user.password,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await knex("users")
      .select("*")
      .where("email", email)
      .first();
    if (!result) {
      return null;
    }

    return User.create(
      { name: result.name, email: result.email, password: result.password },
      new UniqueID(result.id)
    );
  }

  async findById(id: string): Promise<User | null> {
    const result = await knex("users").select("*").where("id", id).first();

    if (!result) {
      return null;
    }

    return User.create(
      { name: result.name, email: result.email, password: result.password },
      new UniqueID(result.id)
    );
  }
}
