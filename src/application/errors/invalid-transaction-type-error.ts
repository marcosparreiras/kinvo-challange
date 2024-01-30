export class InvalidTransactionTypeError extends Error {
  constructor() {
    super("Transaction type must be credit or debt.");
  }
}
