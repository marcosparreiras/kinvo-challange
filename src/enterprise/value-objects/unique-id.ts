import { randomUUID } from "node:crypto";

export class UniqueID {
  private value: string;

  toString() {
    return this.value;
  }

  compere(id: UniqueID) {
    return this.value === id.toString();
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
