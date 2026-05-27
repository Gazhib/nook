export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class RoomError extends Error {
  constructor(message = "Something went wrong with Room") {
    super(message);
    this.name = "RoomError";
  }
}

export class UserError extends Error {
  constructor(message = "Something went wrong with User") {
    super(message);
    this.name = "UserError";
  }
}
