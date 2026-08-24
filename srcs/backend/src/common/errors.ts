export class NotFoundError extends Error {
  readonly statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
