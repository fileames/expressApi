export class HttpException extends Error {
  status: number;
  message: string;
  status_code: number;

  constructor(status: number, message: string, status_code: number) {
    super(message);
    this.status = status;
    this.message = message;
    this.status_code = status_code;
  }
}

export class DatabaseError extends HttpException {
  constructor(message?: string) {
    message = message || "Something wrong with database!";
    super(500, message, 103);
  }
}

export class RecipeNotFoundError extends HttpException {
  constructor(message?: string) {
    message = message || "Did not found recipe!";
    super(404, message, 104);
  }
}

export class ValidationError extends HttpException {
  constructor(message?: string) {
    message = message || "Input did not pass validation!";
    super(500, message, 105);
  }
}
