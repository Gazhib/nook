/**
 * Application error hierarchy.
 *
 * Every operational error carries the HTTP `status` it should map to and an
 * `expose` flag that decides whether `message` is safe to send to the client.
 * Unexpected/internal errors keep `expose = false` so their details are logged
 * server-side but never leaked in the response. The central handler in
 * `index.ts` reads these fields, so throwing the right subclass is enough to
 * get the correct status code and a consistent `{ error }` response envelope.
 */
export class AppError extends Error {
  readonly status: number;
  readonly expose: boolean;

  constructor(message: string, status = 500, expose = true) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.expose = expose;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, new.target);
    }
  }
}

/** 400 - the client sent something we cannot accept. */
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

/** 401 - the client is not authenticated (missing/invalid credentials). */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/** 403 - authenticated, but not allowed to perform this action. */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/** 404 - the requested resource does not exist (or is hidden from the caller). */
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

/** 409 - the request conflicts with current state (e.g. duplicate record). */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/**
 * Internal failures that are not the caller's fault. The message is logged but
 * not exposed; clients receive a generic "Internal server error".
 */
export class RoomError extends AppError {
  constructor(message = "Something went wrong with Room") {
    super(message, 500, false);
  }
}

export class UserError extends AppError {
  constructor(message = "Something went wrong with User") {
    super(message, 500, false);
  }
}
