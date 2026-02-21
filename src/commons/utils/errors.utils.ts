export class ServiceError extends Error {
  status = 400;

  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.status = statusCode;
  }
}
