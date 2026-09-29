export class NotFoundError extends Error {
  readonly statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;

  constructor(message: string = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class ForbiddenRightsError extends Error {
  readonly statusCode = 403;

  constructor(message: string = 'No rights on this file') {
    super(message);
    this.name = 'ForbiddenRightsError';
  }
}

export class InvalidAuthentificationError extends Error {
  readonly statusCode = 401;

  constructor(message: string = 'Invalid authentification') {
    super(message);
    this.name = 'InvalidAuthentificationError';
  }
}

export class UnsupportedFileTypeError extends Error {
  readonly statusCode = 415;
  constructor(message: string = 'Unsupported file type error') {
    super(message);
    this.name = 'UnsupportedFileTypeError';
  }
}
