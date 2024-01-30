export class InvalidTransactionValueError extends Error {
  constructor() {
    super("Transaction Value should be a positive number");
  }
}
