export class NotFoundError extends Error {
  readonly statusCode = 404;

  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenRightsError extends Error{
  readonly statusCode = 403;
  
  constructor(message: string = "No rights on this file"){
    super(message);
    this.name = 'ForbiddenRightsError';
  }
}

export class InvalidAuthentificationError extends Error{
  readonly statusCode = 401;
  
  constructor(message: string = "Invalid authentification"){
    super(message);
    this.name = 'InvalidAuthentificationError';
  }
}

export class UnsupportedFileTypeError extends Error{
  readonly statusCode = 415;
  constructor(message: string = "Unsupported file type error"){
    super(message);
    this.name = 'UnsupportedFileTypeError';
  }
}

