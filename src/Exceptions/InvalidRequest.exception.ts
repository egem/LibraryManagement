export class InvalidRequest extends Error {
  constructor(message: string) {
    super(`Invalid Request: ${message}`);
  }
}
