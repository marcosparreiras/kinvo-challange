import Optional from "../types/optional";
import { Entity } from "./entity";
import { UniqueID } from "./value-objects/unique-id";

export interface TransactionProps {
  userId: UniqueID;
  value: number;
  description: string;
  type: "credit" | "debt";
  createdAt: Date;
  updatedAt?: Date;
}

export class Transaction extends Entity<TransactionProps> {
  get value() {
    return this.props.value;
  }

  get description() {
    return this.props.description;
  }

  get type() {
    return this.props.type;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set value(value: number) {
    this.props.value = value;
    this.touch();
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  set type(type: "credit" | "debt") {
    this.props.type = type;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<TransactionProps, "createdAt">, id?: UniqueID) {
    return new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
