export class ShortPasswordError extends Error {
  constructor() {
    super("Passowrd should be at least 6 characters");
  }
}
