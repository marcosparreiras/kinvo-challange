export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Email already in use");
  }
}
