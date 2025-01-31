export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotAuthenticatedError extends AuthError {
  constructor() {
    super('You must be logged in to perform this action');
    this.name = 'NotAuthenticatedError';
  }
}

export class InsufficientPermissionsError extends AuthError {
  constructor(requiredRoles: string[]) {
    super(`Insufficient permissions. Required roles: ${requiredRoles.join(' or ')}`);
    this.name = 'InsufficientPermissionsError';
  }
}
