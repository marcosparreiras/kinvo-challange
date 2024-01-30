import { User, UserProps } from "../../src/enterprise/user";
import { UniqueID } from "../../src/enterprise/value-objects/unique-id";

export function createUserFactory(
  overide: Partial<UserProps> = {},
  id?: UniqueID
) {
  return User.create(
    {
      name: "Fake user",
      email: "fake@test.com",
      password: "123456",
      ...overide,
    },
    id
  );
}
