class HttpException extends Error {
  private status: number;
  public message: string;
  private params: object;

  constructor(status: number, message: string, params?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.params = params!;
  }
}

export default HttpException;
