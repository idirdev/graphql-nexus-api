import { GraphQLError } from "graphql";

export class NotFoundError extends GraphQLError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID "${id}" not found`, {
      extensions: {
        code: "NOT_FOUND",
        resource,
        id,
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "You must be logged in to perform this action") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = "You do not have permission to perform this action") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        field,
      },
    });
  }
}
