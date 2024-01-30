import { Entity } from "./entity";
import { UniqueID } from "./value-objects/unique-id";

export interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: UserProps, id?: UniqueID) {
    return new User(props, id);
  }
}
